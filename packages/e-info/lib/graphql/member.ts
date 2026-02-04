import { gql } from '@apollo/client'

import { getGqlClient } from '~/apollo-client'
import { getIdToken } from '~/lib/firebase/get-id-token'

// Query to check if member exists
const CHECK_MEMBER_EXISTS = gql`
  query CheckMemberExists($firebaseId: String!) {
    membersCount(where: { firebaseId: { equals: $firebaseId } })
  }
`

// Query to get all sections for notification settings
const GET_ALL_SECTIONS = gql`
  query GetAllSections {
    sections(orderBy: { sortOrder: asc }) {
      id
      slug
      name
    }
  }
`

// Query to count member's favorites
const COUNT_MEMBER_FAVORITES = gql`
  query CountMemberFavorites($memberId: ID!) {
    favoritesCount(where: { member: { id: { equals: $memberId } } })
  }
`

// Types
export type MemberAvatar = {
  id: string
  imageFile: {
    url: string
  } | null
  resized: {
    original: string
    w480: string
    w800: string
  } | null
}

export type MemberSection = {
  id: string
  slug: string
  name: string
}

export type MemberFavorite = {
  id: string
  post: {
    id: string
    title: string
  }
}

// Full favorite with complete post data for bookmarks page
export type FavoriteWithPost = {
  id: string
  createdAt: string
  post: {
    id: string
    title: string
    publishTime: string
    brief: string | Record<string, unknown> | null
    heroImage: {
      resized: {
        original: string
        w480: string
        w800: string
      } | null
      resizedWebp: {
        original: string
        w480: string
        w800: string
      } | null
    } | null
    tags: {
      id: string
      name: string
    }[]
  }
}

export type Member = {
  id: string
  firebaseId: string
  firstName: string | null
  lastName: string | null
  email: string | null
  city: string | null
  birthDate: string | null
  state: string | null
  newsletterSubscription: string | null
  newsletterFrequency: string | null
  avatar: MemberAvatar | null
  interestedSections: MemberSection[]
  favorites: MemberFavorite[]
  createdAt: string
  updatedAt: string
}

export type CreateMemberInput = {
  firebaseId: string
  email: string
  firstName?: string
  lastName?: string
  city?: string
  birthDate?: string
  newsletterSubscription?: string
  newsletterFrequency?: string
  interestedSections?: { connect: { id: string }[] }
}

export type UpdateMemberInput = {
  firstName?: string
  lastName?: string
  city?: string
  birthDate?: string
  email?: string
  newsletterSubscription?: string
  newsletterFrequency?: string
  avatar?: { connect: { id: string } } | { disconnect: true }
  interestedSections?:
    | { connect: { id: string }[] }
    | { disconnect: { id: string }[] }
    | { set: { id: string }[] }
}

/**
 * Get member by Firebase UID
 * Uses API route with Firebase token verification
 */
export const getMemberByFirebaseId = async (
  firebaseId: string
): Promise<Member | null> => {
  const idToken = await getIdToken()

  try {
    const response = await fetch('/api/member/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken,
        firebaseId,
      }),
    })

    const result = (await response.json()) as {
      success?: boolean
      member?: Member | null
      error?: string
    }

    if (!response.ok || !result.success) {
      console.error('getMemberByFirebaseId error:', result.error)
      return null
    }

    return result.member || null
  } catch (error) {
    console.error('getMemberByFirebaseId error:', error)
    return null
  }
}

/**
 * Check if member exists by Firebase UID
 */
export const checkMemberExists = async (
  firebaseId: string
): Promise<boolean> => {
  const client = getGqlClient()

  const result = await client.query<{ membersCount: number }>({
    query: CHECK_MEMBER_EXISTS,
    variables: { firebaseId },
    fetchPolicy: 'network-only',
  })

  if (result.error) {
    console.error('checkMemberExists error:', result.error)
    return false
  }

  return (result.data?.membersCount ?? 0) > 0
}

/**
 * Create a new member
 * Uses API route with Firebase token verification
 */
export const createMember = async (
  data: CreateMemberInput
): Promise<Member> => {
  const idToken = await getIdToken()

  const response = await fetch('/api/member/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken,
      data,
    }),
  })

  const result = (await response.json()) as {
    success?: boolean
    member?: Member
    error?: string
  }

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Failed to create member')
  }

  if (!result.member) {
    throw new Error('Failed to create member')
  }

  return result.member
}

/**
 * Update a member by ID
 * Uses API route with Firebase token verification
 */
export const updateMemberById = async (
  memberId: string,
  data: UpdateMemberInput,
  firebaseId: string
): Promise<Member> => {
  const idToken = await getIdToken()

  const response = await fetch('/api/member/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken,
      memberId,
      firebaseId,
      data,
    }),
  })

  const result = (await response.json()) as {
    success?: boolean
    member?: Member
    error?: string
  }

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Failed to update member')
  }

  if (!result.member) {
    throw new Error('Failed to update member')
  }

  return result.member
}

/**
 * Update member's avatar by uploading a new photo
 * Uses a local API proxy to bypass CORS restrictions
 */
