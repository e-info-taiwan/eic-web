import type { NextApiRequest, NextApiResponse } from 'next'

import { serverGraphQL } from '~/utils/server-graphql'
import {
  isFirebaseAdminEnabled,
  verifyFirebaseToken,
} from '~/utils/verify-firebase'

type RequestBody = {
  idToken: string
  memberId: string
  firebaseId: string
  take?: number
  skip?: number
}

type ReadingHistoryWithPost = {
  id: string
  createdAt: string
  post: {
    id: string
    title: string
    publishTime: string
    contentPreview: string | null
    heroImage: {
      resized: { original: string; w480: string; w800: string } | null
      resizedWebp: { original: string; w480: string; w800: string } | null
    } | null
    tags: { id: string; name: string }[]
  } | null
}

// Query to verify member owns this firebaseId
const VERIFY_MEMBER_OWNERSHIP = `
  query VerifyMemberOwnership($memberId: ID!, $firebaseId: String!) {
    member(where: { id: $memberId }) {
      id
      firebaseId
    }
  }
`

const GET_READING_HISTORY = `
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
        contentPreview
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

const COUNT_READING_HISTORY = `
  query CountReadingHistory($memberId: ID!) {
    readingHistoriesCount(where: { member: { id: { equals: $memberId } } })
  }
`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      idToken,
      memberId,
      firebaseId,
      take,
      skip = 0,
    } = req.body as RequestBody

    if (!memberId || !firebaseId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Verify Firebase token if Firebase Admin is enabled
    if (isFirebaseAdminEnabled()) {
      if (!idToken) {
        return res.status(401).json({ error: 'ID token required' })
      }

      const verifyResult = await verifyFirebaseToken(idToken)

      if (!verifyResult.success && !verifyResult.skipped) {
        return res.status(401).json({ error: verifyResult.error })
      }

      // Ensure the token uid matches the provided firebaseId
      if (verifyResult.success && verifyResult.uid !== firebaseId) {
        return res.status(403).json({
          error: 'Firebase ID mismatch',
        })
      }
    }

    // Verify the memberId belongs to this firebaseId
    const ownershipResult = await serverGraphQL<{
      member: { id: string; firebaseId: string } | null
    }>(VERIFY_MEMBER_OWNERSHIP, { memberId, firebaseId })

    if (ownershipResult.error) {
      console.error(
        '[API /reading-history/list] Ownership check error:',
        ownershipResult.error
      )
      return res.status(500).json({ error: ownershipResult.error })
    }

    const member = ownershipResult.data?.member
    if (!member || member.firebaseId !== firebaseId) {
      return res.status(403).json({
        error: 'Member ID does not belong to this user',
      })
    }

    // Execute GraphQL queries
    const [historyResult, countResult] = await Promise.all([
      serverGraphQL<{ readingHistories: ReadingHistoryWithPost[] }>(
        GET_READING_HISTORY,
        { memberId, take, skip }
      ),
      serverGraphQL<{ readingHistoriesCount: number }>(COUNT_READING_HISTORY, {
        memberId,
      }),
    ])

    if (historyResult.error) {
      console.error(
        '[API /reading-history/list] GraphQL error:',
        historyResult.error
      )
      return res.status(500).json({ error: historyResult.error })
    }

    return res.status(200).json({
      success: true,
      readingHistories: historyResult.data?.readingHistories || [],
      total: countResult.data?.readingHistoriesCount ?? 0,
    })
  } catch (error) {
    console.error('[API /reading-history/list] Error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
