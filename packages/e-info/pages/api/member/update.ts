import type { NextApiRequest, NextApiResponse } from 'next'

import { serverGraphQL } from '~/utils/server-graphql'
import {
  isFirebaseAdminEnabled,
  verifyFirebaseToken,
} from '~/utils/verify-firebase'

type UpdateMemberInput = {
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

type RequestBody = {
  idToken: string
  memberId: string
  firebaseId: string
  data: UpdateMemberInput
}

type Member = {
  id: string
  firebaseId: string
  email: string | null
  firstName: string | null
  lastName: string | null
}

const UPDATE_MEMBER_MUTATION = `
  mutation UpdateMember(
    $where: MemberWhereUniqueInput!
    $data: MemberUpdateInput!
  ) {
    updateMember(where: $where, data: $data) {
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
    const { idToken, memberId, firebaseId, data } = req.body as RequestBody

    // Verify Firebase token if Firebase Admin is enabled
    if (isFirebaseAdminEnabled()) {
      const verifyResult = await verifyFirebaseToken(idToken)

      if (!verifyResult.success && !verifyResult.skipped) {
        return res.status(401).json({ error: verifyResult.error })
      }

      // Ensure the firebaseId matches the token's uid
      if (verifyResult.success && verifyResult.uid !== firebaseId) {
        return res.status(403).json({
          error: 'Firebase ID mismatch - cannot update another user',
        })
      }
    }

    // Execute GraphQL mutation
    const result = await serverGraphQL<{ updateMember: Member }>(
      UPDATE_MEMBER_MUTATION,
      {
        where: { id: memberId },
        data,
      }
    )

    if (result.error) {
      console.error('[API /member/update] GraphQL error:', result.error)
      return res.status(500).json({ error: result.error })
    }

    return res.status(200).json({
      success: true,
      member: result.data?.updateMember,
    })
  } catch (error) {
    console.error('[API /member/update] Error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
