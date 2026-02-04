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
import { GlobalStyles } from '~/components/layout/global-styles'
import { AuthProvider } from '~/contexts/auth-context'
import type { HeaderContextData } from '~/contexts/header-context'
import { HeaderProvider } from '~/contexts/header-context'
import theme from '~/styles/theme'
import * as gtag from '~/utils/gtag'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (
    /* eslint-disable-line no-unused-vars */ page: ReactElement
  ) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
  pageProps: {
    headerData?: HeaderContextData
    [key: string]: unknown
  }
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const client = getGqlClient()

  useEffect(() => {
    gtag.init()
  }, [])

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  // Extract headerData from pageProps (provided by getServerSideProps/getStaticProps)
  const { headerData, ...restPageProps } = pageProps

  return (
    <>
      <NormalizeStyles />
      <GlobalStyles />
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <HeaderProvider data={headerData}>
              {getLayout(<Component {...restPageProps} />)}
              <Footer />
              <GDPRControl />
            </HeaderProvider>
          </AuthProvider>
        </ThemeProvider>
      </ApolloProvider>
      {/* use react script rather than next/Script to let the script show on the source of the html (view-source:) */}
      <ComScoreScript />
    </>
  )
}

export default MyApp
