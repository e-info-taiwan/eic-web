/*
 * This API endpoint is for client-side GraphQL request.
 *
 * Since rewrite rule in next.config is not configurable during runtime,
 * we implement GraphQL API proxy by ourselves.
 */

import httpProxy from 'http-proxy'
import type { NextApiRequest, NextApiResponse } from 'next'

import { API_ENDPOINT } from '~/constants/config'

export const config = {
  api: {
    // Enable `externalResolver` option in Next.js
    externalResolver: true,
    bodyParser: false,
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const proxy: httpProxy = httpProxy.createProxy()

  proxy.web(req, res, {
    changeOrigin: true,
    target: API_ENDPOINT,
  })

  proxy.on('error', (err) => {
    console.error('Proxy error:', err)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Proxy error' })
    }
  })
}
