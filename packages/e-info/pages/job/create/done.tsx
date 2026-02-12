// 徵才建立完成頁面
import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'
import styled from 'styled-components'

import LayoutGeneral from '~/components/layout/layout-general'
import type { HeaderContextData } from '~/contexts/header-context'
import type { NextPageWithLayout } from '~/pages/_app'
import { setCacheControl } from '~/utils/common'
import { fetchHeaderData } from '~/utils/header-data'

type PageProps = {
  headerData: HeaderContextData
}

const PageWrapper = styled.div`
  background-color: #ffffff;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 20px;
`

const ContentWrapper = styled.div`
  max-width: 600px;
  width: 100%;
  text-align: center;
`

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  gap: 12px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 48px;
  }
`

const AccentBar = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[20]};
  width: 60px;
  height: 20px;
  border-bottom-right-radius: 12px;

  ${({ theme }) => theme.breakpoint.md} {
    width: 80px;
    height: 32px;
  }
`

const Title = styled.h1`
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[20]};
  margin: 0;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 28px;
    line-height: 32px;
  }
`

const MessageSection = styled.div`
  margin-bottom: 48px;
`

const MainMessage = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  margin: 0 0 24px 0;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
  }
`

const SubMessage = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  margin: 0;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
`

const Button = styled.button`
  padding: 12px 40px;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.grayscale[100]};
  background-color: ${({ theme }) => theme.colors.primary[40]};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[0]};
  }
`

const JobCreateDonePage: NextPageWithLayout<PageProps> = () => {
  return (
    <PageWrapper>
      <ContentWrapper>
        <SectionTitle>
          <AccentBar />
          <Title>建立環境徵才</Title>
        </SectionTitle>

        <MessageSection>
          <MainMessage>提交完成！謝謝您的投稿！</MainMessage>
          <SubMessage>
            編輯會在後台CMS中進行審核
            <br />
            審核通過後將予以發佈
          </SubMessage>
        </MessageSection>

        <Link href="/">
          <Button>回首頁</Button>
        </Link>
      </ContentWrapper>
    </PageWrapper>
  )
}

JobCreateDonePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutGeneral
      title="徵才提交完成 - 環境資訊中心"
      description="徵才建立完成"
    >
      {page}
    </LayoutGeneral>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  res,
}) => {
  setCacheControl(res)

  const headerData = await fetchHeaderData()

  return {
    props: {
      headerData,
    },
  }
}

export default JobCreateDonePage
