import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import styled from 'styled-components'

import AuthResultCard from '~/components/auth/auth-result-card'
import LayoutGeneral from '~/components/layout/layout-general'
import type { NextPageWithLayout } from '~/pages/_app'
import { setCacheControl } from '~/utils/common'
import { fetchHeaderData } from '~/utils/header-data'

const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.grayscale[95]};
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  padding-top: 120px;
`

const RegisterResultPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { success, error } = router.query
  const isSuccess = success === 'true'
  const errorMessage =
    typeof error === 'string' ? decodeURIComponent(error) : undefined

  const handleRetry = () => {
    router.push('/auth/register')
  }

  return (
    <PageWrapper>
      <AuthResultCard
        type="register"
        success={isSuccess}
        onRetry={handleRetry}
        errorMessage={errorMessage}
      />
    </PageWrapper>
  )
}

RegisterResultPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutGeneral title="註冊結果 - 環境資訊中心" description="註冊結果">
      {page}
    </LayoutGeneral>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  setCacheControl(res)

  const headerData = await fetchHeaderData()

  return {
    props: {
      headerData,
    },
  }
}

export default RegisterResultPage
