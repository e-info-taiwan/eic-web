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

const LoginResultPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { success } = router.query
  const isSuccess = success === 'true'

  const handleRetry = () => {
    router.push('/auth/login')
  }

  return (
    <PageWrapper>
      <AuthResultCard type="login" success={isSuccess} onRetry={handleRetry} />
    </PageWrapper>
  )
}

LoginResultPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutGeneral title="登入結果 - 環境資訊中心" description="登入結果">
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

export default LoginResultPage
