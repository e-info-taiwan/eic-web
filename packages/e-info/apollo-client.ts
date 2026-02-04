import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import { API_ENDPOINT } from '~/constants/config'
import { isServer } from '~/utils/common'

export const getGqlClient = () => {
  // Server-side: use API endpoint directly
  // Client-side: use /api/graphql proxy to avoid CORS issues
  // Note: All mutations are handled by dedicated API routes with proper protection
  const uri = isServer()
    ? API_ENDPOINT
    : `${window.location.origin}/api/graphql`

  return new ApolloClient({
    link: new HttpLink({ uri }),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
    },
  })
}
