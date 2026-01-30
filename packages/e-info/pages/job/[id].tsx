// 徵才詳細頁面
import errors from '@twreporter/errors'
import type { GetServerSideProps } from 'next'
import type { ReactElement } from 'react'
import styled from 'styled-components'

import { getGqlClient } from '~/apollo-client'
import LayoutGeneral from '~/components/layout/layout-general'
import type { HeaderContextData } from '~/contexts/header-context'
import type { Job } from '~/graphql/query/job'
import { jobById } from '~/graphql/query/job'
import type { NextPageWithLayout } from '~/pages/_app'
import BookmarkIcon from '~/public/icons/bookmark.svg'
import FacebookIcon from '~/public/icons/facebook.svg'
import LineIcon from '~/public/icons/line.svg'
import XIcon from '~/public/icons/x.svg'
import { setCacheControl } from '~/utils/common'
import { fetchHeaderData } from '~/utils/header-data'

const PageWrapper = styled.div`
  background-color: #ffffff;
  min-height: 100vh;
`

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 60px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 48px 48px 80px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 60px 78px 100px;
  }
`

const JobHeader = styled.div`
  max-width: 760px;
  margin: 0 auto;
  margin-bottom: 40px;
`

const CategoryLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary[20]};
  margin-bottom: 12px;
  text-align: center;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
    margin-bottom: 16px;
  }
`

const DateInfo = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  margin-bottom: 20px;
  text-align: center;
`

const JobTitle = styled.h1`
  font-size: 28px;
  font-weight: 500;
  line-height: 1.25;
  color: #000;
  margin: 0 0 24px;
  text-align: center;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 36px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 36px;
  }
`

const JobMetaGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 24px;
  }
`

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  text-align: center;
`

const MetaLabel = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #000;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
`

const ShareButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 48px;
  }
`

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: opacity 0.2s ease;
  padding: 0;

  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const JobContent = styled.div`
  max-width: 760px;
  margin: 0 auto;
`

const ContentSection = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[20]};
  margin: 0 0 16px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 20px;
  }
`

const ContentText = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: #000;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
  }

  p {
    margin: 0 0 1em;
  }

  ul,
  ol {
    margin: 0 0 1em;
    padding-left: 1.5em;
  }

  li {
    margin-bottom: 0.5em;
  }

  strong {
    font-weight: 700;
  }

  a {
    color: ${({ theme }) => theme.colors.primary[20]};
    text-decoration: underline;
  }
`

const ErrorMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.grayscale[60]};
  font-size: 16px;
`

type PageProps = {
  headerData: HeaderContextData
  job: Job | null
}

// Format date as yyyy年mm月dd日
const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

// Format date range
const formatDateRange = (startDate?: string, endDate?: string): string => {
  if (!startDate) return ''
  const start = formatDate(startDate)
  if (!endDate) return start
  const end = formatDate(endDate)
  if (start === end) return start
  return `${start} ~ ${end}`
}

// Get plain text excerpt from HTML
const getPlainText = (html?: string, maxLength = 150): string => {
  if (!html) return ''
  const text = html.replace(/<[^>]*>/g, '').trim()
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const JobPage: NextPageWithLayout<PageProps> = ({ job }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.href
      )}`,
      '_blank'
    )
  }

  const handleShareX = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        window.location.href
      )}`,
      '_blank'
    )
  }

  const handleShareLine = () => {
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
        window.location.href
      )}`,
      '_blank'
    )
  }

  if (!job) {
    return (
      <PageWrapper>
        <ContentWrapper>
          <ErrorMessage>找不到此徵才資訊</ErrorMessage>
        </ContentWrapper>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <ContentWrapper>
        <JobHeader>
          <CategoryLabel>環境徵才</CategoryLabel>
          {(job.startDate || job.endDate) && (
            <DateInfo>
              徵才期間：{formatDateRange(job.startDate, job.endDate)}
            </DateInfo>
          )}
          <JobTitle>{job.title}</JobTitle>

          <JobMetaGrid>
            {job.company && (
              <MetaItem>
                <MetaLabel>招募單位：{job.company}</MetaLabel>
              </MetaItem>
            )}
            {job.salary && (
              <MetaItem>
                <MetaLabel>薪資：{job.salary}</MetaLabel>
              </MetaItem>
            )}
            {job.bonus && (
              <MetaItem>
                <MetaLabel>福利：{job.bonus}</MetaLabel>
              </MetaItem>
            )}
          </JobMetaGrid>

          <ShareButtons>
            <ShareButton onClick={handleCopyLink} aria-label="複製連結">
              <BookmarkIcon />
            </ShareButton>
            <ShareButton
              onClick={handleShareFacebook}
              aria-label="分享到 Facebook"
            >
              <FacebookIcon />
            </ShareButton>
            <ShareButton onClick={handleShareX} aria-label="分享到 X">
              <XIcon />
            </ShareButton>
            <ShareButton onClick={handleShareLine} aria-label="分享到 Line">
              <LineIcon />
            </ShareButton>
          </ShareButtons>
        </JobHeader>

        <JobContent>
          {job.jobDescription && (
            <ContentSection>
              <SectionTitle>職務說明</SectionTitle>
              <ContentText
                dangerouslySetInnerHTML={{ __html: job.jobDescription }}
              />
            </ContentSection>
          )}

          {job.requirements && (
            <ContentSection>
              <SectionTitle>應徵條件</SectionTitle>
              <ContentText
                dangerouslySetInnerHTML={{ __html: job.requirements }}
              />
            </ContentSection>
          )}

          {job.applicationMethod && (
            <ContentSection>
              <SectionTitle>應徵方式</SectionTitle>
              <ContentText
                dangerouslySetInnerHTML={{ __html: job.applicationMethod }}
              />
            </ContentSection>
          )}
        </JobContent>
      </ContentWrapper>
    </PageWrapper>
  )
}

JobPage.getLayout = function getLayout(page: ReactElement) {
  const { job } = page.props as PageProps
  const title = job?.title || '徵才'
  const description = getPlainText(job?.jobDescription)

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
      client.query<{ job: Job | null }>({
        query: jobById,
        variables: { id },
      }),
    ])

    const job = data?.job

    // Return 404 if job not found or not published/approved
    if (!job || job.state !== 'published' || !job.isApproved) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        headerData,
        job,
      },
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching data at Job Detail page'
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
        job: null,
      },
    }
  }
}

export default JobPage
