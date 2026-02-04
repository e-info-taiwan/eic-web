import { API_ENDPOINT } from '~/constants/config'

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
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
      error:
        error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
