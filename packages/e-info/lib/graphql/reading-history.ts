import { gql } from '@apollo/client'

import { getGqlClient } from '~/apollo-client'
import { getIdToken } from '~/lib/firebase/get-id-token'

// Type for reading history post data
export type ReadingHistoryPost = {
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

// Full reading history with complete post data
export type ReadingHistoryWithPost = {
  id: string
  createdAt: string
  post: ReadingHistoryPost | null
}

// Query to count member's reading history
const COUNT_READING_HISTORY = gql`
  query CountReadingHistory($memberId: ID!) {
    readingHistoriesCount(where: { member: { id: { equals: $memberId } } })
  }
`

// Query to check if a reading history exists for a specific member and post
const CHECK_READING_HISTORY = gql`
  query CheckReadingHistory($memberId: ID!, $postId: ID!) {
    readingHistories(
      where: {
        member: { id: { equals: $memberId } }
        post: { id: { equals: $postId } }
      }
      take: 1
    ) {
      id
      createdAt
    }
  }
`

/**
 * Get member's reading history with full post data
 * Uses API route with Firebase token verification
 */
export const getReadingHistory = async (
  memberId: string,
  firebaseId: string,
  take?: number,
  skip: number = 0
): Promise<ReadingHistoryWithPost[]> => {
  const idToken = await getIdToken()

  try {
    const response = await fetch('/api/reading-history/list', {
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
      readingHistories?: ReadingHistoryWithPost[]
      total?: number
      error?: string
    }

    if (!response.ok || !result.success) {
      console.error('getReadingHistory error:', result.error)
      return []
    }

    return result.readingHistories || []
  } catch (error) {
    console.error('getReadingHistory error:', error)
    return []
  }
}

/**
 * Get total count of member's reading history
 */
export const getReadingHistoryCount = async (
  memberId: string
): Promise<number> => {
  const client = getGqlClient()

  const result = await client.query<{ readingHistoriesCount: number }>({
    query: COUNT_READING_HISTORY,
    variables: { memberId },
    fetchPolicy: 'network-only',
  })

  if (result.error) {
    console.error('getReadingHistoryCount error:', result.error)
    return 0
  }

  return result.data?.readingHistoriesCount ?? 0
}

/**
 * Check if a reading history exists for a member and post
 * Returns the reading history ID if exists, null otherwise
 */
export const checkReadingHistoryExists = async (
  memberId: string,
  postId: string
): Promise<{ id: string; createdAt: string } | null> => {
  const client = getGqlClient()

  const result = await client.query<{
    readingHistories: { id: string; createdAt: string }[]
  }>({
    query: CHECK_READING_HISTORY,
    variables: { memberId, postId },
    fetchPolicy: 'network-only',
  })

  if (result.error) {
    console.error('checkReadingHistoryExists error:', result.error)
    return null
  }

  const histories = result.data?.readingHistories
  return histories && histories.length > 0 ? histories[0] : null
}

/**
 * Record a reading history for a member viewing a post
 * If a record already exists, updates the timestamp
 * Returns the reading history ID
 * Uses API route with Firebase token verification
 */
export const recordReadingHistory = async (
  memberId: string,
  postId: string,
  firebaseId: string
): Promise<string | null> => {
  const idToken = await getIdToken()

  try {
    const response = await fetch('/api/reading-history/record', {
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
      historyId?: string
      error?: string
    }

    if (!response.ok || !result.success) {
      console.error('recordReadingHistory error:', result.error)
      return null
    }

    return result.historyId || null
  } catch (error) {
    console.error('recordReadingHistory error:', error)
    return null
  }
}

/**
 * Delete a reading history record
 * Uses API route with Firebase token verification
 */
export const deleteReadingHistory = async (
  historyId: string,
  firebaseId: string
): Promise<boolean> => {
  const idToken = await getIdToken()

  try {
    const response = await fetch('/api/reading-history/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken,
        historyId,
        firebaseId,
      }),
    })

    const result = (await response.json()) as {
      success?: boolean
      error?: string
    }

    if (!response.ok || !result.success) {
      console.error('deleteReadingHistory error:', result.error)
      return false
    }

    return true
  } catch (error) {
    console.error('deleteReadingHistory error:', error)
    return false
  }
}

/**
 * Delete multiple reading history records
 * Uses API route with Firebase token verification
 */
export const deleteReadingHistories = async (
  historyIds: string[],
  firebaseId: string
): Promise<boolean> => {
  if (historyIds.length === 0) return true

  const idToken = await getIdToken()

  try {
    const response = await fetch('/api/reading-history/delete-multiple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken,
        historyIds,
        firebaseId,
      }),
    })

    const result = (await response.json()) as {
      success?: boolean
      error?: string
    }

    if (!response.ok || !result.success) {
      console.error('deleteReadingHistories error:', result.error)
      return false
    }

    return true
  } catch (error) {
    console.error('deleteReadingHistories error:', error)
    return false
  }
}
