import { NextApiRequest, NextApiResponse } from 'next'

import { SITE_ORIGIN } from '~/constants/config'
import { ENV } from '~/constants/environment-variables'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'text/plain')
  if (ENV === 'prod') {
    res.write(`User-agent: *
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap/sitemap.xml
`)
  } else {
    res.write(`User-agent: * 
Disallow: /`)
  }
  res.end()
}
