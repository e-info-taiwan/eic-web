import type { FetchResult } from '@apollo/client'
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable,
} from '@apollo/client'

import { API_ENDPOINT } from '~/constants/config'
import { isServer } from '~/utils/common'
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
  // Server-side: use API endpoint directly
  // Client-side: use /api/graphql proxy to avoid CORS issues
  // Note: All mutations are handled by dedicated API routes with proper protection
  const uri = isServer()
    ? API_ENDPOINT
    : `${window.location.origin}/api/graphql`

  return new ApolloClient({
    link: ApolloLink.from([rewriteLink, new HttpLink({ uri })]),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
    },
  })
}
