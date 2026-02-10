// 活動詳細頁面
import errors from '@twreporter/errors'
import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'
import styled from 'styled-components'

import { getGqlClient } from '~/apollo-client'
import LayoutGeneral from '~/components/layout/layout-general'
import { DEFAULT_POST_IMAGE_PATH } from '~/constants/constant'
import { MAX_CONTENT_WIDTH } from '~/constants/layout'
import { SHARE_URL } from '~/constants/social'
import type { HeaderContextData } from '~/contexts/header-context'
import type { Event } from '~/graphql/query/event'
import { eventById } from '~/graphql/query/event'
import type { NextPageWithLayout } from '~/pages/_app'
import BookmarkIcon from '~/public/icons/bookmark.svg'
import FacebookIcon from '~/public/icons/facebook.svg'
import LineIcon from '~/public/icons/line.svg'
import XIcon from '~/public/icons/x.svg'
import { setCacheControl } from '~/utils/common'
import { fetchHeaderData } from '~/utils/header-data'

const PageWrapper = styled.div`
  max-width: ${MAX_CONTENT_WIDTH};
  margin: 0 auto;
`

const HeroSection = styled.section`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  margin-bottom: 32px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 40px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: 48px;
  }
`

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ContentWrapper = styled.div`
  padding: 0 20px 60px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 0 48px 80px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 0 78px 100px;
  }
`

const EventHeader = styled.div`
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
  margin-bottom: 40px;
`

const CategoryLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary[0]};
  margin-bottom: 16px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
    margin-bottom: 20px;
  }
`

const EventTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  line-height: 1.4;
  color: #000;
  margin: 0 0 32px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 36px;
    margin: 0 0 40px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 36px;
    margin: 0 0 48px;
  }
`

const EventMetaGrid = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  text-align: center;

  ${({ theme }) => theme.breakpoint.md} {
    gap: 18px;
  }
`

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const MetaLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #000;
  white-space: pre-line;
  line-height: 1.5;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
  }
`

const MetaValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[20]};

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
  }
`

const MetaInlineGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const MetaInline = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #000;
  line-height: 1.5;
`

const ShareButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
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

const EventContent = styled.div`
  max-width: 760px;
  margin: 0 auto;
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

const RegisterButton = styled.a`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.secondary[20]};
  color: #fff;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 4px;
  text-decoration: none;
  text-align: center;
  margin-top: 40px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[0]};
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[20]};
  text-decoration: none;
  margin: 20px 20px 0;

  &:hover {
    text-decoration: underline;
  }

  &::before {
    content: '←';
    margin-right: 8px;
  }

  ${({ theme }) => theme.breakpoint.md} {
    margin: 20px 48px 0;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    margin: 20px 78px 0;
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
  event: Event | null
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

// Get hero image URL with fallback
const getHeroImageUrl = (event: Event): string => {
  return (
    event.heroImage?.resized?.w1200 ||
    event.heroImage?.resized?.w800 ||
    event.heroImage?.resized?.original ||
    DEFAULT_POST_IMAGE_PATH
  )
}

// Map event type to Chinese display name
const EVENT_TYPE_MAP: Record<string, string> = {
  physical: '實體活動',
  online: '線上活動',
  hybrid: '混合式活動',
}

const getEventTypeLabel = (eventType?: string): string => {
  if (!eventType) return ''
  return EVENT_TYPE_MAP[eventType] || eventType
}

const EventPage: NextPageWithLayout<PageProps> = ({ event }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const handleShareFacebook = () => {
    window.open(
      SHARE_URL.facebook(encodeURIComponent(window.location.href)),
      '_blank'
    )
  }

  const handleShareX = () => {
    window.open(SHARE_URL.x(encodeURIComponent(window.location.href)), '_blank')
  }

  const handleShareLine = () => {
    window.open(
      SHARE_URL.line(encodeURIComponent(window.location.href)),
      '_blank'
    )
  }

  if (!event) {
    return (
      <PageWrapper>
        <BackLink href="/event">返回活動列表</BackLink>
        <ContentWrapper>
          <ErrorMessage>找不到此活動</ErrorMessage>
        </ContentWrapper>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <HeroSection>
        <HeroImage src={getHeroImageUrl(event)} alt={event.name} />
      </HeroSection>

      <ContentWrapper>
        <EventHeader>
          {event.eventType && (
            <CategoryLabel>{getEventTypeLabel(event.eventType)}</CategoryLabel>
          )}
          <EventTitle>{event.name}</EventTitle>

          <EventMetaGrid>
            {event.startDate && (
              <MetaItem>
                <MetaLabel>活動日期</MetaLabel>
                <MetaValue>
                  {formatDateRange(event.startDate, event.endDate)}
                </MetaValue>
              </MetaItem>
            )}
            {event.organizer && (
              <MetaItem>
                <MetaLabel>主辦單位</MetaLabel>
                <MetaValue>{event.organizer}</MetaValue>
              </MetaItem>
            )}
            <MetaInlineGroup>
              {event.location && (
                <MetaInline>活動地點—{event.location}</MetaInline>
              )}
              {event.fee && <MetaInline>活動費用—{event.fee}</MetaInline>}
              {event.contactInfo && (
                <MetaInline>聯絡資訊—{event.contactInfo}</MetaInline>
              )}
            </MetaInlineGroup>
          </EventMetaGrid>
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
        </EventHeader>

        <EventContent>
          {event.content && (
            <ContentText dangerouslySetInnerHTML={{ __html: event.content }} />
          )}

          {event.registrationUrl && (
            <ButtonWrapper>
              <RegisterButton
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                前往活動
              </RegisterButton>
            </ButtonWrapper>
          )}
        </EventContent>
      </ContentWrapper>
    </PageWrapper>
  )
}

EventPage.getLayout = function getLayout(page: ReactElement) {
  const { event } = page.props as PageProps
  const title = event?.name || '活動'
  const heroImageUrl = event ? getHeroImageUrl(event) : undefined

  return (
    <LayoutGeneral
      title={title}
      description={event?.content?.replace(/<[^>]*>/g, '').slice(0, 150)}
      imageUrl={heroImageUrl}
    >
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
      client.query<{ event: Event | null }>({
        query: eventById,
        variables: { id },
      }),
    ])

    const event = data?.event

    // Return 404 if event not found or not published/approved
    if (!event || event.state !== 'published' || !event.isApproved) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        headerData,
        event,
      },
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching data at Event Detail page'
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
        event: null,
      },
    }
  }
}

export default EventPage
