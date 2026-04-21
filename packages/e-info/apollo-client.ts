import type { FetchResult } from '@apollo/client'
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable,
} from '@apollo/client'

import { rewriteGcsUrls } from '~/utils/rewrite-gcs-urls'

// Rewrite GCS image URLs in GraphQL responses to use local proxy
const rewriteLink = new ApolloLink((operation, forward) => {
  return new Observable<FetchResult>((observer) => {
    forward(operation).subscribe({
      next: (response) => {
        if (response.data) {
          response.data = rewriteGcsUrls(response.data)
        }
        observer.next(response)
      },
      error: (err) => observer.error(err),
      complete: () => observer.complete(),
    })
  })
})

export const getGqlClient = () => {
  // Server-side: use API endpoint directly (loaded via server-only require so
  // the URL literal is DCE'd from the client bundle by Next.js).
  // Client-side: use /api/graphql same-origin proxy.
  let httpLink: HttpLink
  if (typeof window === 'undefined') {
    const serverConfig =
      require('~/constants/config.server') as typeof import('~/constants/config.server')
    const { getIdToken } =
      require('~/utils/gcp-id-token') as typeof import('~/utils/gcp-id-token')
    const uri = serverConfig.API_ENDPOINT

    // Attach a Cloud Run IAM ID token on server-side calls so the CMS
    // GraphQL service can run with --no-allow-unauthenticated.
    const authFetch: typeof fetch = async (input, init) => {
      const token = await getIdToken(uri)
      const headers = new Headers(init?.headers)
      if (token) headers.set('authorization', `Bearer ${token}`)
      return fetch(input, { ...init, headers })
    }

    httpLink = new HttpLink({ uri, fetch: authFetch })
  } else {
    httpLink = new HttpLink({ uri: `${window.location.origin}/api/graphql` })
  }

  return new ApolloClient({
    link: ApolloLink.from([rewriteLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
    },
  })
}
