import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import { API_ENDPOINT } from '~/constants/config'
import { isServer } from '~/utils/common'

export const getGqlClient = () => {
  // make apollo client support for both client-side and server-side
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
