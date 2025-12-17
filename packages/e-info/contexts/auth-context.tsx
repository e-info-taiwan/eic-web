import type { User } from 'firebase/auth'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { getFirebaseErrorMessage } from '~/constants/auth'
import {
  checkEmailExists as checkEmailExistsApi,
  onAuthChange,
  sendPasswordReset as sendPasswordResetApi,
  signInWithApple as signInWithAppleApi,
  signInWithEmail as signInWithEmailApi,
  signInWithFacebook as signInWithFacebookApi,
  signInWithGoogle as signInWithGoogleApi,
  signOut as signOutApi,
  signUpWithEmail as signUpWithEmailApi,
} from '~/lib/firebase/auth'
import {
  checkUserProfileExists,
  getUserProfile,
} from '~/lib/firebase/firestore'
import type { UserProfile } from '~/types/auth'

export type AuthContextType = {
  firebaseUser: User | null
  userProfile: UserProfile | null
  loading: boolean
  error: string | null
  needsRegistration: boolean
  signInWithGoogle: () => Promise<boolean>
  signInWithFacebook: () => Promise<boolean>
  signInWithApple: () => Promise<boolean>
  signInWithEmail: (email: string, password: string) => Promise<boolean>
  signUpWithEmail: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
  checkEmailExists: (email: string) => Promise<boolean>
  sendPasswordReset: (email: string) => Promise<boolean>
  clearError: () => void
  refreshUserProfile: () => Promise<void>
}

const defaultValue: AuthContextType = {
  firebaseUser: null,
  userProfile: null,
  loading: true,
  error: null,
  needsRegistration: false,
  signInWithGoogle: async () => false,
  signInWithFacebook: async () => false,
  signInWithApple: async () => false,
  signInWithEmail: async () => false,
  signUpWithEmail: async () => false,
  signOut: async () => {},
  checkEmailExists: async () => false,
  sendPasswordReset: async () => false,
  clearError: () => {},
  refreshUserProfile: async () => {},
}

const AuthContext = createContext<AuthContextType>(defaultValue)

type AuthProviderProps = {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [needsRegistration, setNeedsRegistration] = useState(false)

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setFirebaseUser(user)

      if (user) {
        // Check if user profile exists
        const profileExists = await checkUserProfileExists(user.uid)
        if (profileExists) {
          const profile = await getUserProfile(user.uid)
          setUserProfile(profile)
          setNeedsRegistration(false)
        } else {
          setNeedsRegistration(true)
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
        setNeedsRegistration(false)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const refreshUserProfile = useCallback(async () => {
    if (firebaseUser) {
      const profile = await getUserProfile(firebaseUser.uid)
      setUserProfile(profile)
      if (profile) {
        setNeedsRegistration(false)
      }
    }
  }, [firebaseUser])

  // Handle social login result
  const handleSocialLoginResult = useCallback(
    async (user: User): Promise<boolean> => {
      const profileExists = await checkUserProfileExists(user.uid)
      if (!profileExists) {
        setNeedsRegistration(true)
        return false // Needs to complete registration
      }
      const profile = await getUserProfile(user.uid)
      setUserProfile(profile)
      return true // Login successful
    },
    []
  )

  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    try {
      setError(null)
      const result = await signInWithGoogleApi()
      return await handleSocialLoginResult(result.user)
    } catch (err: unknown) {
      const errorCode =
        err && typeof err === 'object' && 'code' in err
          ? (err as { code: string }).code
          : ''
      setError(getFirebaseErrorMessage(errorCode))
      return false
    }
  }, [handleSocialLoginResult])

  const signInWithFacebook = useCallback(async (): Promise<boolean> => {
    try {
      setError(null)
      const result = await signInWithFacebookApi()
      return await handleSocialLoginResult(result.user)
    } catch (err: unknown) {
      const errorCode =
        err && typeof err === 'object' && 'code' in err
          ? (err as { code: string }).code
          : ''
      setError(getFirebaseErrorMessage(errorCode))
      return false
    }
  }, [handleSocialLoginResult])

  const signInWithApple = useCallback(async (): Promise<boolean> => {
    try {
      setError(null)
      const result = await signInWithAppleApi()
      return await handleSocialLoginResult(result.user)
    } catch (err: unknown) {
      const errorCode =
        err && typeof err === 'object' && 'code' in err
          ? (err as { code: string }).code
          : ''
      setError(getFirebaseErrorMessage(errorCode))
      return false
    }
  }, [handleSocialLoginResult])

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        setError(null)
        await signInWithEmailApi(email, password)
        return true
      } catch (err: unknown) {
        const errorCode =
          err && typeof err === 'object' && 'code' in err
            ? (err as { code: string }).code
            : ''
        setError(getFirebaseErrorMessage(errorCode))
        return false
      }
    },
    []
  )

  const signUpWithEmail = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        setError(null)
        await signUpWithEmailApi(email, password)
        setNeedsRegistration(true)
        return true
      } catch (err: unknown) {
        const errorCode =
          err && typeof err === 'object' && 'code' in err
            ? (err as { code: string }).code
            : ''
        setError(getFirebaseErrorMessage(errorCode))
        return false
      }
    },
    []
  )

  const signOut = useCallback(async () => {
    try {
      await signOutApi()
      setUserProfile(null)
      setNeedsRegistration(false)
    } catch (err: unknown) {
      const errorCode =
        err && typeof err === 'object' && 'code' in err
          ? (err as { code: string }).code
          : ''
      setError(getFirebaseErrorMessage(errorCode))
    }
  }, [])

  const checkEmailExists = useCallback(
    async (email: string): Promise<boolean> => {
      try {
        return await checkEmailExistsApi(email)
      } catch {
        return false
      }
    },
    []
  )

  const sendPasswordReset = useCallback(
    async (email: string): Promise<boolean> => {
      try {
        setError(null)
        await sendPasswordResetApi(email)
        return true
      } catch (err: unknown) {
        const errorCode =
          err && typeof err === 'object' && 'code' in err
            ? (err as { code: string }).code
            : ''
        setError(getFirebaseErrorMessage(errorCode))
        return false
      }
    },
    []
  )

  const value = useMemo(
    () => ({
      firebaseUser,
      userProfile,
      loading,
      error,
      needsRegistration,
      signInWithGoogle,
      signInWithFacebook,
      signInWithApple,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      checkEmailExists,
      sendPasswordReset,
      clearError,
      refreshUserProfile,
    }),
    [
      firebaseUser,
      userProfile,
      loading,
      error,
      needsRegistration,
      signInWithGoogle,
      signInWithFacebook,
      signInWithApple,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      checkEmailExists,
      sendPasswordReset,
      clearError,
      refreshUserProfile,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
