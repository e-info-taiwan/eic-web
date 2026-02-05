import crypto from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'

import {
  MAILCHIMP_API_KEY,
  MAILCHIMP_LIST_ID_DAILY,
  MAILCHIMP_LIST_ID_WEEKLY,
  MAILCHIMP_SERVER_PREFIX,
} from '~/constants/config'
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
  syncToMailchimp?: boolean // 是否同步到 Mailchimp
  email?: string // 會員 email（用於 Mailchimp 同步）
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

// ============ Mailchimp 同步相關函式 ============

// 取得對應頻率的 Mailchimp List ID（雙 Audience 架構）
function getMailchimpListId(frequency: NewsletterName): string {
  return frequency === 'daily'
    ? MAILCHIMP_LIST_ID_DAILY
    : MAILCHIMP_LIST_ID_WEEKLY
}

// 檢查 Mailchimp 是否已設定
function isMailchimpConfigured(): boolean {
  return !!(
    MAILCHIMP_API_KEY &&
    MAILCHIMP_LIST_ID_DAILY &&
    MAILCHIMP_LIST_ID_WEEKLY &&
    MAILCHIMP_SERVER_PREFIX
  )
}

// 同步單一訂閱到 Mailchimp
async function syncToMailchimpAudience(
  email: string,
  frequency: NewsletterName,
  format: NewsletterType | null
): Promise<{ success: boolean; error?: string }> {
  if (!isMailchimpConfigured()) {
    return { success: false, error: 'Mailchimp not configured' }
  }

  const listId = getMailchimpListId(frequency)
  const subscriberHash = crypto
    .createHash('md5')
    .update(email.toLowerCase())
    .digest('hex')

  try {
    if (format === null) {
      // 取消訂閱：將狀態改為 unsubscribed
      const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(
            `anystring:${MAILCHIMP_API_KEY}`
          ).toString('base64')}`,
        },
        body: JSON.stringify({
          status: 'unsubscribed',
        }),
      })

      // 404 表示該 email 不存在於此 audience，視為成功
      if (response.ok || response.status === 404) {
        return { success: true }
      }

      const data = await response.json()
      return { success: false, error: data.detail || 'Failed to unsubscribe' }
    } else {
      // 新增或更新訂閱
      const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`

      // 使用 PUT 進行 upsert（新增或更新）
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(
            `anystring:${MAILCHIMP_API_KEY}`
          ).toString('base64')}`,
        },
        body: JSON.stringify({
          email_address: email,
          status_if_new: 'subscribed',
          status: 'subscribed',
          merge_fields: {
            FORMAT: format,
          },
        }),
      })

      if (response.ok) {
        return { success: true }
      }

      const data = await response.json()
      return { success: false, error: data.detail || 'Failed to subscribe' }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// 同步所有訂閱到 Mailchimp
async function syncAllToMailchimp(
  email: string,
  subscriptions: SubscriptionInput
): Promise<void> {
  const syncTasks: Promise<void>[] = []

  // 同步 daily 訂閱
  syncTasks.push(
    syncToMailchimpAudience(email, 'daily', subscriptions.daily ?? null).then(
      (result) => {
        if (!result.success) {
          console.error('[Mailchimp Sync Error] daily:', {
            email,
            format: subscriptions.daily,
            error: result.error,
          })
        }
      }
    )
  )

  // 同步 weekly 訂閱
  syncTasks.push(
    syncToMailchimpAudience(email, 'weekly', subscriptions.weekly ?? null).then(
      (result) => {
        if (!result.success) {
          console.error('[Mailchimp Sync Error] weekly:', {
            email,
            format: subscriptions.weekly,
            error: result.error,
          })
        }
      }
    )
  )

  // 並行執行所有同步任務
  await Promise.all(syncTasks)
}

// ============ API Handler ============

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
      subscriptions,
      syncToMailchimp,
      email,
    } = req.body as RequestBody

    if (!memberId || !firebaseId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // 如果要同步到 Mailchimp，必須提供 email
    if (syncToMailchimp && !email) {
      return res
        .status(400)
        .json({ error: 'Email required for Mailchimp sync' })
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

    // 同步到 Mailchimp（CMS 成功後執行，失敗不影響回傳結果）
    if (syncToMailchimp && email) {
      try {
        await syncAllToMailchimp(email, subscriptions)
      } catch (mailchimpError) {
        // 僅記錄錯誤，不影響回傳結果
        console.error('[Mailchimp Sync Error] Unexpected:', {
          memberId,
          email,
          subscriptions,
          error: mailchimpError,
        })
      }
    }

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
