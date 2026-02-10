import type { NextApiRequest, NextApiResponse } from 'next'

import { getGqlClient } from '~/apollo-client'
import { createJob } from '~/graphql/query/job'
import { getClientIp, verifyTurnstileToken } from '~/utils/verify-turnstile'

type RequestBody = {
  title: string
  company: string
  salary: string
  requirements: string
  jobDescription: string
  bonus?: string
  applicationMethod: string
  startDate: string
  endDate: string
  turnstileToken?: string
}

type ResponseData = {
  success: boolean
  jobId?: string
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
    if (
      !body.title ||
      !body.company ||
      !body.startDate ||
      !body.jobDescription
    ) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      })
    }

    const client = getGqlClient()

    // Build the job data
    const jobData: Record<string, unknown> = {
      title: body.title,
      company: body.company,
      salary: body.salary,
      requirements: body.requirements,
      jobDescription: body.jobDescription,
      bonus: body.bonus || '',
      applicationMethod: body.applicationMethod,
      startDate: new Date(body.startDate).toISOString(),
      endDate: new Date(body.endDate || body.startDate).toISOString(),
      sortOrder: 0,
      state: 'draft',
      isApproved: false,
    }

    const result = await client.mutate<{
      createJob: { id: string; title: string }
    }>({
      mutation: createJob,
      variables: { data: jobData },
    })

    const jobId = result.data?.createJob?.id

    if (!jobId) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create job',
      })
    }

    return res.status(200).json({ success: true, jobId })
  } catch (error) {
    console.error('Create job error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
