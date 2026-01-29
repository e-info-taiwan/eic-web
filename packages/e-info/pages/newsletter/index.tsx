import errors from '@twreporter/errors'
import type { GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useState } from 'react'
import styled from 'styled-components'

import { getGqlClient } from '~/apollo-client'
import LayoutGeneral from '~/components/layout/layout-general'
import { DEFAULT_POST_IMAGE_PATH } from '~/constants/constant'
import type { HeaderContextData } from '~/contexts/header-context'
import type { Newsletter } from '~/graphql/query/newsletter'
import {
  newslettersByMonth,
  newsletterYearRange,
} from '~/graphql/query/newsletter'
import type { NextPageWithLayout } from '~/pages/_app'
import { setCacheControl } from '~/utils/common'
import { fetchHeaderData } from '~/utils/header-data'

const PageWrapper = styled.div`
  background-color: #ffffff;
  min-height: 100vh;
`

// Hero Section - maintains 1200:420 (20:7) aspect ratio like section page
const HeroSection = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  aspect-ratio: 1200 / 420;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const HeroImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2d7a4f 0%, #1a4d31 100%);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.4) 100%
    );
  }
`

const HeroTitleWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
`

const HeroAccentBar = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[80]};
  width: 20px;
  height: 32px;
  margin-right: 0.75rem;
  border-bottom-right-radius: 12px;
`

const HeroTitle = styled.h1`
  font-size: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary[80]};
  margin: 0;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 32px;
  }
`

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 60px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 28px 20px 100px;
  }
`

const NavigationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;

  ${({ theme }) => theme.breakpoint.md} {
    gap: 28px;
    margin-bottom: 40px;
  }
`

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.grayscale[40]};
  box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.05) inset;
  box-sizing: border-box;
  cursor: pointer;
  color: #fff;
  transition: opacity 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.7;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const MonthDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const YearSelect = styled.select`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  color: #fff;
  background-color: ${({ theme }) => theme.colors.primary[20]};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 6px 10px;

  &:focus {
    outline: none;
  }
`

const MonthText = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  background-color: ${({ theme }) => theme.colors.grayscale[99]};
  padding: 6px 10px;
  border-radius: 4px;
  box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.05) inset;
`

// Desktop calendar grid (hidden on mobile/tablet)
const DesktopCalendarGrid = styled.div`
  display: none;
  margin-bottom: 40px;

  ${({ theme }) => theme.breakpoint.xl} {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
  }
`

// Mobile/Tablet grid (hidden on desktop)
const MobileTabletGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 40px;

  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const WeekdayHeader = styled.div`
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  color: #000;
  padding: 12px 0;
`

const CalendarCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
`

const NewsletterCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  width: 100%;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`

const ThumbnailWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 12px;
  }
`

const CardDate = styled.span`
  font-size: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary[20]};
  margin-bottom: 4px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 12px;
    margin-bottom: 6px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 14px;
  }
`

const CardTitle = styled.span`
  font-size: 10px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  word-break: break-word;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 12px;
    -webkit-line-clamp: 5;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 13px;
  }
`

const HistoricalSection = styled.div`
  padding-top: 32px;
  text-align: center;

  &:first-of-type {
    border-top: 1px solid ${({ theme }) => theme.colors.grayscale[95]};
  }
`

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  margin: 0 0 16px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 20px;
    margin-bottom: 24px;
  }
`

const YearLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 8px;
`

const YearLink = styled.a`
  display: inline-block;
  padding: 2px 12px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[60]};
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.colors.primary[60]};
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.grayscale[40]};
    border-color: ${({ theme }) => theme.colors.grayscale[40]};
  }
`

const EmptyMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.grayscale[60]};
  font-size: 16px;
`

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
const HISTORICAL_YEARS = [
  2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012,
  2013, 2014, 2015, 2016,
]

type NewsletterMap = {
  [date: string]: Newsletter
}

// Format date as YYYY/MM/DD
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

type PageProps = {
  headerData: HeaderContextData
  initialYear: number
  initialMonth: number
  newsletters: Newsletter[]
  yearRange: { minYear: number; maxYear: number }
}

