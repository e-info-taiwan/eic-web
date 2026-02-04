/*
 * This API endpoint proxies client-side GraphQL queries to the backend API.
 * This avoids CORS issues and keeps the API endpoint internal.
 *
 * SECURITY:
 * - Only queries (read operations) are allowed through this proxy.
 * - All mutations must go through dedicated API routes with proper authentication.
 * - Sensitive queries (member data) are blocked and must use protected API routes.
 */

import httpProxy from 'http-proxy'
import type { NextApiRequest, NextApiResponse } from 'next'

import { API_ENDPOINT } from '~/constants/config'

export const config = {
  api: {
    externalResolver: true,
    // We need to parse body to check for mutations
    bodyParser: true,
  },
}

/**
 * Check if a GraphQL request contains a mutation
 */
function containsMutation(body: unknown): boolean {
  if (!body || typeof body !== 'object') {
    return false
  }

  const { query } = body as { query?: string }

  if (!query || typeof query !== 'string') {
    return false
  }

  // Check if the query string contains a mutation operation
  // This handles both explicit "mutation" keyword and shorthand syntax
  const normalizedQuery = query.replace(/\s+/g, ' ').trim()

  // Check for explicit mutation keyword
  if (/\bmutation\b/i.test(normalizedQuery)) {
    return true
  }

  return false
}

/**
 * Check if a GraphQL query accesses sensitive member data
 * These queries should go through protected API routes with Firebase verification
 */
function containsSensitiveQuery(body: unknown): {
  isSensitive: boolean
  reason?: string
} {
  if (!body || typeof body !== 'object') {
    return { isSensitive: false }
  }

  const { query } = body as { query?: string }

  if (!query || typeof query !== 'string') {
    return { isSensitive: false }
  }

  const normalizedQuery = query.replace(/\s+/g, ' ').trim().toLowerCase()

  // Block: members query (exposes sensitive member data)
  // Allow: membersCount (only returns count, no sensitive data)
  if (
    normalizedQuery.includes('members') &&
    !normalizedQuery.includes('memberscount')
  ) {
    return {
      isSensitive: true,
      reason: 'Use /api/member/get for member data',
    }
  }

  // Block: favorites query with member filter (use /api/favorites/list instead)
  if (
    normalizedQuery.includes('favorites') &&
    normalizedQuery.includes('member')
  ) {
    return {
      isSensitive: true,
      reason: 'Use /api/favorites/list for favorites data',
    }
  }

  // Block: readingHistories query with member filter
  // (use /api/reading-history/list instead)
  if (
    normalizedQuery.includes('readinghistories') &&
    normalizedQuery.includes('member')
  ) {
    return {
      isSensitive: true,
      reason: 'Use /api/reading-history/list for reading history data',
    }
  }

  // Block: pollResults query with member filter (use /api/poll/member-vote instead)
  if (
    normalizedQuery.includes('pollresults') &&
    normalizedQuery.includes('member')
  ) {
    return {
      isSensitive: true,
      reason: 'Use /api/poll/member-vote for poll vote data',
    }
  }

  // Block: users query (CMS admin accounts - sensitive)
  // Allow: usersCount (only returns count)
  if (
    normalizedQuery.includes('users') &&
    !normalizedQuery.includes('userscount')
  ) {
    return {
      isSensitive: true,
      reason: 'CMS admin data is not accessible',
    }
  }

  return { isSensitive: false }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests for GraphQL
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Block mutations - they should go through dedicated API routes
  if (containsMutation(req.body)) {
    return res.status(403).json({
      error:
        'Mutations are not allowed through this endpoint. Use dedicated API routes.',
    })
  }

  // Block sensitive queries - they should go through protected API routes
  const sensitiveCheck = containsSensitiveQuery(req.body)
  if (sensitiveCheck.isSensitive) {
    return res.status(403).json({
      error: `Sensitive query blocked. ${sensitiveCheck.reason}`,
    })
  }

  // Create proxy for queries
  const proxy = httpProxy.createProxy()

  // Convert body back to string for proxying
  const bodyData = JSON.stringify(req.body)

  // Remove content-length as it may be incorrect after body parsing
  delete req.headers['content-length']

  proxy.web(req, res, {
    changeOrigin: true,
    target: API_ENDPOINT,
    // Since we parsed the body, we need to handle it manually
    buffer: Buffer.from(bodyData) as unknown as NodeJS.ReadableStream,
  })

  proxy.on('error', (err) => {
    console.error('Proxy error:', err)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Proxy error' })
    }
  })
}
