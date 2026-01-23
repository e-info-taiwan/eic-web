import { gql } from '@apollo/client'

import { getGqlClient } from '~/apollo-client'

// Fragment for member fields
const MEMBER_FIELDS = gql`
  fragment MemberFields on Member {
    id
    firebaseId
    firstName
    lastName
    email
    city
    birthDate
    state
    newsletterSubscription
    newsletterFrequency
    avatar {
      id
      imageFile {
        url
      }
      resized {
        original
        w480
        w800
      }
    }
    interestedSections {
      id
      slug
      name
    }
    favorites {
      id
      post {
        id
        title
      }
    }
    createdAt
    updatedAt
  }
`

// Query to get member by Firebase ID
const GET_MEMBER_BY_FIREBASE_ID = gql`
  ${MEMBER_FIELDS}
  query GetMemberByFirebaseId($firebaseId: String!) {
    members(where: { firebaseId: { equals: $firebaseId } }, take: 1) {
      ...MemberFields
    }
  }
`

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

// Mutation to create a new member
const CREATE_MEMBER = gql`
  ${MEMBER_FIELDS}
  mutation CreateMember($data: MemberCreateInput!) {
    createMember(data: $data) {
      ...MemberFields
    }
  }
`

// Mutation to update a member
const UPDATE_MEMBER = gql`
  ${MEMBER_FIELDS}
  mutation UpdateMember(
    $where: MemberWhereUniqueInput!
    $data: MemberUpdateInput!
  ) {
    updateMember(where: $where, data: $data) {
      ...MemberFields
    }
  }
`

// Mutation to create a favorite
const CREATE_FAVORITE = gql`
  mutation CreateFavorite($data: FavoriteCreateInput!) {
    createFavorite(data: $data) {
      id
      member {
        id
      }
      post {
        id
        title
      }
    }
  }
`

// Mutation to delete a favorite
const DELETE_FAVORITE = gql`
  mutation DeleteFavorite($where: FavoriteWhereUniqueInput!) {
    deleteFavorite(where: $where) {
      id
    }
  }
`

// Query to check if a post is favorited by a member
const CHECK_FAVORITE = gql`
  query CheckFavorite($memberId: ID!, $postId: ID!) {
    favorites(
      where: {
        member: { id: { equals: $memberId } }
        post: { id: { equals: $postId } }
      }
      take: 1
    ) {
      id
    }
  }
`

// Query to get member's favorites with full post data
const GET_MEMBER_FAVORITES = gql`
  query GetMemberFavorites($memberId: ID!, $take: Int, $skip: Int) {
    favorites(
      where: { member: { id: { equals: $memberId } } }
      orderBy: { createdAt: desc }
      take: $take
      skip: $skip
    ) {
      id
      createdAt
      post {
        id
        title
        publishTime
        brief
        heroImage {
          resized {
            original
            w480
            w800
          }
          resizedWebp {
            original
            w480
            w800
          }
        }
        tags {
          id
          name
        }
      }
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
 */
export const getMemberByFirebaseId = async (
  firebaseId: string
): Promise<Member | null> => {
  const client = getGqlClient()

  const result = await client.query<{ members: Member[] }>({
    query: GET_MEMBER_BY_FIREBASE_ID,
    variables: { firebaseId },
    fetchPolicy: 'network-only',
  })

  if (result.error) {
    console.error('getMemberByFirebaseId error:', result.error)
    return null
  }

  const members = result.data?.members
  return members && members.length > 0 ? members[0] : null
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
 */
export const createMember = async (
  data: CreateMemberInput
): Promise<Member> => {
  const client = getGqlClient()

  const result = await client.mutate<{ createMember: Member }>({
    mutation: CREATE_MEMBER,
    variables: { data },
  })

  if (result.error) {
    throw new Error(result.error.message)
  }

  if (!result.data?.createMember) {
    throw new Error('Failed to create member')
  }

  return result.data.createMember
}

/**
 * Update a member by ID
 */
export const updateMemberById = async (
  memberId: string,
  data: UpdateMemberInput
): Promise<Member> => {
  const client = getGqlClient()

  const result = await client.mutate<{ updateMember: Member }>({
    mutation: UPDATE_MEMBER,
    variables: {
      where: { id: memberId },
      data,
    },
  })

  if (result.error) {
    throw new Error(result.error.message)
  }

  if (!result.data?.updateMember) {
    throw new Error('Failed to update member')
  }

  return result.data.updateMember
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
  return updateMemberById(memberId, {
    avatar: { connect: { id: result.photoId } },
  })
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
 */
export const checkPostFavorited = async (
  memberId: string,
  postId: string
): Promise<string | null> => {
  const client = getGqlClient()

  const result = await client.query<{ favorites: { id: string }[] }>({
    query: CHECK_FAVORITE,
    variables: { memberId, postId },
    fetchPolicy: 'network-only',
  })

  if (result.error) {
    console.error('checkPostFavorited error:', result.error)
    return null
  }

  const favorites = result.data?.favorites
  return favorites && favorites.length > 0 ? favorites[0].id : null
}

/**
 * Add a post to member's favorites
 */
export const addFavorite = async (
  memberId: string,
  postId: string
): Promise<string | null> => {
  const client = getGqlClient()

  const result = await client.mutate<{ createFavorite: { id: string } }>({
    mutation: CREATE_FAVORITE,
    variables: {
      data: {
        member: { connect: { id: memberId } },
        post: { connect: { id: postId } },
      },
    },
  })

  if (result.error) {
    console.error('addFavorite error:', result.error)
    return null
  }

  return result.data?.createFavorite?.id || null
}

/**
 * Remove a post from member's favorites
 */
export const removeFavorite = async (favoriteId: string): Promise<boolean> => {
  const client = getGqlClient()

  const result = await client.mutate<{ deleteFavorite: { id: string } }>({
    mutation: DELETE_FAVORITE,
    variables: {
      where: { id: favoriteId },
    },
  })

  if (result.error) {
    console.error('removeFavorite error:', result.error)
    return false
  }

  return !!result.data?.deleteFavorite
}

/**
 * Get member's favorites with full post data
 */
export const getMemberFavorites = async (
  memberId: string,
  take?: number,
  skip?: number
): Promise<FavoriteWithPost[]> => {
  const client = getGqlClient()

  const result = await client.query<{ favorites: FavoriteWithPost[] }>({
    query: GET_MEMBER_FAVORITES,
    variables: { memberId, take, skip },
    fetchPolicy: 'network-only',
  })

  if (result.error) {
    console.error('getMemberFavorites error:', result.error)
    return []
  }

  return result.data?.favorites || []
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
