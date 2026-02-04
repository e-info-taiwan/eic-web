import type { NextApiRequest, NextApiResponse } from 'next'

import { serverGraphQL } from '~/utils/server-graphql'
import {
  isFirebaseAdminEnabled,
  verifyFirebaseToken,
} from '~/utils/verify-firebase'

// Newsletter subscription types
type NewsletterName = 'daily' | 'weekly'
type NewsletterType = 'standard' | 'styled'

type SubscriptionInput = {
  daily?: NewsletterType | null
  weekly?: NewsletterType | null
}

type RequestBody = {
  idToken: string
  memberId: string
  firebaseId: string
  subscriptions: SubscriptionInput
}

type MemberSubscription = {
  id: string
  newsletterName: string
  newsletterType: string
}

type Member = {
  id: string
  subscriptions: MemberSubscription[]
}

// Query to get current subscriptions
const GET_MEMBER_SUBSCRIPTIONS = `
  query GetMemberSubscriptions($memberId: ID!) {
    member(where: { id: $memberId }) {
      id
      subscriptions {
        id
        newsletterName
        newsletterType
      }
    }
  }
`

// Mutation to create a subscription
const CREATE_SUBSCRIPTION = `
  mutation CreateSubscription($data: MemberSubscriptionCreateInput!) {
    createMemberSubscription(data: $data) {
      id
      newsletterName
      newsletterType
    }
  }
`

// Mutation to update a subscription
const UPDATE_SUBSCRIPTION = `
  mutation UpdateSubscription(
    $where: MemberSubscriptionWhereUniqueInput!
    $data: MemberSubscriptionUpdateInput!
  ) {
    updateMemberSubscription(where: $where, data: $data) {
      id
      newsletterName
      newsletterType
    }
  }
`

// Mutation to delete a subscription
const DELETE_SUBSCRIPTION = `
  mutation DeleteSubscription($where: MemberSubscriptionWhereUniqueInput!) {
    deleteMemberSubscription(where: $where) {
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
    const { idToken, memberId, firebaseId, subscriptions } =
      req.body as RequestBody

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

      // Ensure the firebaseId matches the token's uid
      if (verifyResult.success && verifyResult.uid !== firebaseId) {
        return res.status(403).json({
          error: 'Firebase ID mismatch - cannot update another user',
        })
      }
    }

    // Get current subscriptions
    const currentResult = await serverGraphQL<{ member: Member | null }>(
      GET_MEMBER_SUBSCRIPTIONS,
      { memberId }
    )

    if (currentResult.error) {
      console.error(
        '[API /member/subscriptions] Error fetching current:',
        currentResult.error
      )
      return res.status(500).json({ error: currentResult.error })
    }

    const currentSubscriptions = currentResult.data?.member?.subscriptions || []

    // Process each newsletter type (daily, weekly)
    const newsletterNames: NewsletterName[] = ['daily', 'weekly']

    for (const name of newsletterNames) {
      const desiredType = subscriptions[name]
      const existing = currentSubscriptions.find(
        (s) => s.newsletterName === name
      )

      if (desiredType === null || desiredType === undefined) {
        // User wants to unsubscribe - delete if exists
        if (existing) {
          const deleteResult = await serverGraphQL(DELETE_SUBSCRIPTION, {
            where: { id: existing.id },
          })
          if (deleteResult.error) {
            console.error(
              `[API /member/subscriptions] Error deleting ${name}:`,
              deleteResult.error
            )
          }
        }
      } else if (existing) {
        // Subscription exists - update if type changed
        if (existing.newsletterType !== desiredType) {
          const updateResult = await serverGraphQL(UPDATE_SUBSCRIPTION, {
            where: { id: existing.id },
            data: { newsletterType: desiredType },
          })
          if (updateResult.error) {
            console.error(
              `[API /member/subscriptions] Error updating ${name}:`,
              updateResult.error
            )
          }
        }
      } else {
        // No existing subscription - create new one
        const createResult = await serverGraphQL(CREATE_SUBSCRIPTION, {
          data: {
            newsletterName: name,
            newsletterType: desiredType,
            member: { connect: { id: memberId } },
          },
        })
        if (createResult.error) {
          console.error(
            `[API /member/subscriptions] Error creating ${name}:`,
            createResult.error
          )
        }
      }
    }

    // Fetch updated subscriptions
    const updatedResult = await serverGraphQL<{ member: Member | null }>(
      GET_MEMBER_SUBSCRIPTIONS,
      { memberId }
    )

    return res.status(200).json({
      success: true,
      subscriptions: updatedResult.data?.member?.subscriptions || [],
    })
  } catch (error) {
    console.error('[API /member/subscriptions] Error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
