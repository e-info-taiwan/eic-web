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
  postId: string
}

const CHECK_READING_HISTORY = `
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

const CREATE_READING_HISTORY = `
  mutation CreateReadingHistory($data: ReadingHistoryCreateInput!) {
    createReadingHistory(data: $data) {
      id
      createdAt
    }
  }
`

const UPDATE_READING_HISTORY = `
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { idToken, memberId, firebaseId, postId } = req.body as RequestBody

    // Verify Firebase token if Firebase Admin is enabled
    if (isFirebaseAdminEnabled()) {
      const verifyResult = await verifyFirebaseToken(idToken)

      if (!verifyResult.success && !verifyResult.skipped) {
        return res.status(401).json({ error: verifyResult.error })
      }

      // Ensure the firebaseId matches the token's uid
      if (verifyResult.success && verifyResult.uid !== firebaseId) {
        return res.status(403).json({
          error:
            'Firebase ID mismatch - cannot record reading history for another user',
        })
      }
    }

    // Check if reading history already exists
    const checkResult = await serverGraphQL<{
      readingHistories: { id: string; createdAt: string }[]
    }>(CHECK_READING_HISTORY, { memberId, postId })

    if (checkResult.error) {
      console.error(
        '[API /reading-history/record] Check error:',
        checkResult.error
      )
      return res.status(500).json({ error: checkResult.error })
    }

    const existing = checkResult.data?.readingHistories?.[0]

    if (existing) {
      // Update existing record's timestamp
      const updateResult = await serverGraphQL<{
        updateReadingHistory: { id: string }
      }>(UPDATE_READING_HISTORY, {
        where: { id: existing.id },
        data: {
          updatedAt: new Date().toISOString(),
        },
      })

      if (updateResult.error) {
        console.error(
          '[API /reading-history/record] Update error:',
          updateResult.error
        )
        return res.status(500).json({ error: updateResult.error })
      }

      return res.status(200).json({
        success: true,
        historyId: existing.id,
        updated: true,
      })
    }

    // Create new reading history
    const createResult = await serverGraphQL<{
      createReadingHistory: { id: string }
    }>(CREATE_READING_HISTORY, {
      data: {
        member: { connect: { id: memberId } },
        post: { connect: { id: postId } },
      },
    })

    if (createResult.error) {
      console.error(
        '[API /reading-history/record] Create error:',
        createResult.error
      )
      return res.status(500).json({ error: createResult.error })
    }

    return res.status(200).json({
      success: true,
      historyId: createResult.data?.createReadingHistory?.id,
      created: true,
    })
  } catch (error) {
    console.error('[API /reading-history/record] Error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
