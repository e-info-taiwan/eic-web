import type { NextApiRequest, NextApiResponse } from 'next'

import { serverGraphQL } from '~/utils/server-graphql'
import {
  isFirebaseAdminEnabled,
  verifyFirebaseToken,
} from '~/utils/verify-firebase'

type RequestBody = {
  idToken: string
  firebaseId: string
}

type Member = {
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
  avatar: {
    id: string
    imageFile: { url: string } | null
    resized: { original: string; w480: string; w800: string } | null
  } | null
  interestedSections: { id: string; slug: string; name: string }[]
  favorites: { id: string; post: { id: string; title: string } }[]
  createdAt: string
  updatedAt: string
}

const GET_MEMBER_BY_FIREBASE_ID = `
  query GetMemberByFirebaseId($firebaseId: String!) {
    members(where: { firebaseId: { equals: $firebaseId } }, take: 1) {
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
    const { idToken, firebaseId } = req.body as RequestBody

    if (!firebaseId) {
      return res.status(400).json({ error: 'Missing firebaseId' })
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

      // Ensure the user can only query their own data
      if (verifyResult.success && verifyResult.uid !== firebaseId) {
        return res.status(403).json({
          error: 'Firebase ID mismatch - cannot access another user data',
        })
      }
    }

    // Execute GraphQL query
    const result = await serverGraphQL<{ members: Member[] }>(
      GET_MEMBER_BY_FIREBASE_ID,
      { firebaseId }
    )

    if (result.error) {
      console.error('[API /member/get] GraphQL error:', result.error)
      return res.status(500).json({ error: result.error })
    }

    const members = result.data?.members
    const member = members && members.length > 0 ? members[0] : null

    return res.status(200).json({
      success: true,
      member,
    })
  } catch (error) {
    console.error('[API /member/get] Error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
