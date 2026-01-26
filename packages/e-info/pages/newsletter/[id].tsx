import errors from '@twreporter/errors'
import type { GetServerSideProps } from 'next'
import Image from 'next/image'
import type { ReactElement } from 'react'
import styled from 'styled-components'

import { getGqlClient } from '~/apollo-client'
import LayoutGeneral from '~/components/layout/layout-general'
import PostPoll from '~/components/post/post-poll'
import type { HeaderContextData } from '~/contexts/header-context'
import type { NewsletterDetail } from '~/graphql/query/newsletter'
import { newsletterById } from '~/graphql/query/newsletter'
import type { NextPageWithLayout } from '~/pages/_app'
import { setCacheControl } from '~/utils/common'
import { fetchHeaderData } from '~/utils/header-data'

const PageWrapper = styled.div`
  background-color: #ffffff;
  min-height: 100vh;
`

const ContentWrapper = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 16px 60px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 40px 20px 80px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 60px 20px 100px;
  }
`

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.primary[20]};
  margin: 0 0 24px;
  text-align: center;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 28px;
    font-weight: 500;
    line-height: 32px;
    margin-bottom: 32px;
  }
`

const SendDate = styled.div`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  text-align: center;
  margin-bottom: 20px;
`

const Banner = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1060 / 126;
  margin-bottom: 24px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 32px;
  }
`

const ReferralSection = styled.section`
  border: 3px solid ${({ theme }) => theme.colors.primary[20]};
  padding: 24px 16px;
  margin-bottom: 48px;
  text-align: center;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 32px 24px;
  }
`

const ReferralTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[40]};
  margin: 0 0 16px;
`

const ReferralText = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  margin: 0 0 24px;

  strong {
    color: ${({ theme }) => theme.colors.primary[40]};
  }
`

const ReferralLinkWrapper = styled.div`
  margin-bottom: 8px;
`

const ReferralLink = styled.a`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[40]};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`

const ReferralSubLinkWrapper = styled.div``

const ReferralSubLink = styled.a`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const NewsletterContent = styled.div`
  background-color: #ffffff;

  /* Override inline styles from standardHtml */
  img {
    max-width: 100%;
    height: auto;
  }

  a {
    color: #2d7a4f;
    text-decoration: underline;

    &:hover {
      opacity: 0.8;
    }
  }

  table {
    max-width: 100% !important;
  }

  /* News title styling */
  .news-tit {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 12px;

    a {
      color: ${({ theme }) => theme.colors.grayscale[20]};
      text-decoration: none;

      &:hover {
        color: #2d7a4f;
      }
    }
  }

  /* Field content styling */
  .field-content {
    font-size: 16px;
    line-height: 1.8;
    color: ${({ theme }) => theme.colors.grayscale[40]};
  }

  /* Read more link */
  .float-right {
    text-align: right;
    margin-top: 12px;

    a {
      font-size: 14px;
    }
  }

  /* List styling */
  ul {
    padding-left: 20px;
    margin: 8px 0;
  }

  li {
    margin-bottom: 8px;
    line-height: 1.6;
  }
`

const ErrorMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.grayscale[60]};
  font-size: 16px;
`

// Format date as yyyy/mm/dd
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

type PageProps = {
  headerData: HeaderContextData
  newsletter: NewsletterDetail | null
}

const NewsletterDetailPage: NextPageWithLayout<PageProps> = ({
  newsletter,
}) => {
  if (!newsletter) {
    return (
      <PageWrapper>
        <ContentWrapper>
          <ErrorMessage>找不到此電子報</ErrorMessage>
        </ContentWrapper>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <ContentWrapper>
        <Banner>
          <Image
            src="/newsletter-banner.png"
            alt="環境資訊電子報 EIC Newsletter"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </Banner>
        <SendDate>{formatDate(newsletter.sendDate)}</SendDate>
        <Title>{newsletter.title}</Title>

        {newsletter.standardHtml && (
          <NewsletterContent
            dangerouslySetInnerHTML={{ __html: newsletter.standardHtml }}
          />
        )}

        <ReferralSection>
          <ReferralTitle>你的推薦狀態</ReferralTitle>
          <ReferralText>
            你總共有 <strong>0</strong> 個推薦。邀請{' '}
            <strong>1</strong> 個朋友訂閱來獲得點數。
          </ReferralText>
          <ReferralLinkWrapper>
            <ReferralLink href="#">點擊此處邀請你的朋友訂閱！</ReferralLink>
          </ReferralLinkWrapper>
          <ReferralSubLinkWrapper>
            <ReferralSubLink href="#">或查看集點狀態及獎勵。</ReferralSubLink>
          </ReferralSubLinkWrapper>
        </ReferralSection>

        {newsletter.poll && (
          <PostPoll poll={newsletter.poll} postId={newsletter.id} hideBorderTop />
        )}
      </ContentWrapper>
    </PageWrapper>
  )
}

NewsletterDetailPage.getLayout = function getLayout(page: ReactElement) {
  const { newsletter } = page.props as PageProps
  const title = newsletter?.title || '電子報'
  const description = newsletter?.title
    ? `${newsletter.title} - 環境資訊中心電子報`
    : '環境資訊中心電子報'

  return (
    <LayoutGeneral title={title} description={description}>
      {page}
    </LayoutGeneral>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  params,
  res,
}) => {
  setCacheControl(res)

  const id = params?.id as string

  if (!id) {
    return {
      notFound: true,
    }
  }

  const client = getGqlClient()

  try {
    const [headerData, { data }] = await Promise.all([
      fetchHeaderData(),
      client.query<{ newsletter: NewsletterDetail | null }>({
        query: newsletterById,
        variables: { id },
      }),
    ])

    if (!data?.newsletter) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        headerData,
        newsletter: data.newsletter,
      },
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching data at Newsletter Detail page'
    )

    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(annotatingError, {
          withStack: false,
          withPayload: true,
        }),
      })
    )

    return {
      props: {
        headerData: {
          sections: [],
          featuredTags: [],
          topics: [],
          newsBarPicks: [],
          siteConfigs: [],
        },
        newsletter: null,
      },
    }
  }
}

export default NewsletterDetailPage
