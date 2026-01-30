import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import { EDITOOLS_API_ENDPOINT } from '~/constants/config'

const editoolsClient = new ApolloClient({
  link: new HttpLink({ uri: EDITOOLS_API_ENDPOINT }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
})

export default editoolsClient
