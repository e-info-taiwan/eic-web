import errors from '@twreporter/errors'
import type { GetServerSideProps } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { type ReactElement, useEffect, useRef } from 'react'
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
  margin-top: 53px;
  margin-bottom: 53px;
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

const NewsletterContent = styled.div<{ $raw?: boolean }>`
  background-color: #eee;

  ${({ $raw }) =>
    !$raw &&
    `
  /* Override inline styles from standardHtml */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  a {
    color: #2d7a4f;
    text-decoration: none;
  }

  a:hover {
    opacity: 0.8;
  }

  table {
    max-width: 100% !important;
    border-collapse: collapse;
  }

  td.mcnTextContent {
    padding: 0;
  }

  /* News title bar - green background */
  .news-tit {
    color: #fff;
    background-color: #2d7a4f;
    padding: 10px 15px;
    margin-bottom: 0;
  }

  .news-tit a,
  .news-tit a div {
    color: #fff;
    text-decoration: none;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.4;
  }

  /* News scan title */
  .news-scan-tit {
    background-color: #2d7a4f;
    color: #fff;
    padding: 10px 15px;
    font-size: 16px;
    line-height: 1.5;
  }

  /* Field content styling */
  .views-field-field--1 .field-content {
    padding: 15px;
    font-size: 15px;
    line-height: 1.8;
    color: #333;
    background: #fff;
  }

  .views-field-body .field-content {
    padding: 0 15px 15px;
    background: #fff;
  }

  /* Read more link */
  .float-right {
    text-align: right;
    padding: 10px 15px;
    background: #fff;
  }

  .float-right a {
    font-size: 14px;
    text-decoration: none;
  }

  /* Section labels (近期活動, 特別推薦活動) */
  .field-label {
    background-color: #2d7a4f;
    color: #fff;
    padding: 8px 15px;
    font-size: 16px;
    font-weight: 700;
    margin: 0;
  }

  .views-field {
    background: #fff;
    padding: 10px 15px;
  }

  /* Event list styling */
  .view-content ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .view-content ul li {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    line-height: 1.6;
  }

  .view-content ul li:last-child {
    border-bottom: none;
  }

  .view-content ul li a {
    color: #333;
    text-decoration: none;
  }

  .view-content ul li a:hover {
    color: #2d7a4f;
  }

  .date-display-single {
    color: #2d7a4f;
    font-weight: 700;
    margin-right: 8px;
  }

  /* View header for special sections */
  .view-header {
    margin-top: 15px;
  }

  /* Ad banners container */
  .content.clearfix {
    text-align: center;
    padding: 10px 0;
  }

  /* Ad banners */
  .node-simpleads {
    display: inline-block;
    margin: 0 10px 25px;
  }

  .node-simpleads img {
    max-width: 250px;
    height: auto;
  }

  /* Table row spacing */
  tr[id^='focus-row-'],
  tr[id^='topic-row-'] {
    display: block;
    background: #fff;
    line-height: 1.5;
    margin-bottom: 20px;
  }

  /* Responsive adjustments */
  @media (min-width: 768px) {
    .news-tit a,
    .news-tit a div {
      font-size: 20px;
    }

    .views-field-field--1 .field-content {
      font-size: 16px;
    }
  }

  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;

  /* ===== 01-Content ===== */
  .section-header {
    text-align: center;
    padding: 15px 20px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  .toc-list {
    padding: 15px 20px;
    border-bottom: 20px solid #D9D9D9;
  }
  .toc-item {
    padding: 8px 0;
    font-size: 14px;
    color: #333;
  }
  .toc-item:last-child {
    border-bottom: none;
  }
  .toc-item::before {
    content: "·";
    margin-right: 8px;
    font-weight: bold;
  }
  .article-section {
    padding: 20px;
    border-bottom: 1px solid #eee;
  }
  .article-image {
    width: 100%;
    margin-bottom: 15px;
  }
  .article-title {
    font-size: 18px;
    font-weight: bold;
    color: #388A48;
    margin: 0 0 10px;
    line-height: 1.4;
  }
  .article-content {
    font-size: 14px;
    color: #333;
    line-height: 1.8;
    margin-bottom: 10px;
  }
  .read-more {
    text-align: right;
    font-size: 14px;
  }
  .read-more a {
    color: #DD8346;
    font-weight: bold;
  }

  /* ===== 02-Highlight (焦點話題) ===== */
  .green-header {
    background-color: #388A48;
    color: white;
    text-align: center;
    padding: 12px 20px;
    font-size: 18px;
    font-weight: bold;
  }
  .highlight-item {
    display: flex;
    padding: 20px;
    border-bottom: 1px solid #eee;
    align-items: stretch;
  }
  .highlight-item:last-child {
    border-bottom: none;
  }
  .highlight-thumb {
    width: 120px;
    height: 120px;
    object-fit: cover;
    flex-shrink: 0;
    margin-right: 15px;
  }
  .highlight-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .highlight-title {
    font-size: 15px;
    color: #333;
    line-height: 1.5;
  }
  .highlight-content .read-more {
    text-align: right;
  }

  /* ===== 03-Ranking (閱讀排名) ===== */
  .ranking-item {
    display: flex;
    padding: 15px 20px;
    align-items: stretch;
  }
  .ranking-item:last-child {
    border-bottom: none;
  }
  .ranking-thumb {
    width: 120px;
    height: 120px;
    object-fit: cover;
    flex-shrink: 0;
    margin-right: 10px;
  }
  .ranking-number {
    font-size: 42px;
    font-weight: bold;
    color: #388A48;
    width: 50px;
    flex-shrink: 0;
    text-align: center;
    line-height: 1;
    margin-right: 10px;
  }
  .ranking-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .ranking-content .read-more {
    text-align: right;
  }
  .ranking-title {
    font-size: 14px;
    color: #333;
    line-height: 1.5;
  }

  /* Ads Section */
  .ads-section {
    padding: 20px;
    background-color: #fff;
    text-align: center;
  }
  .ad-link {
    display: inline-block;
    margin: 0 10px 15px;
  }
  .ad-link:last-child {
    margin-bottom: 0;
  }
  .ad-image {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* ===== 04-Events (近期活動) ===== */
  .event-item {
    padding: 15px 20px;
    border-bottom: 1px solid #ddd;
  }
  .event-item:last-child {
    border-bottom: none;
  }
  .event-date {
    font-size: 15px;
    color: #388A48;
    font-weight: bold;
    margin-bottom: 5px;
  }
  .event-title {
    font-size: 17px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }
  .event-org {
    font-size: 14px;
    color: #666;
  }

  /* ===== 05-Jobs (環境徵才) ===== */
  .job-item {
    padding: 15px 20px;
    border-bottom: 1px solid #333;
  }
  .job-item:last-child {
    border-bottom: none;
  }
  .job-date {
    font-size: 15px;
    color: #388A48;
    font-weight: bold;
    margin-bottom: 5px;
  }
  .job-title {
    font-size: 17px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }
  .job-org {
    font-size: 14px;
    color: #666;
  }

  /* ===== 06-Comment (推薦讀者回應) ===== */
  .comment-section {
    padding: 30px 20px;
    background-color: #fff;
  }
  .comment-quote {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    line-height: 1.6;
    margin-bottom: 30px;
  }
  .comment-source {
    font-size: 15px;
    color: #388A48;
    margin-bottom: 15px;
  }
  .comment-link {
    text-align: center;
  }
  .comment-link a {
    color: #DD8346;
    font-size: 16px;
    font-weight: bold;
  }
  `}
`

const ErrorMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.grayscale[60]};
  font-size: 16px;
`

const NewsletterFooter = styled.footer`
  background-color: #fff;
  padding: 40px 16px;
  text-align: center;
  border-top: 1px solid #ccc;
  margin-top: 40px;
`

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 24px;
`

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #333;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 32px;
    height: 32px;
    fill: currentColor;
  }
