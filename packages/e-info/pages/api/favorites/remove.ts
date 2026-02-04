import type { NextApiRequest, NextApiResponse } from 'next'

import { serverGraphQL } from '~/utils/server-graphql'
import {
  isFirebaseAdminEnabled,
  verifyFirebaseToken,
} from '~/utils/verify-firebase'

type RequestBody = {
  idToken: string
  favoriteId: string
  firebaseId: string
}

const DELETE_FAVORITE_MUTATION = `
  mutation DeleteFavorite($where: FavoriteWhereUniqueInput!) {
    deleteFavorite(where: $where) {
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
    const { idToken, favoriteId, firebaseId } = req.body as RequestBody

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
            'Firebase ID mismatch - cannot remove favorite for another user',
        })
      }
    }

    // Execute GraphQL mutation
    const result = await serverGraphQL<{
      deleteFavorite: { id: string }
    }>(DELETE_FAVORITE_MUTATION, {
      where: { id: favoriteId },
    })

    if (result.error) {
      console.error('[API /favorites/remove] GraphQL error:', result.error)
      return res.status(500).json({ error: result.error })
    }

    return res.status(200).json({
      success: true,
    })
  } catch (error) {
    console.error('[API /favorites/remove] Error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
