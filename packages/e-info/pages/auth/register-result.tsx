import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import styled from 'styled-components'

import AuthResultCard from '~/components/auth/auth-result-card'
import LayoutGeneral from '~/components/layout/layout-general'
import type { NextPageWithLayout } from '~/pages/_app'
import { setCacheControl } from '~/utils/common'

const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.grayscale[95]};
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`

const RegisterResultPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { success } = router.query
  const isSuccess = success === 'true'

  const handleRetry = () => {
    router.push('/auth/register')
  }

  return (
    <PageWrapper>
      <AuthResultCard
        type="register"
        success={isSuccess}
        onRetry={handleRetry}
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

  return {
    props: {},
  }
}

export default RegisterResultPage
