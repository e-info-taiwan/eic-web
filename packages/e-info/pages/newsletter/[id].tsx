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

const Banner = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1060 / 126;
  margin-bottom: 12px;
`

const NewsletterContent = styled.div<{ $raw?: boolean }>`
  background-color: #eee;
  overflow-x: hidden;

  ${({ $raw, theme }) =>
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
    width: 100% !important;
    border-collapse: collapse;
  }

  /* Override fixed-width inline styles (564px) from email template */
  [style*="width: 564px"],
  [style*="width:564px"] {
    width: 100% !important;
    max-width: 100% !important;
  }

  td, th {
    max-width: 100% !important;
    overflow-wrap: break-word;
    word-break: break-word;
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

  tr[id^='focus-row-'] td,
  tr[id^='topic-row-'] td {
    display: block;
    width: 100% !important;
  }

  tr[id^='focus-row-'] td img,
  tr[id^='topic-row-'] td img {
    max-width: 100%;
    height: auto;
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

  /* ===== Outer wrapper table ===== */
  .outer-wrapper { width: 100%; border-collapse: collapse; }

  /* ===== Global link styles ===== */
  .read-more-link { color: #DD8346; font-weight: bold; text-decoration: underline; }
  .read-more-link:hover { color: #B55514; }
  .dark-link { color: #232333; text-decoration: none; }
  .dark-link:hover { text-decoration: underline; }
  .muted-link { color: #333; text-decoration: none; }

  /* ===== 00-Header ===== */
  .subscriber-count { padding: 20px 20px 10px; font-size: 15px; color: #333; line-height: 1.6; text-align: center; }
  .header-date { padding: 5px 20px 15px; font-size: 16px; font-weight: bold; color: #333; text-align: center; }
  .header-title-td { padding: 10px 20px 25px; }
  .header-title { font-size: 22px; font-weight: bold; color: #388A48; margin: 0; line-height: 1.4; text-align: center; }

  /* ===== Section Header (green bar) ===== */
  .section-header { background-color: #388A48; padding: 12px 20px; font-size: 18px; font-weight: bold; color: #ffffff; text-align: center; }

  /* ===== 01-Content (TOC) ===== */
  .toc-title { padding: 15px 20px 5px; font-size: 18px; font-weight: bold; color: #333; text-align: center; }
  .toc-container { padding: 15px 20px; border-bottom: 20px solid #D9D9D9; }
  .toc-item { padding-bottom: 12px; font-size: 14px; color: #333; line-height: 1.6; }
  .toc-item-last { padding-bottom: 0; font-size: 14px; color: #333; line-height: 1.6; }

  /* ===== Articles ===== */
  .article-cell { padding: 20px; border-bottom: 1px solid #eee; }
  .article-img { width: 100%; height: auto; display: block; margin-bottom: 15px; }
  .article-title { font-size: 20px; font-weight: 700; color: #232333; margin: 0 0 10px; line-height: 28px; }
  .article-title a { color: #232333; text-decoration: none; }
  .article-title a:hover { text-decoration: underline; }
  .article-excerpt { font-size: 14px; color: #333; line-height: 1.8; margin: 0 0 10px; }
  .read-more-inline { color: #DD8346; font-weight: bold; margin-left: 4px; text-decoration: underline; }
  .read-more-inline:hover { color: #B55514; }

  /* ===== 02-Highlight & 03-Ranking (shared card styles) ===== */
  .card-section { padding: 0 20px 53px; }
  .card-row-border { border-bottom: 1px solid #eee; }
  .card-thumb-td { padding: 20px 15px 20px 0; }
  .card-thumb { width: 120px; height: 120px; display: block; object-fit: cover; }
  .card-content-td { padding: 20px 0; }
  .card-content-table { height: 120px; }
  .card-title { font-size: 18px; font-weight: 500; color: #232333; line-height: 1.5; }
  .card-title a { color: #232333; text-decoration: none; }
  .card-title a:hover { text-decoration: underline; }
  .card-read-more { font-size: 14px; }

  /* ===== 03-Ranking specific ===== */
  .ranking-thumb-td { padding: 15px 0; }
  .ranking-number { padding: 15px 0; font-size: 42px; font-weight: bold; color: #388A48; line-height: 1; text-align: center; }
  .ranking-content-td { padding: 15px 0 15px 10px; }

  /* ===== Ads ===== */
  .ads-cell { padding: 20px; text-align: center; }
  .ad-spacer { padding-bottom: 15px; }
  .ad-img { max-width: 100%; height: auto; display: block; }

  /* ===== 04-Events & 05-Jobs (shared list styles) ===== */
  .list-item { padding: 15px 0; border-bottom: 1px solid #ddd; }
  .list-item-dark { padding: 15px 0; border-bottom: 1px solid #333; }
  .list-item-last { padding: 15px 0; }
  .list-date { font-size: 15px; color: #388A48; font-weight: bold; margin-bottom: 5px; }
  .list-title { font-size: 17px; font-weight: bold; margin-bottom: 5px; }
  .list-title a { color: #333; text-decoration: none; }
  .list-title a:hover { text-decoration: underline; }
  .list-org { font-size: 14px; color: #666; }

  /* ===== 06-Comment (推薦讀者回應) ===== */
  .comment-cell { padding: 30px 20px; }
  .comment-quote { font-size: 20px; font-weight: 700; color: #5B9D68; line-height: 28px; margin: 0 0 30px; text-align: center; }
  .comment-source { font-size: 16px; font-weight: 700; color: #373740; line-height: 1.5; text-decoration: underline; margin: 0 0 15px; text-align: center; }
  .comment-read-more { text-align: center; margin: 0; }
  .comment-read-more a { color: #DD8346; font-size: 16px; font-weight: bold; text-decoration: underline; }
  .comment-read-more a:hover { color: #B55514; }

  /* ===== 07-Poll ===== */
  .poll-cell { padding: 20px; }
  .poll-title { font-size: 18px; font-weight: 500; color: #388A48; margin-bottom: 16px; }
  .poll-desc { font-size: 14px; color: #232333; margin-bottom: 24px; line-height: 1.5; }
  .poll-option { padding-bottom: 8px; }
  .poll-vote-link { text-decoration: none; color: inherit; display: block; }
  .poll-radio-td { padding-right: 12px; }
  .poll-radio { width: 20px; height: 20px; border: 2px solid #A0A0A2; border-radius: 50%; background-color: #ffffff; }
  .poll-bar-bg { background-color: #EAEAEA; border-radius: 4px; }
  .poll-bar-fill { background-color: #CFEDD1; height: 25px; border-radius: 4px 0 0 4px; font-size: 0; line-height: 0; }
  .poll-bar-label { height: 25px; padding: 0 8px; white-space: nowrap; }
  .poll-emoji { width: 20px; height: 20px; display: inline-block; vertical-align: middle; margin-right: 4px; }
  .poll-text { font-size: 16px; line-height: 25px; color: #232333; vertical-align: middle; }

  /* ===== 08-Referral ===== */
  .referral-cell { padding: 20px; }
  .referral-box { border: 2px solid #388A48; }
  .referral-inner { padding: 25px 20px; text-align: center; }
  .referral-title { font-size: 20px; font-weight: bold; color: #388A48; margin-bottom: 20px; }
  .referral-desc { font-size: 15px; color: #333; margin: 0 0 25px; line-height: 1.6; }
  .referral-highlight { color: #388A48; font-weight: bold; }
  .referral-links { font-size: 15px; }
  .referral-link { color: #388A48; display: block; margin: 8px 0; }

  /* ===== 09-Footer ===== */
  .footer-cell { padding: 30px 20px; text-align: center; }
  .social-icons { margin-bottom: 20px; }
  .social-icon-td { padding: 0 8px; }
  .social-icon { width: 30px; height: 30px; display: block; }
  .footer-text { font-size: 14px; color: #333; margin: 0 0 20px; line-height: 1.8; }
  .footer-links { font-size: 15px; margin: 0 0 20px; }
  .footer-link { color: #388A48; font-weight: bold; text-decoration: underline; }
  .footer-divider { color: #388A48; }
  .footer-copyright { font-size: 12px; color: #666; margin: 0; }

  /* ===== Responsive ===== */
  @media only screen and (max-width: 620px) {
    .card-thumb { width: 90px !important; height: 90px !important; }
    .ranking-number { width: 36px !important; font-size: 32px !important; }
  }
  `}
`

const ErrorMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.grayscale[60]};
  font-size: 16px;
`

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

  // Only auto-vote when both vote AND utm_source are present
  const shouldAutoVote = isValidVote && !!utm_source

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

        {newsletter.standardHtml && (
          <NewsletterContent
            $raw={isRawMode}
            dangerouslySetInnerHTML={{
              __html: newsletter.standardHtml.includes('00-Header')
                ? `<table role="presentation" class="outer-wrapper" width="100%" cellpadding="0" cellspacing="0" border="0">${newsletter.standardHtml}</table>`
                : newsletter.standardHtml,
            }}
          />
        )}

        {newsletter.poll && (
          <PostPoll
            ref={pollRef}
            poll={newsletter.poll}
            newsletterId={newsletter.id}
            hideBorderTop
            autoVote={shouldAutoVote ? voteOption : undefined}
          />
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