`

const FooterText = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0 0 8px;
  line-height: 1.6;
`

const FooterActions = styled.div`
  margin: 32px 0;

  a {
    font-size: 18px;
    font-weight: 500;
    color: #2d7a4f;
    text-decoration: underline;

    &:hover {
      opacity: 0.8;
    }
  }

  span {
    color: #2d7a4f;
    margin: 0 8px;
  }
`

const Copyright = styled.p`
  font-size: 14px;
  color: #999;
  margin: 0;
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
  const router = useRouter()
  const pollRef = useRef<HTMLElement>(null)

  // Get vote, utm_source, and raw from query parameters
  const { vote, utm_source, raw } = router.query
  const isRawMode = raw === 'true'
  const voteOption = vote ? parseInt(vote as string, 10) : undefined
  const isValidVote = voteOption && voteOption >= 1 && voteOption <= 5

  // Only auto-vote when both vote AND utm_source=email are present
  const shouldAutoVote = isValidVote && utm_source === 'email'

  // Auto-scroll to poll section when vote parameter exists
  useEffect(() => {
    if (isValidVote && pollRef.current) {
      // Small delay to ensure the page is fully rendered
      const timer = setTimeout(() => {
        pollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isValidVote])

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
            $raw={isRawMode}
            dangerouslySetInnerHTML={{ __html: newsletter.standardHtml }}
          />
        )}

        <ReferralSection>
          <ReferralTitle>你的推薦狀態</ReferralTitle>
          <ReferralText>
            你總共有 <strong>0</strong> 個推薦。邀請 <strong>1</strong>{' '}
            個朋友訂閱來獲得點數。
          </ReferralText>
          <ReferralLinkWrapper>
            <ReferralLink href="#">點擊此處邀請你的朋友訂閱！</ReferralLink>
          </ReferralLinkWrapper>
          <ReferralSubLinkWrapper>
            <ReferralSubLink href="#">或查看集點狀態及獎勵。</ReferralSubLink>
          </ReferralSubLinkWrapper>
        </ReferralSection>

        {newsletter.poll && (
          <PostPoll
            ref={pollRef}
            poll={newsletter.poll}
            postId={newsletter.id}
            hideBorderTop
            autoVote={shouldAutoVote ? voteOption : undefined}
          />
        )}

        <NewsletterFooter>
          <SocialLinks>
            <SocialLink
              href="https://www.facebook.com/enc.teia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </SocialLink>
            <SocialLink
              href="https://x.com/e_info"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </SocialLink>
            <SocialLink
              href="https://line.me/R/ti/p/@e-info"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LINE"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
            </SocialLink>
          </SocialLinks>
          <FooterText>電子報由社團法人台灣環境資訊協會發行</FooterText>
          <FooterText>對我們有任何疑問或指教歡迎利用以上連結連繫</FooterText>
          <FooterActions>
            <a href="#">更新資料</a>
            <span>|</span>
            <a href="#">退訂電子報</a>
            <span>|</span>
            <a
              href="https://e-info.neticrm.tw/civicrm/contribute/transact?reset=1&id=9"
              target="_blank"
              rel="noopener noreferrer"
            >
              我要捐款
            </a>
          </FooterActions>
          <Copyright>
            Copyright © {new Date().getFullYear()} Taiwan Environmental
            Information Association, All rights reserved.
          </Copyright>
        </NewsletterFooter>
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

    const newsletter = data.newsletter

    // Redirect to originalUrl for newsletters before 2016/01/05
    const cutoffDate = new Date('2016-01-05')
    const sendDate = new Date(newsletter.sendDate)
    if (sendDate < cutoffDate && newsletter.originalUrl) {
      return {
        redirect: {
          destination: newsletter.originalUrl,
          permanent: true,
        },
      }
    }

    return {
      props: {
        headerData,
        newsletter,
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
