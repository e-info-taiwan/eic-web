import crypto from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'

import {
  MAILCHIMP_API_KEY,
  MAILCHIMP_LIST_ID_DAILY,
  MAILCHIMP_LIST_ID_WEEKLY,
  MAILCHIMP_SERVER_PREFIX,
} from '~/constants/config'
import type { NewsletterFormat } from '~/types/newsletter'

type SubscriptionStatus = {
  subscribed: boolean
  format: NewsletterFormat | null
}

type CheckResponse = {
  daily: SubscriptionStatus
  weekly: SubscriptionStatus
}

// Check a single Mailchimp audience for the given email
async function checkAudience(
  email: string,
  listId: string
): Promise<SubscriptionStatus> {
  const subscriberHash = crypto
    .createHash('md5')
    .update(email.toLowerCase())
    .digest('hex')

  const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${Buffer.from(
          `anystring:${MAILCHIMP_API_KEY}`
        ).toString('base64')}`,
      },
    })

    if (!response.ok) {
      // 404 = not a member, other errors = treat as not subscribed
      return { subscribed: false, format: null }
    }

    const data = await response.json()

    if (data.status !== 'subscribed') {
      return { subscribed: false, format: null }
    }

    const format = data.merge_fields?.FORMAT || 'standard'
    return {
      subscribed: true,
      format: format === 'styled' ? 'styled' : 'standard',
    }
  } catch {
    return { subscribed: false, format: null }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body as { email: string }

  if (!email) {
    return res.status(400).json({ error: '缺少 email 欄位' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: '請輸入有效的 Email 地址' })
  }

  if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX) {
    return res.status(500).json({ error: '電子報服務暫時無法使用' })
  }

  const [daily, weekly] = await Promise.all([
    checkAudience(email, MAILCHIMP_LIST_ID_DAILY),
    checkAudience(email, MAILCHIMP_LIST_ID_WEEKLY),
  ])

  return res.status(200).json({ daily, weekly })
}
