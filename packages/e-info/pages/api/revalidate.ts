import type { NextApiRequest, NextApiResponse } from 'next'

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Require secret token to prevent abuse
  const { secret, path } = req.body as { secret?: string; path?: string }

  if (!REVALIDATE_SECRET || secret !== REVALIDATE_SECRET) {
    return res.status(401).json({ error: 'Invalid secret' })
  }

  if (!path || typeof path !== 'string') {
    return res.status(400).json({ error: 'Missing path parameter' })
  }

  try {
    await res.revalidate(path)
    return res.json({ revalidated: true, path })
  } catch (err) {
    console.error('Revalidation error:', err)
    return res.status(500).json({ error: 'Failed to revalidate' })
  }
}
