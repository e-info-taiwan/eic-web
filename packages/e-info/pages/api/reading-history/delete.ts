import type { NextApiRequest, NextApiResponse } from 'next'

import { serverGraphQL } from '~/utils/server-graphql'
import {
  isFirebaseAdminEnabled,
  verifyFirebaseToken,
} from '~/utils/verify-firebase'

type RequestBody = {
  idToken: string
  historyId: string
  firebaseId: string
}

const DELETE_READING_HISTORY = `
  mutation DeleteReadingHistory($where: ReadingHistoryWhereUniqueInput!) {
    deleteReadingHistory(where: $where) {
      id
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
    const { idToken, historyId, firebaseId } = req.body as RequestBody

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
            'Firebase ID mismatch - cannot delete reading history for another user',
        })
      }
    }

    // Execute GraphQL mutation
    const result = await serverGraphQL<{
      deleteReadingHistory: { id: string }
    }>(DELETE_READING_HISTORY, {
      where: { id: historyId },
    })

    if (result.error) {
      console.error(
        '[API /reading-history/delete] GraphQL error:',
        result.error
      )
      return res.status(500).json({ error: result.error })
    }

    return res.status(200).json({
      success: true,
    })
  } catch (error) {
    console.error('[API /reading-history/delete] Error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
