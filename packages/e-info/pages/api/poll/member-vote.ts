import type { NextApiRequest, NextApiResponse } from 'next'

import { serverGraphQL } from '~/utils/server-graphql'
import {
  isFirebaseAdminEnabled,
  verifyFirebaseToken,
} from '~/utils/verify-firebase'

type RequestBody = {
  idToken: string
  pollId: string
  memberId: string
  firebaseId: string
}

type PollResult = {
  id: string
  result: number
  member: {
    id: string
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

const GET_MEMBER_POLL_VOTE = `
  query GetMemberPollVote($pollId: ID!, $memberId: ID!) {
    pollResults(
      where: {
        poll: { id: { equals: $pollId } }
        member: { id: { equals: $memberId } }
      }
    ) {
      id
      result
      member {
        id
      }
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
    const { idToken, pollId, memberId, firebaseId } = req.body as RequestBody

    if (!pollId || !memberId || !firebaseId) {
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
        '[API /poll/member-vote] Ownership check error:',
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
    const voteResult = await serverGraphQL<{ pollResults: PollResult[] }>(
      GET_MEMBER_POLL_VOTE,
      { pollId, memberId }
    )

    if (voteResult.error) {
      console.error('[API /poll/member-vote] GraphQL error:', voteResult.error)
      return res.status(500).json({ error: voteResult.error })
    }

    const pollResults = voteResult.data?.pollResults || []

    return res.status(200).json({
      success: true,
      pollResults,
    })
  } catch (error) {
    console.error('[API /poll/member-vote] Error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
