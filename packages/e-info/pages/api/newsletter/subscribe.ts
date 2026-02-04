import crypto from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'

import {
  MAILCHIMP_API_KEY,
  MAILCHIMP_LIST_ID_DAILY,
  MAILCHIMP_LIST_ID_WEEKLY,
  MAILCHIMP_SERVER_PREFIX,
} from '~/constants/config'
import type {
  NewsletterFormat,
  NewsletterFrequency,
  SubscribeRequest,
  SubscribeResponse,
} from '~/types/newsletter'

// Get the appropriate list ID based on frequency (dual Audience architecture)
function getListId(frequency: NewsletterFrequency): string {
  return frequency === 'daily'
    ? MAILCHIMP_LIST_ID_DAILY
    : MAILCHIMP_LIST_ID_WEEKLY
}

// Helper function to update existing member's merge fields
async function updateMemberMergeFields(
  email: string,
  listId: string,
  format: NewsletterFormat
): Promise<{ success: boolean }> {
  try {
    const subscriberHash = crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex')

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
        merge_fields: {
          FORMAT: format,
        },
      }),
    })

    return { success: response.ok }
  } catch {
    return { success: false }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubscribeResponse>
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { email, frequency, format } = req.body as SubscribeRequest

  // Validate input
  if (!email || !frequency || !format) {
    return res.status(400).json({
      success: false,
      error: '缺少必要欄位',
    })
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: '請輸入有效的 Email 地址',
    })
  }

  // Get the appropriate list ID based on frequency
  const listId = getListId(frequency)

  // Check if Mailchimp is configured
  if (!MAILCHIMP_API_KEY || !listId || !MAILCHIMP_SERVER_PREFIX) {
    console.error('[Newsletter API] Mailchimp not configured')
    return res.status(500).json({
      success: false,
      error: '電子報服務暫時無法使用，請稍後再試',
    })
  }

  try {
    // Mailchimp API endpoint - use the appropriate audience based on frequency
    const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${listId}/members`

    // In dual Audience architecture:
    // - Frequency is determined by which Audience (list) the member is added to
    // - Format is stored in merge fields
    const mailchimpData = {
      email_address: email,
      status: 'subscribed', // Single opt-in
      merge_fields: {
        FORMAT: format,
      },
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `anystring:${MAILCHIMP_API_KEY}`
        ).toString('base64')}`,
      },
      body: JSON.stringify(mailchimpData),
    })

    const data = await response.json()

    if (response.ok) {
      return res.status(200).json({
        success: true,
        message: '訂閱成功！',
      })
    }

    // Handle Mailchimp error responses
    if (data.title === 'Member Exists') {
      // Try to update existing member's merge fields
      const updateResult = await updateMemberMergeFields(email, listId, format)
      if (updateResult.success) {
        return res.status(200).json({
          success: true,
          message: '訂閱偏好已更新！',
        })
      }
      return res.status(400).json({
        success: false,
        error: '此 Email 已訂閱，如需更新偏好請聯繫我們',
      })
    }

    if (data.title === 'Invalid Resource') {
      return res.status(400).json({
        success: false,
        error: '請輸入有效的 Email 地址',
      })
    }

    // Log unknown errors for debugging
    console.error('[Newsletter API] Mailchimp error:', data)
    return res.status(500).json({
      success: false,
      error: '訂閱失敗，請稍後再試',
    })
  } catch (error) {
    console.error('[Newsletter API] Error:', error)
    return res.status(500).json({
      success: false,
      error: '訂閱失敗，請稍後再試',
    })
  }
}
