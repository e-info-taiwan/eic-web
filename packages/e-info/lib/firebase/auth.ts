import type { User, UserCredential } from 'firebase/auth'
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updatePassword,
} from 'firebase/auth'

import { auth } from './config'

// Providers
const googleProvider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()
const appleProvider = new OAuthProvider('apple.com')

// Sign in with Google (popup method)
export const signInWithGoogle = (): Promise<UserCredential> =>
  signInWithPopup(auth, googleProvider)

// Sign in with Facebook (popup method)
export const signInWithFacebook = (): Promise<UserCredential> =>
  signInWithPopup(auth, facebookProvider)

// Sign in with Apple (popup method)
export const signInWithApple = (): Promise<UserCredential> =>
  signInWithPopup(auth, appleProvider)

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
export const onAuthChange = (callback: (_user: User | null) => void) =>
  onAuthStateChanged(auth, callback)

// Reauthenticate user with email/password (required before sensitive operations)
export const reauthenticateUser = async (
  user: User,
  currentPassword: string
): Promise<void> => {
  if (!user.email) {
    throw new Error('User email not found')
  }
  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, credential)
}

// Change password (requires recent authentication)
export const changePassword = async (
  user: User,
  newPassword: string
): Promise<void> => {
  await updatePassword(user, newPassword)
}

// Change password with reauthentication
export const changePasswordWithReauth = async (
  user: User,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  await reauthenticateUser(user, currentPassword)
  await updatePassword(user, newPassword)
}

// Check if user has password (email/password) login method
export const hasPasswordProvider = (user: User): boolean => {
  return user.providerData.some(
    (provider) => provider.providerId === 'password'
  )
}

// Get user's sign-in providers
export const getSignInProviders = (user: User): string[] => {
  return user.providerData.map((provider) => provider.providerId)
}
