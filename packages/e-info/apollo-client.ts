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
  let uri: string
  if (typeof window === 'undefined') {
    const serverConfig =
      require('~/constants/config.server') as typeof import('~/constants/config.server')
    uri = serverConfig.API_ENDPOINT
  } else {
    uri = `${window.location.origin}/api/graphql`
  }

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
