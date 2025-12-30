import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'

import { API_ENDPOINT } from '~/constants/config'

// Apollo Client configured for file uploads
// Uses createUploadLink which supports multipart form data for file uploads
export const getUploadClient = () => {
  const uploadLink = createUploadLink({
    uri: API_ENDPOINT,
    // Enable credentials for CORS
    credentials: 'include',
    headers: {
      'Apollo-Require-Preflight': 'true',
    },
  })

  return new ApolloClient({
    link: uploadLink as unknown as ApolloLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      mutate: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  })
}
