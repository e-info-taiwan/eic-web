import { auth } from './config'

/**
 * Get the current user's Firebase ID token
 * Returns null if no user is signed in
 */
export async function getIdToken(): Promise<string | null> {
  try {
    const user = auth.currentUser

    if (!user) {
      return null
    }

    return await user.getIdToken()
  } catch (error) {
    console.error('[getIdToken] Failed to get ID token:', error)
    return null
  }
}
