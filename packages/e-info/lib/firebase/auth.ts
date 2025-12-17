import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'

import { auth } from './config'

// Providers
const googleProvider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()
const appleProvider = new OAuthProvider('apple.com')

// Sign in with Google
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)

// Sign in with Facebook
export const signInWithFacebook = () => signInWithPopup(auth, facebookProvider)

// Sign in with Apple
export const signInWithApple = () => signInWithPopup(auth, appleProvider)

// Sign in with email/password
export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password)

// Sign up with email/password
export const signUpWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password)

// Send password reset email
export const sendPasswordReset = (email: string) =>
  sendPasswordResetEmail(auth, email)

// Check if email exists
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email)
    return methods.length > 0
  } catch {
    return false
  }
}

// Sign out
export const signOut = () => firebaseSignOut(auth)

// Auth state observer
export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback)
