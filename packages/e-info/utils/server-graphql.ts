import { API_ENDPOINT } from '~/constants/config.server'

import { getIdToken } from './gcp-id-token'

type GraphQLResponse<T> = {
  data?: T
  errors?: Array<{ message: string }>
}

/**
 * Execute a GraphQL mutation from the server side
 * This bypasses the Apollo client and makes a direct fetch request
 */
export async function serverGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<{ data?: T; error?: string }> {
  try {
    const token = await getIdToken(API_ENDPOINT)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    if (!response.ok) {
      return {
        error: `GraphQL request failed: ${response.status} ${response.statusText}`,
      }
    }

    const result = (await response.json()) as GraphQLResponse<T>

    if (result.errors && result.errors.length > 0) {
      return {
        error: result.errors.map((e) => e.message).join(', '),
      }
    }

    return { data: result.data }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