export const updateMemberAvatar = async (
  memberId: string,
  file: File,
  userId: string
): Promise<Member> => {
  // Use our API proxy to upload the photo (bypasses CORS)
  const formData = new FormData()
  formData.append('file', file)
  formData.append('name', `avatar-${userId}-${Date.now()}`)

  let uploadResponse
  try {
    uploadResponse = await fetch('/api/upload-photo', {
      method: 'POST',
      body: formData,
    })
  } catch (err) {
    console.error('Photo upload request error:', err)
    throw new Error(
      `Photo upload failed: ${
        err instanceof Error ? err.message : 'Unknown error'
      }`
    )
  }

  const result = (await uploadResponse.json()) as {
    success: boolean
    photoId?: string
    error?: string
  }

  if (!result.success || !result.photoId) {
    console.error('Photo upload failed:', result.error)
    throw new Error(result.error || 'Failed to upload photo')
  }

  // Then, connect the photo to the member
  return updateMemberById(
    memberId,
    {
      avatar: { connect: { id: result.photoId } },
    },
    userId
  )
}

/**
 * Helper to get display name from member
 */
export const getMemberDisplayName = (member: Member): string => {
  if (member.lastName && member.firstName) {
    return `${member.lastName}${member.firstName}`
  }
  if (member.lastName) {
    return member.lastName
  }
  if (member.firstName) {
    return member.firstName
  }
  return member.email || ''
}

/**
 * Helper to get avatar URL from member
 * Falls back to original image URL if resized versions are not yet available
 */
export const getMemberAvatarUrl = (member: Member | null): string | null => {
  if (!member?.avatar) return null
  // Try resized versions first, then fall back to original imageFile URL
  return (
    member.avatar.resized?.w480 ||
    member.avatar.resized?.original ||
    member.avatar.imageFile?.url ||
    null
  )
}

/**
 * Check if a post is favorited by the member
 * Uses API route with Firebase token verification
 */
export const checkPostFavorited = async (
  memberId: string,
  postId: string,
  firebaseId: string
): Promise<string | null> => {
  const idToken = await getIdToken()

  try {
    const response = await fetch('/api/favorites/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken,
        memberId,
        firebaseId,
        postId,
      }),
    })

    const result = (await response.json()) as {
      success?: boolean
      favoriteId?: string | null
      error?: string
    }

    if (!response.ok || !result.success) {
      console.error('checkPostFavorited error:', result.error)
      return null
    }

    return result.favoriteId || null
  } catch (error) {
    console.error('checkPostFavorited error:', error)
    return null
  }
}

/**
 * Add a post to member's favorites
 * Uses API route with Firebase token verification
 */
export const addFavorite = async (
  memberId: string,
  postId: string,
  firebaseId: string
): Promise<string | null> => {
  const idToken = await getIdToken()

  try {
    const response = await fetch('/api/favorites/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken,
        memberId,
        firebaseId,
        postId,
      }),
    })

    const result = (await response.json()) as {
      success?: boolean
      favoriteId?: string
      error?: string
    }

    if (!response.ok || !result.success) {
      console.error('addFavorite error:', result.error)
      return null
    }

    return result.favoriteId || null
  } catch (error) {
    console.error('addFavorite error:', error)
    return null
  }
}

/**
 * Remove a post from member's favorites
 * Uses API route with Firebase token verification
 */
export const removeFavorite = async (
  favoriteId: string,
  firebaseId: string
): Promise<boolean> => {
  const idToken = await getIdToken()

  try {
    const response = await fetch('/api/favorites/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken,
        favoriteId,
        firebaseId,
      }),
    })

    const result = (await response.json()) as {
      success?: boolean
      error?: string
    }

    if (!response.ok || !result.success) {
      console.error('removeFavorite error:', result.error)
      return false
    }

    return true
  } catch (error) {
    console.error('removeFavorite error:', error)
    return false
  }
}

/**
 * Get member's favorites with full post data
 * Uses API route with Firebase token verification
 */
export const getMemberFavorites = async (
  memberId: string,
  firebaseId: string,
  take?: number,
  skip?: number
): Promise<FavoriteWithPost[]> => {
  const idToken = await getIdToken()

  try {
    const response = await fetch('/api/favorites/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken,
        memberId,
        firebaseId,
        take,
        skip,
      }),
    })

    const result = (await response.json()) as {
      success?: boolean
      favorites?: FavoriteWithPost[]
      total?: number
      error?: string
    }

    if (!response.ok || !result.success) {
      console.error('getMemberFavorites error:', result.error)
      return []
    }

    return result.favorites || []
  } catch (error) {
    console.error('getMemberFavorites error:', error)
    return []
  }
}

/**
 * Get total count of member's favorites
 */
export const getMemberFavoritesCount = async (
  memberId: string
): Promise<number> => {
  const client = getGqlClient()

  const result = await client.query<{ favoritesCount: number }>({
    query: COUNT_MEMBER_FAVORITES,
    variables: { memberId },
    fetchPolicy: 'network-only',
  })

  if (result.error) {
    console.error('getMemberFavoritesCount error:', result.error)
    return 0
  }

  return result.data?.favoritesCount ?? 0
}

// Section type for notification settings
export type NotificationSection = {
  id: string
  slug: string
  name: string
}

/**
 * Get all sections for notification settings
 */
export const getAllSections = async (): Promise<NotificationSection[]> => {
  const client = getGqlClient()

  const result = await client.query<{ sections: NotificationSection[] }>({
    query: GET_ALL_SECTIONS,
  })

  if (result.error) {
    console.error('getAllSections error:', result.error)
    return []
  }

  return result.data?.sections || []
}
