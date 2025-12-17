import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

import type { RegisterFormData, UserProfile } from '~/types/auth'

import { db } from './config'

const USERS_COLLECTION = 'users'

// Get user profile
export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const docRef = doc(db, USERS_COLLECTION, uid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile
  }
  return null
}

// Create user profile
export const createUserProfile = async (
  uid: string,
  formData: RegisterFormData
): Promise<UserProfile> => {
  const userProfile: UserProfile = {
    uid,
    email: formData.email,
    displayName: formData.name,
    location: formData.location || null,
    birthDate: formData.birthDate || null,
    interestedCategories: formData.interestedCategories,
    newsletterSubscriptions: {
      dailyNewsletter: formData.dailyNewsletter,
      weeklyNewsletter: formData.weeklyNewsletter,
      newsletterFormat: formData.newsletterFormat,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await setDoc(doc(db, USERS_COLLECTION, uid), userProfile)
  return userProfile
}

// Create user profile from social login (minimal info)
export const createUserProfileFromSocialLogin = async (
  uid: string,
  email: string,
  displayName: string
): Promise<UserProfile> => {
  const userProfile: UserProfile = {
    uid,
    email,
    displayName,
    location: null,
    birthDate: null,
    interestedCategories: [],
    newsletterSubscriptions: {
      dailyNewsletter: false,
      weeklyNewsletter: false,
      newsletterFormat: 'general',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await setDoc(doc(db, USERS_COLLECTION, uid), userProfile)
  return userProfile
}

// Update user profile
export const updateUserProfile = async (
  uid: string,
  updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>
): Promise<void> => {
  const docRef = doc(db, USERS_COLLECTION, uid)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

// Check if user profile exists
export const checkUserProfileExists = async (uid: string): Promise<boolean> => {
  const profile = await getUserProfile(uid)
  return profile !== null
}
