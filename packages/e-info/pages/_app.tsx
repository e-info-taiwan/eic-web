import { ApolloProvider } from '@apollo/client/react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import { useEffect } from 'react'
import { ThemeProvider } from 'styled-components'

import { getGqlClient } from '~/apollo-client'
import ComScoreScript from '~/components/comscore-script'
import Footer from '~/components/layout/footer'
import GDPRControl from '~/components/layout/gdpr-control'
import { NormalizeStyles } from '~/components/layout/normalize-styles'
import { ReadrStyles } from '~/components/layout/readr-styles'
import { AuthProvider } from '~/contexts/auth-context'
import theme from '~/styles/theme'
import * as gtag from '~/utils/gtag'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (
    /* eslint-disable-line no-unused-vars */ page: ReactElement
  ) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const client = getGqlClient()

  useEffect(() => {
    gtag.init()
  }, [])

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <>
      <NormalizeStyles />
      <ReadrStyles />
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            {getLayout(<Component {...pageProps} />)}
            <Footer />
            <GDPRControl />
          </AuthProvider>
        </ThemeProvider>
      </ApolloProvider>
      {/* use react script rather than next/Script to let the script show on the source of the html (view-source:) */}
      <ComScoreScript />
    </>
  )
}

export default MyApp
