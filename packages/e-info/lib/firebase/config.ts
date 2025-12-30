import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

import { FIREBASE_CONFIG } from '~/constants/config'

// Initialize Firebase (prevent multiple initializations)
const app =
  getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApps()[0]

export const auth = getAuth(app)
export default app
