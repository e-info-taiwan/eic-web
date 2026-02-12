import type { NextApiRequest, NextApiResponse } from 'next'

import { serverGraphQL } from '~/utils/server-graphql'

type RequestBody = {
  pageUrl: string
  clickFrom: string
}

type ResponseData = {
  success: boolean
  error?: string
}

const CREATE_DONATION_PV = `
  mutation CreateDonationPV($data: DonationPVCreateInput!) {
    createDonationPV(data: $data) {
      id
    }
  }
`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { pageUrl, clickFrom } = req.body as RequestBody

    if (!pageUrl || !clickFrom) {
      return res
        .status(400)
        .json({ success: false, error: 'Missing required fields' })
    }

    const result = await serverGraphQL(CREATE_DONATION_PV, {
      data: {
        pageUrl,
        clickFrom,
        clickTime: new Date().toISOString(),
      },
    })

    if (result.error) {
      return res.status(500).json({ success: false, error: result.error })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Donation PV error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
