import crypto from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'

import {
  MAILCHIMP_API_KEY,
  MAILCHIMP_LIST_ID,
  MAILCHIMP_SERVER_PREFIX,
} from '~/constants/config'
import type { SubscribeRequest, SubscribeResponse } from '~/types/newsletter'

// Helper function to update existing member's tags
async function updateMemberTags(
  email: string,
  tags: string[]
): Promise<{ success: boolean }> {
  try {
    const subscriberHash = crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex')

    const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${subscriberHash}/tags`

    const tagsData = {
      tags: tags.map((tag) => ({ name: tag, status: 'active' })),
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `anystring:${MAILCHIMP_API_KEY}`
        ).toString('base64')}`,
      },
      body: JSON.stringify(tagsData),
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

  // Check if Mailchimp is configured
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_SERVER_PREFIX) {
    console.error('[Newsletter API] Mailchimp not configured')
    return res.status(500).json({
      success: false,
      error: '電子報服務暫時無法使用，請稍後再試',
    })
  }

  try {
    // Mailchimp API endpoint
    const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`

    // Build tags based on preferences
    const tags: string[] = []
    if (frequency === 'daily') {
      tags.push('每日報')
    } else {
      tags.push('一週回顧')
    }
    if (format === 'beautified') {
      tags.push('美化版')
    } else {
      tags.push('一般版')
    }

    const mailchimpData = {
      email_address: email,
      status: 'subscribed', // Single opt-in
      tags: tags,
      merge_fields: {
        FREQUENCY: frequency === 'daily' ? 'weekday' : 'saturday',
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
      // Try to update existing member's tags
      const updateResult = await updateMemberTags(email, tags)
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
