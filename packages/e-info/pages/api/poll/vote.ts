import type { NextApiRequest, NextApiResponse } from 'next'

import { serverGraphQL } from '~/utils/server-graphql'
import {
  isFirebaseAdminEnabled,
  verifyFirebaseToken,
} from '~/utils/verify-firebase'
import { verifyTurnstileToken } from '~/utils/verify-turnstile'

type RequestBody = {
  pollId: string
  postId: string
  result: number
  // For member voting
  memberId?: string
  firebaseId?: string
  idToken?: string
  // For anonymous voting
  turnstileToken?: string
}

const CREATE_POLL_RESULT_WITH_MEMBER = `
  mutation CreatePollResultWithMember(
    $pollId: ID!
    $postId: ID!
    $memberId: ID!
    $result: Int!
  ) {
    createPollResult(
      data: {
        poll: { connect: { id: $pollId } }
        post: { connect: { id: $postId } }
        member: { connect: { id: $memberId } }
        result: $result
      }
    ) {
      id
      result
    }
  }
`

const CREATE_POLL_RESULT_ANONYMOUS = `
  mutation CreatePollResultAnonymous($pollId: ID!, $postId: ID!, $result: Int!) {
    createPollResult(
      data: {
        poll: { connect: { id: $pollId } }
        post: { connect: { id: $postId } }
        result: $result
      }
    ) {
      id
      result
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
    const {
      pollId,
      postId,
      result,
      memberId,
      firebaseId,
      idToken,
      turnstileToken,
    } = req.body as RequestBody

    // Validate required fields
    if (!pollId || !postId || result === undefined) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Validate result is 1-5
    if (result < 1 || result > 5) {
      return res.status(400).json({ error: 'Invalid result value' })
    }

    // Determine if this is a member or anonymous vote
    const isMemberVote = !!memberId

    if (isMemberVote) {
      // Member voting - verify Firebase token
      if (isFirebaseAdminEnabled()) {
        if (!idToken) {
          return res
            .status(401)
            .json({ error: 'ID token required for member voting' })
        }

        const verifyResult = await verifyFirebaseToken(idToken)

        if (!verifyResult.success && !verifyResult.skipped) {
          return res.status(401).json({ error: verifyResult.error })
        }

        // Ensure the firebaseId matches the token's uid
        if (verifyResult.success && verifyResult.uid !== firebaseId) {
          return res.status(403).json({
            error: 'Firebase ID mismatch - cannot vote as another user',
          })
        }
      }

      // Execute member vote mutation
      const mutationResult = await serverGraphQL<{
        createPollResult: { id: string; result: number }
      }>(CREATE_POLL_RESULT_WITH_MEMBER, {
        pollId,
        postId,
        memberId,
        result,
      })

      if (mutationResult.error) {
        console.error('[API /poll/vote] GraphQL error:', mutationResult.error)
        return res.status(500).json({ error: mutationResult.error })
      }

      return res.status(200).json({
        success: true,
        pollResult: mutationResult.data?.createPollResult,
      })
    } else {
      // Anonymous voting - verify Turnstile token (or skip if Turnstile is disabled)
      const turnstileResult = await verifyTurnstileToken(turnstileToken || '')

      if (!turnstileResult.success) {
        return res.status(403).json({
          error: turnstileResult.error || 'Turnstile verification failed',
        })
      }

      // Execute anonymous vote mutation
      const mutationResult = await serverGraphQL<{
        createPollResult: { id: string; result: number }
      }>(CREATE_POLL_RESULT_ANONYMOUS, {
        pollId,
        postId,
        result,
      })

      if (mutationResult.error) {
        console.error('[API /poll/vote] GraphQL error:', mutationResult.error)
        return res.status(500).json({ error: mutationResult.error })
      }

      return res.status(200).json({
        success: true,
        pollResult: mutationResult.data?.createPollResult,
      })
    }
  } catch (error) {
    console.error('[API /poll/vote] Error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
