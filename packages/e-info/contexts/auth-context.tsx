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
  type Member,
  checkMemberExists,
  getMemberByFirebaseId,
} from '~/lib/graphql/member'

export type AuthContextType = {
  firebaseUser: User | null
  member: Member | null
  loading: boolean
  error: string | null
  needsRegistration: boolean
  signInWithGoogle: () => Promise<boolean>
  signInWithFacebook: () => Promise<boolean>
  signInWithApple: () => Promise<boolean>
  signInWithEmail: (email: string, password: string) => Promise<boolean>
  signUpWithEmail: (email: string, password: string) => Promise<User | null>
  signOut: () => Promise<void>
  checkEmailExists: (email: string) => Promise<boolean>
  sendPasswordReset: (email: string) => Promise<boolean>
  clearError: () => void
  refreshMember: () => Promise<void>
}

const defaultValue: AuthContextType = {
  firebaseUser: null,
  member: null,
  loading: true,
  error: null,
  needsRegistration: false,
  signInWithGoogle: async () => false,
  signInWithFacebook: async () => false,
  signInWithApple: async () => false,
  signInWithEmail: async () => false,
  signUpWithEmail: async () => null,
  signOut: async () => {},
  checkEmailExists: async () => false,
  sendPasswordReset: async () => false,
  clearError: () => {},
  refreshMember: async () => {},
}

const AuthContext = createContext<AuthContextType>(defaultValue)

type AuthProviderProps = {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [needsRegistration, setNeedsRegistration] = useState(false)

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      console.log('[AuthContext] onAuthChange:', user?.uid || 'null')
      setFirebaseUser(user)

      if (user) {
        // Check if member profile exists in CMS
        const memberExists = await checkMemberExists(user.uid)
        console.log('[AuthContext] Member exists (onAuthChange):', memberExists)
        if (memberExists) {
          const memberData = await getMemberByFirebaseId(user.uid)
          console.log('[AuthContext] Got member:', !!memberData)
          setMember(memberData)
          setNeedsRegistration(false)
        } else {
          console.log('[AuthContext] No member, needs registration')
          setNeedsRegistration(true)
          setMember(null)
        }
      } else {
        setMember(null)
        setNeedsRegistration(false)
      }

      console.log('[AuthContext] Setting loading to false')
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const refreshMember = useCallback(async () => {
    if (firebaseUser) {
      const memberData = await getMemberByFirebaseId(firebaseUser.uid)
      setMember(memberData)
      if (memberData) {
        setNeedsRegistration(false)
      }
    }
  }, [firebaseUser])

  // Social login functions using popup method
  // Returns true if login successful and profile exists, false if needs registration
  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    try {
      setError(null)
      const result = await signInWithGoogleApi()
      const memberExists = await checkMemberExists(result.user.uid)
      if (!memberExists) {
        setNeedsRegistration(true)
        return false // Needs to complete registration
      }
      return true // Login successful
    } catch (err: unknown) {
      console.error('[AuthContext] Google sign-in error:', err)
      const errorCode =
        err && typeof err === 'object' && 'code' in err
          ? (err as { code: string }).code
          : ''
      const errorMessage = getFirebaseErrorMessage(errorCode)
      console.error(
        '[AuthContext] Error code:',
        errorCode,
        '| Message:',
        errorMessage
      )
      setError(errorMessage)
      return false
    }
  }, [])

  const signInWithFacebook = useCallback(async (): Promise<boolean> => {
    try {
      setError(null)
      const result = await signInWithFacebookApi()
      const memberExists = await checkMemberExists(result.user.uid)
      if (!memberExists) {
        setNeedsRegistration(true)
        return false // Needs to complete registration
      }
      return true // Login successful
    } catch (err: unknown) {
      console.error('[AuthContext] Facebook sign-in error:', err)
      const errorCode =
        err && typeof err === 'object' && 'code' in err
          ? (err as { code: string }).code
          : ''
      const errorMessage = getFirebaseErrorMessage(errorCode)
      console.error(
        '[AuthContext] Error code:',
        errorCode,
        '| Message:',
        errorMessage
      )
      setError(errorMessage)
      return false
    }
  }, [])

  const signInWithApple = useCallback(async (): Promise<boolean> => {
    try {
      setError(null)
      const result = await signInWithAppleApi()
      const memberExists = await checkMemberExists(result.user.uid)
      if (!memberExists) {
        setNeedsRegistration(true)
        return false // Needs to complete registration
      }
      return true // Login successful
    } catch (err: unknown) {
      console.error('[AuthContext] Apple sign-in error:', err)
      const errorCode =
        err && typeof err === 'object' && 'code' in err
          ? (err as { code: string }).code
          : ''
      const errorMessage = getFirebaseErrorMessage(errorCode)
      console.error(
        '[AuthContext] Error code:',
        errorCode,
        '| Message:',
        errorMessage
      )
      setError(errorMessage)
      return false
    }
  }, [])

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        setError(null)
        await signInWithEmailApi(email, password)
        return true
      } catch (err: unknown) {
        console.error('[AuthContext] Email sign-in error:', err)
        const errorCode =
          err && typeof err === 'object' && 'code' in err
            ? (err as { code: string }).code
            : ''
        const errorMessage = getFirebaseErrorMessage(errorCode)
        console.error(
          '[AuthContext] Error code:',
          errorCode,
          '| Message:',
          errorMessage
        )
        setError(errorMessage)
        return false
      }
    },
    []
  )

  const signUpWithEmail = useCallback(
    async (email: string, password: string): Promise<User | null> => {
      try {
        setError(null)
        const result = await signUpWithEmailApi(email, password)
        setNeedsRegistration(true)
        return result.user
      } catch (err: unknown) {
        console.error('[AuthContext] Email sign-up error:', err)
        const errorCode =
          err && typeof err === 'object' && 'code' in err
            ? (err as { code: string }).code
            : ''
        const errorMessage = getFirebaseErrorMessage(errorCode)
        console.error(
          '[AuthContext] Error code:',
          errorCode,
          '| Message:',
          errorMessage
        )
        setError(errorMessage)
        return null
      }
    },
    []
  )

  const signOut = useCallback(async () => {
    try {
      await signOutApi()
      setMember(null)
      setNeedsRegistration(false)
    } catch (err: unknown) {
      console.error('[AuthContext] Sign-out error:', err)
      const errorCode =
        err && typeof err === 'object' && 'code' in err
          ? (err as { code: string }).code
          : ''
      const errorMessage = getFirebaseErrorMessage(errorCode)
      console.error(
        '[AuthContext] Error code:',
        errorCode,
        '| Message:',
        errorMessage
      )
      setError(errorMessage)
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
        console.error('[AuthContext] Password reset error:', err)
        const errorCode =
          err && typeof err === 'object' && 'code' in err
            ? (err as { code: string }).code
            : ''
        const errorMessage = getFirebaseErrorMessage(errorCode)
        console.error(
          '[AuthContext] Error code:',
          errorCode,
          '| Message:',
          errorMessage
        )
        setError(errorMessage)
        return false
      }
    },
    []
  )

  const value = useMemo(
    () => ({
      firebaseUser,
      member,
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
      refreshMember,
    }),
    [
      firebaseUser,
      member,
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
      refreshMember,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
