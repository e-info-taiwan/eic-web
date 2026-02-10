import type { NextApiRequest, NextApiResponse } from 'next'

import { getGqlClient } from '~/apollo-client'
import { createEvent } from '~/graphql/query/event'
import { getClientIp, verifyTurnstileToken } from '~/utils/verify-turnstile'

type RequestBody = {
  name: string
  photoId?: string
  organizer: string
  contactInfo: string
  eventType: string
  startDate: string
  endDate: string
  location: string
  fee: string
  registrationUrl: string
  content: string
  turnstileToken?: string
}

type ResponseData = {
  success: boolean
  eventId?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const body = req.body as RequestBody

    // Verify Turnstile token (bot protection)
    const clientIp = getClientIp(
      req.headers as Record<string, string | string[] | undefined>,
      req.socket.remoteAddress
    )
    const turnstileResult = await verifyTurnstileToken(
      body.turnstileToken || '',
      clientIp
    )
    if (!turnstileResult.success) {
      return res.status(403).json({
        success: false,
        error: turnstileResult.error || 'Bot verification failed',
      })
    }

    // Validate required fields
    if (!body.name || !body.organizer || !body.startDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      })
    }

    const client = getGqlClient()

    // Build the event data
    const eventData: Record<string, unknown> = {
      name: body.name,
      organizer: body.organizer,
      contactInfo: body.contactInfo,
      eventType: body.eventType,
      startDate: new Date(body.startDate).toISOString(),
      endDate: new Date(body.endDate || body.startDate).toISOString(),
      sortOrder: 0,
      location: body.location,
      fee: body.fee,
      registrationUrl: body.registrationUrl,
      content: body.content,
      state: 'draft',
      isApproved: false,
    }

    // Connect heroImage if photoId is provided
    if (body.photoId) {
      eventData.heroImage = {
        connect: { id: body.photoId },
      }
    }

    const result = await client.mutate<{
      createEvent: { id: string; name: string }
    }>({
      mutation: createEvent,
      variables: { data: eventData },
    })

    const eventId = result.data?.createEvent?.id

    if (!eventId) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create event',
      })
    }

    return res.status(200).json({ success: true, eventId })
  } catch (error) {
    console.error('Create event error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
