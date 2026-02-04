import * as admin from 'firebase-admin'
import type { DecodedIdToken } from 'firebase-admin/auth'

import {
  FIREBASE_ADMIN_CLIENT_EMAIL,
  FIREBASE_ADMIN_PRIVATE_KEY,
  FIREBASE_ADMIN_PROJECT_ID,
  FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH,
} from '~/constants/config'

// Track if Firebase Admin is initialized
let isInitialized = false
let isConfigured = false

/**
 * Check if Firebase Admin SDK is configured
 * Returns true if either service account path or individual credentials are set
 */
function checkFirebaseAdminConfigured(): boolean {
  // Check for service account file path
  if (FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH) {
    return true
  }

  // Check for individual credentials (all three must be present)
  if (
    FIREBASE_ADMIN_PROJECT_ID &&
    FIREBASE_ADMIN_CLIENT_EMAIL &&
    FIREBASE_ADMIN_PRIVATE_KEY
  ) {
    return true
  }

  return false
}

/**
 * Initialize Firebase Admin SDK
 * Uses service account file if path is provided, otherwise uses individual credentials
 */
function initializeFirebaseAdmin(): boolean {
  if (isInitialized) {
    return isConfigured
  }

  isInitialized = true
  isConfigured = checkFirebaseAdminConfigured()

  if (!isConfigured) {
    console.log(
      '[Firebase Admin] Not configured - verification will be skipped (graceful degradation)'
    )
    return false
  }

  try {
    // Check if already initialized (e.g., in hot reload scenarios)
    if (admin.apps.length > 0) {
      return true
    }

    if (FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH) {
      // Initialize with service account file
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const serviceAccount = require(FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH)
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })
      console.log(
        '[Firebase Admin] Initialized with service account file:',
        FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH
      )
    } else {
      // Initialize with individual credentials
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: FIREBASE_ADMIN_PRIVATE_KEY,
        }),
      })
      console.log(
        '[Firebase Admin] Initialized with individual credentials for project:',
        FIREBASE_ADMIN_PROJECT_ID
      )
    }

    return true
  } catch (error) {
    console.error('[Firebase Admin] Failed to initialize:', error)
    isConfigured = false
    return false
  }
}

export type VerifyFirebaseResult =
  | { success: true; uid: string; decodedToken: DecodedIdToken }
  | { success: false; error: string; skipped?: boolean }

/**
 * Verify a Firebase ID token
 * Returns the decoded token with user information if valid
 *
 * Graceful degradation: If Firebase Admin is not configured,
 * returns success with skipped=true (maintains original behavior for dev/local)
 */
export async function verifyFirebaseToken(
  idToken: string
): Promise<VerifyFirebaseResult> {
  // Initialize Firebase Admin (only runs once)
  const configured = initializeFirebaseAdmin()

  // Graceful degradation: if not configured, skip verification
  if (!configured) {
    console.log('[Firebase Admin] Verification skipped - not configured')
    return {
      success: false,
      error: 'Firebase Admin not configured',
      skipped: true,
    }
  }

  if (!idToken) {
    return {
      success: false,
      error: 'No ID token provided',
    }
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    return {
      success: true,
      uid: decodedToken.uid,
      decodedToken,
    }
  } catch (error) {
    console.error('[Firebase Admin] Token verification failed:', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Token verification failed',
    }
  }
}

/**
 * Check if Firebase Admin verification is enabled
 * Useful for determining whether to require authentication in API routes
 */
export function isFirebaseAdminEnabled(): boolean {
  initializeFirebaseAdmin()
  return isConfigured
}
