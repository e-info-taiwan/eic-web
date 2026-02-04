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

// Query to verify member owns this firebaseId
const VERIFY_MEMBER_OWNERSHIP = `
  query VerifyMemberOwnership($memberId: ID!, $firebaseId: String!) {
    member(where: { id: $memberId }) {
      id
      firebaseId
    }
  }
`

// Query to check if a post is favorited by a member
const CHECK_FAVORITE = `
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { idToken, memberId, firebaseId, postId } = req.body as RequestBody

    if (!memberId || !firebaseId || !postId) {
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
        '[API /favorites/check] Ownership check error:',
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

    // Execute GraphQL query
    const result = await serverGraphQL<{ favorites: { id: string }[] }>(
      CHECK_FAVORITE,
      { memberId, postId }
    )

    if (result.error) {
      console.error('[API /favorites/check] GraphQL error:', result.error)
      return res.status(500).json({ error: result.error })
    }

    const favorites = result.data?.favorites
    const favoriteId =
      favorites && favorites.length > 0 ? favorites[0].id : null

    return res.status(200).json({
      success: true,
      favoriteId,
      isFavorited: !!favoriteId,
    })
  } catch (error) {
    console.error('[API /favorites/check] Error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
