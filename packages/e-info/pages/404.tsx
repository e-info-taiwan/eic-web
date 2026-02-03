import type { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import type { ReactElement } from 'react'
import styled from 'styled-components'

import LayoutGeneral from '~/components/layout/layout-general'
import { SITE_TITLE } from '~/constants/constant'
import type { HeaderContextData } from '~/contexts/header-context'
import { fetchHeaderData } from '~/utils/header-data'

import type { NextPageWithLayout } from './_app'

type PageProps = {
  headerData: HeaderContextData
}

const Page = styled.div`
  background: #ffffff;
  font-family: 'Noto Sans TC';
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 0 120px 0;
`

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 600px;
  width: 100%;
`

const ErrorCode = styled.h1`
  font-size: 128px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.primary[20]};
  margin: 0;
  line-height: 1.5;
  letter-spacing: 0;
`

const ErrorMessage = styled.h2`
  font-family: 'Noto Sans TC';
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  line-height: 28px;
  margin-bottom: 40px;
`

const Button = styled.button`
  padding: 5.5px 12px;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.primary[40]};
  border-radius: 4px;
  font-family: 'Noto Sans TC';
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[20]};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[20]};
    color: #ffffff;
  }
`

const NotFound: NextPageWithLayout<PageProps> = () => {
  return (
    <Page>
      <Head>
        <title>{`找不到頁面｜${SITE_TITLE}`}</title>
      </Head>
      <ErrorContainer>
        <ErrorCode>404</ErrorCode>
        <ErrorMessage>抱歉！找不到這個網址</ErrorMessage>
        <Link href="/">
          <Button>回首頁</Button>
        </Link>
      </ErrorContainer>
    </Page>
  )
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const headerData = await fetchHeaderData()

  return {
    props: {
      headerData,
    },
  }
}

NotFound.getLayout = function getLayout(page: ReactElement): ReactElement {
  return <LayoutGeneral>{page}</LayoutGeneral>
}

export default NotFound