const NewsletterOverviewPage: NextPageWithLayout<PageProps> = ({
  initialYear,
  initialMonth,
  newsletters: initialNewsletters,
  yearRange,
}) => {
  const router = useRouter()
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const [newsletters, setNewsletters] =
    useState<Newsletter[]>(initialNewsletters)
  const [loading, setLoading] = useState(false)

  // Create a map of newsletters by date
  const newsletterMap: NewsletterMap = {}
  newsletters.forEach((newsletter) => {
    const date = new Date(newsletter.sendDate)
    const dateKey = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`
    newsletterMap[dateKey] = newsletter
  })

  // Get the first day of the month and number of days
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()

  // Generate calendar cells with newsletter mapped to correct day of week
  const calendarCells: { newsletter?: Newsletter }[] = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push({})
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${month}-${day}`
    calendarCells.push({
      newsletter: newsletterMap[dateKey],
    })
  }

  // Fetch newsletters for a specific month and update URL
  const fetchNewsletters = async (targetYear: number, targetMonth: number) => {
    setLoading(true)

    // Update URL with query parameters (shallow to avoid SSR refetch)
    router.replace(
      {
        pathname: '/newsletter',
        query: { year: targetYear, month: targetMonth },
      },
      undefined,
      { shallow: true }
    )

    try {
      const client = getGqlClient()
      const startDate = new Date(targetYear, targetMonth - 1, 1).toISOString()
      const endDate = new Date(
        targetYear,
        targetMonth,
        0,
        23,
        59,
        59
      ).toISOString()

      const { data } = await client.query<{ newsletters: Newsletter[] }>({
        query: newslettersByMonth,
        variables: { startDate, endDate },
      })

      setNewsletters(data?.newsletters ?? [])
    } catch (err) {
      console.error('Error fetching newsletters:', err)
    } finally {
      setLoading(false)
    }
  }

  // Navigate to previous month
  const goToPrevMonth = () => {
    let newYear = year
    let newMonth = month - 1

    if (newMonth < 1) {
      newMonth = 12
      newYear = year - 1
    }

    // Minimum year is 2000
    if (newYear >= 2000) {
      setYear(newYear)
      setMonth(newMonth)
      fetchNewsletters(newYear, newMonth)
    }
  }

  // Navigate to next month
  const goToNextMonth = () => {
    let newYear = year
    let newMonth = month + 1

    if (newMonth > 12) {
      newMonth = 1
      newYear = year + 1
    }

    if (newYear <= yearRange.maxYear) {
      setYear(newYear)
      setMonth(newMonth)
      fetchNewsletters(newYear, newMonth)
    }
  }

  // Handle year change
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10)
    setYear(newYear)
    fetchNewsletters(newYear, month)
  }

  // Generate year options (minimum year is 2000)
  const minYear = Math.max(yearRange.minYear, 2000)
  const yearOptions = []
  for (let y = yearRange.maxYear; y >= minYear; y--) {
    yearOptions.push(y)
  }

  // Check if we can navigate
  const canGoPrev = year > minYear || (year === minYear && month > 1)
  const canGoNext =
    year < yearRange.maxYear || (year === yearRange.maxYear && month < 12)

  return (
    <PageWrapper>
      <HeroSection>
        <HeroImageWrapper>
          <Image
            src="/newsletter-hero.png"
            alt="環境資訊電子報"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </HeroImageWrapper>
        <HeroTitleWrapper>
          <HeroAccentBar />
          <HeroTitle>環境資訊電子報</HeroTitle>
        </HeroTitleWrapper>
      </HeroSection>

      <ContentWrapper>
        <NavigationWrapper>
          <NavButton onClick={goToPrevMonth} disabled={!canGoPrev || loading}>
            上一個月
          </NavButton>

          <MonthDisplay>
            <YearSelect
              value={year}
              onChange={handleYearChange}
              disabled={loading}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </YearSelect>
            <MonthText>
              {year}-{String(month).padStart(2, '0')}
            </MonthText>
          </MonthDisplay>

          <NavButton onClick={goToNextMonth} disabled={!canGoNext || loading}>
            下一個月
          </NavButton>
        </NavigationWrapper>

        {/* Desktop: Calendar grid with weekday headers */}
        <DesktopCalendarGrid>
          {WEEKDAYS.map((day) => (
            <WeekdayHeader key={day}>週{day}</WeekdayHeader>
          ))}

          {calendarCells.map((cell, index) => (
            <CalendarCell key={index}>
              {cell.newsletter && (
                <NewsletterCard href={`/newsletter/${cell.newsletter.id}`}>
                  <ThumbnailWrapper>
                    <Image
                      src={
                        cell.newsletter.heroImage?.resized?.w480 ||
                        cell.newsletter.heroImage?.resized?.original ||
                        DEFAULT_POST_IMAGE_PATH
                      }
                      alt={cell.newsletter.title || '電子報'}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </ThumbnailWrapper>
                  <CardDate>{formatDate(cell.newsletter.sendDate)}</CardDate>
                  <CardTitle>{cell.newsletter.title}</CardTitle>
                </NewsletterCard>
              )}
            </CalendarCell>
          ))}
        </DesktopCalendarGrid>

        {/* Mobile/Tablet: Simple grid without empty cells */}
        <MobileTabletGrid>
          {newsletters.map((newsletter) => (
            <NewsletterCard
              key={newsletter.id}
              href={`/newsletter/${newsletter.id}`}
            >
              <ThumbnailWrapper>
                <Image
                  src={
                    newsletter.heroImage?.resized?.w480 ||
                    newsletter.heroImage?.resized?.original ||
                    DEFAULT_POST_IMAGE_PATH
                  }
                  alt={newsletter.title || '電子報'}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </ThumbnailWrapper>
              <CardDate>{formatDate(newsletter.sendDate)}</CardDate>
              <CardTitle>{newsletter.title}</CardTitle>
            </NewsletterCard>
          ))}
        </MobileTabletGrid>

        {newsletters.length === 0 && !loading && (
          <EmptyMessage>本月份暫無電子報</EmptyMessage>
        )}

        <HistoricalSection>
          <SectionTitle>系列電子報回顧</SectionTitle>
          <YearLinks>
            {HISTORICAL_YEARS.map((y) => {
              // 2000 年是創始年，從 4 月開始；其他年份從 1 月開始
              const startMonth = y === 2000 ? 4 : 1
              return (
                <YearLink
                  key={y}
                  href={`/newsletter?year=${y}&month=${startMonth}`}
                  onClick={(e) => {
                    e.preventDefault()
                    setYear(y)
                    setMonth(startMonth)
                    fetchNewsletters(y, startMonth)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  {y}
                </YearLink>
              )
            })}
          </YearLinks>
        </HistoricalSection>

        <HistoricalSection>
          <SectionTitle>系列電子報回顧（已停刊）</SectionTitle>
          <YearLinks>
            <YearLink href="#" onClick={(e) => e.preventDefault()}>
              《自然主義》月刊
            </YearLink>
          </YearLinks>
        </HistoricalSection>
      </ContentWrapper>
    </PageWrapper>
  )
}

NewsletterOverviewPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutGeneral title="電子報總覽" description="環境資訊中心電子報總覽">
      {page}
    </LayoutGeneral>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  res,
  query,
}) => {
  setCacheControl(res)

  const client = getGqlClient()

  // Get current date or from query params
  const now = new Date()
  const initialYear = query.year
    ? parseInt(query.year as string, 10)
    : now.getFullYear()
  const initialMonth = query.month
    ? parseInt(query.month as string, 10)
    : now.getMonth() + 1

  try {
    // Get header data and year range in parallel
    const [headerData, { data: rangeData }] = await Promise.all([
      fetchHeaderData(),
      client.query<{
        oldest: { sendDate: string }[]
        newest: { sendDate: string }[]
      }>({
        query: newsletterYearRange,
      }),
    ])

    const minYear = rangeData?.oldest?.[0]
      ? new Date(rangeData.oldest[0].sendDate).getFullYear()
      : now.getFullYear()
    const maxYear = rangeData?.newest?.[0]
      ? new Date(rangeData.newest[0].sendDate).getFullYear()
      : now.getFullYear()

    // Get newsletters for the current month
    const startDate = new Date(initialYear, initialMonth - 1, 1).toISOString()
    const endDate = new Date(
      initialYear,
      initialMonth,
      0,
      23,
      59,
      59
    ).toISOString()

    const { data: newslettersData } = await client.query<{
      newsletters: Newsletter[]
    }>({
      query: newslettersByMonth,
      variables: { startDate, endDate },
    })

    return {
      props: {
        headerData,
        initialYear,
        initialMonth,
        newsletters: newslettersData?.newsletters ?? [],
        yearRange: { minYear, maxYear },
      },
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching data at Newsletter Overview page'
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

    // Return empty state on error
    return {
      props: {
        headerData: {
          sections: [],
          featuredTags: [],
          topics: [],
          newsBarPicks: [],
          siteConfigs: [],
        },
        initialYear,
        initialMonth,
        newsletters: [],
        yearRange: { minYear: now.getFullYear(), maxYear: now.getFullYear() },
      },
    }
  }
}

export default NewsletterOverviewPage
