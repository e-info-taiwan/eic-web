import { gql } from '@apollo/client'

import { getGqlClient } from '~/apollo-client'

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

// Query to get member's reading history with full post data
const GET_READING_HISTORY = gql`
  query GetReadingHistory($memberId: ID!, $take: Int, $skip: Int!) {
    readingHistories(
      where: { member: { id: { equals: $memberId } } }
      orderBy: [{ createdAt: desc }]
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

// Mutation to create a new reading history
const CREATE_READING_HISTORY = gql`
  mutation CreateReadingHistory($data: ReadingHistoryCreateInput!) {
    createReadingHistory(data: $data) {
      id
      createdAt
    }
  }
`

// Mutation to update reading history (update timestamp)
const UPDATE_READING_HISTORY = gql`
  mutation UpdateReadingHistory(
    $where: ReadingHistoryWhereUniqueInput!
    $data: ReadingHistoryUpdateInput!
  ) {
    updateReadingHistory(where: $where, data: $data) {
      id
      createdAt
      updatedAt
    }
  }
`

// Mutation to delete a reading history
const DELETE_READING_HISTORY = gql`
  mutation DeleteReadingHistory($where: ReadingHistoryWhereUniqueInput!) {
    deleteReadingHistory(where: $where) {
      id
    }
  }
`

// Mutation to delete multiple reading histories
const DELETE_READING_HISTORIES = gql`
  mutation DeleteReadingHistories($where: [ReadingHistoryWhereUniqueInput!]!) {
    deleteReadingHistories(where: $where) {
      id
    }
  }
`

/**
 * Get member's reading history with full post data
 */
export const getReadingHistory = async (
  memberId: string,
  take?: number,
  skip: number = 0
): Promise<ReadingHistoryWithPost[]> => {
  const client = getGqlClient()

  const result = await client.query<{
    readingHistories: ReadingHistoryWithPost[]
  }>({
    query: GET_READING_HISTORY,
    variables: { memberId, take, skip },
    fetchPolicy: 'network-only',
  })

  if (result.error) {
    console.error('getReadingHistory error:', result.error)
    return []
  }

  return result.data?.readingHistories || []
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
 */
export const recordReadingHistory = async (
  memberId: string,
  postId: string
): Promise<string | null> => {
  const client = getGqlClient()

  // Check if record already exists
  const existing = await checkReadingHistoryExists(memberId, postId)

  if (existing) {
    // Update existing record's timestamp
    const result = await client.mutate<{
      updateReadingHistory: { id: string }
    }>({
      mutation: UPDATE_READING_HISTORY,
      variables: {
        where: { id: existing.id },
        data: {
          // Just trigger an update to refresh updatedAt
          // We use the current time as a marker
          updatedAt: new Date().toISOString(),
        },
      },
    })

    if (result.error) {
      console.error('updateReadingHistory error:', result.error)
      return null
    }

    return existing.id
  }

  // Create new record
  const result = await client.mutate<{
    createReadingHistory: { id: string }
  }>({
    mutation: CREATE_READING_HISTORY,
    variables: {
      data: {
        member: { connect: { id: memberId } },
        post: { connect: { id: postId } },
      },
    },
  })

  if (result.error) {
    console.error('createReadingHistory error:', result.error)
    return null
  }

  return result.data?.createReadingHistory?.id || null
}

/**
 * Delete a reading history record
 */
export const deleteReadingHistory = async (
  historyId: string
): Promise<boolean> => {
  const client = getGqlClient()

  const result = await client.mutate<{
    deleteReadingHistory: { id: string }
  }>({
    mutation: DELETE_READING_HISTORY,
    variables: {
      where: { id: historyId },
    },
  })

  if (result.error) {
    console.error('deleteReadingHistory error:', result.error)
    return false
  }

  return !!result.data?.deleteReadingHistory
}

/**
 * Delete multiple reading history records
 */
export const deleteReadingHistories = async (
  historyIds: string[]
): Promise<boolean> => {
  if (historyIds.length === 0) return true

  const client = getGqlClient()

  const result = await client.mutate<{
    deleteReadingHistories: { id: string }[]
  }>({
    mutation: DELETE_READING_HISTORIES,
    variables: {
      where: historyIds.map((id) => ({ id })),
    },
  })

  if (result.error) {
    console.error('deleteReadingHistories error:', result.error)
    return false
  }

  return !!result.data?.deleteReadingHistories
}
