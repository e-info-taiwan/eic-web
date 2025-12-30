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
  mutation UpdateMember($where: MemberWhereUniqueInput!, $data: MemberUpdateInput!) {
    updateMember(where: $where, data: $data) {
      ...MemberFields
    }
  }
`

// Types
export type MemberAvatar = {
  id: string
  resized: {
    original: string
    w480: string
    w800: string
  }
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
  interestedSections?: { connect: { id: string }[] } | { disconnect: { id: string }[] } | { set: { id: string }[] }
}

/**
 * Get member by Firebase UID
 */
export const getMemberByFirebaseId = async (
  firebaseId: string
): Promise<Member | null> => {
  const client = getGqlClient()

  const result = await client.query({
    query: GET_MEMBER_BY_FIREBASE_ID,
    variables: { firebaseId },
  })

  if (result.errors) {
    console.error('getMemberByFirebaseId error:', result.errors)
    return null
  }

  const members = result.data?.members
  return members && members.length > 0 ? members[0] : null
}

/**
 * Check if member exists by Firebase UID
 */
export const checkMemberExists = async (firebaseId: string): Promise<boolean> => {
  const client = getGqlClient()

  const result = await client.query({
    query: CHECK_MEMBER_EXISTS,
    variables: { firebaseId },
  })

  if (result.errors) {
    console.error('checkMemberExists error:', result.errors)
    return false
  }

  return (result.data?.membersCount ?? 0) > 0
}

/**
 * Create a new member
 */
export const createMember = async (data: CreateMemberInput): Promise<Member> => {
  const client = getGqlClient()

  const result = await client.mutate({
    mutation: CREATE_MEMBER,
    variables: { data },
  })

  if (result.errors) {
    throw new Error(result.errors[0].message)
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

  const result = await client.mutate({
    mutation: UPDATE_MEMBER,
    variables: {
      where: { id: memberId },
      data,
    },
  })

  if (result.errors) {
    throw new Error(result.errors[0].message)
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
      `Photo upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`
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
 */
export const getMemberAvatarUrl = (member: Member | null): string | null => {
  if (!member?.avatar) return null
  return member.avatar.resized.w480 || member.avatar.resized.original
}
