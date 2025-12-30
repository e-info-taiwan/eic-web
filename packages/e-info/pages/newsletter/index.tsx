import errors from '@twreporter/errors'
import type { GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactElement } from 'react'
import { useState } from 'react'
import styled from 'styled-components'

import { getGqlClient } from '~/apollo-client'
import LayoutGeneral from '~/components/layout/layout-general'
import { DEFAULT_POST_IMAGE_PATH } from '~/constants/constant'
import type { Newsletter } from '~/graphql/query/newsletter'
import {
  newslettersByMonth,
  newsletterYearRange,
} from '~/graphql/query/newsletter'
import type { NextPageWithLayout } from '~/pages/_app'
import IconBack from '~/public/icons/arrow_back.svg'
import IconForward from '~/public/icons/arrow_forward.svg'
import { setCacheControl } from '~/utils/common'

const PageWrapper = styled.div`
  background-color: #ffffff;
  min-height: 100vh;
`

const HeroBanner = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #2d7a4f 0%, #1a4d31 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.breakpoint.md} {
    height: 280px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    height: 320px;
  }
`

const HeroTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  text-align: center;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 36px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 48px;
  }
`

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 60px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 40px 40px 80px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 60px 20px 100px;
  }
`

const NavigationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;

  ${({ theme }) => theme.breakpoint.md} {
    gap: 24px;
    margin-bottom: 40px;
  }
`

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary[40]};
  transition: opacity 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.7;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 24px;
    height: 24px;
  }

  ${({ theme }) => theme.breakpoint.md} {
    width: 40px;
    height: 40px;

    svg {
      width: 28px;
      height: 28px;
    }
  }
`

const MonthDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const YearSelect = styled.select`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 8px;

  &:focus {
    outline: none;
  }

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 24px;
  }
`

const MonthText = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.grayscale[20]};

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 24px;
  }
`

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 40px;

  ${({ theme }) => theme.breakpoint.md} {
    gap: 8px;
  }
`

const WeekdayHeader = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.grayscale[60]};
  padding: 8px 0;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 14px;
    padding: 12px 0;
  }
`

const CalendarCell = styled.div<{ $isEmpty?: boolean }>`
  aspect-ratio: 1;
  background: ${({ $isEmpty, theme }) =>
    $isEmpty ? 'transparent' : theme.colors.grayscale[99]};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 4px;
  min-height: 80px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 8px;
    min-height: 120px;
    border-radius: 8px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    min-height: 140px;
  }
`

const DateNumber = styled.span`
  font-size: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.grayscale[60]};
  margin-bottom: 4px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 12px;
    margin-bottom: 8px;
  }
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
  aspect-ratio: 16/9;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 4px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 8px;
  }
`

const CardTitle = styled.span`
  font-size: 8px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 11px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 12px;
  }
`

const HistoricalSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.grayscale[95]};
  padding-top: 32px;
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
  gap: 12px 24px;
`

const YearLink = styled.a`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.primary[40]};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const EmptyMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.grayscale[60]};
  font-size: 16px;
`

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
const MONTHS = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
]

type NewsletterMap = {
  [date: string]: Newsletter
}

type PageProps = {
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

  // Generate calendar cells
  const calendarCells = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push({ day: 0, isEmpty: true })
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${month}-${day}`
    calendarCells.push({
      day,
      isEmpty: false,
      newsletter: newsletterMap[dateKey],
    })
  }

  // Fetch newsletters for a specific month
  const fetchNewsletters = async (targetYear: number, targetMonth: number) => {
    setLoading(true)
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

      setNewsletters(data.newsletters)
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

    if (newYear >= yearRange.minYear) {
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

  // Generate year options
  const yearOptions = []
  for (let y = yearRange.maxYear; y >= yearRange.minYear; y--) {
    yearOptions.push(y)
  }

  // Check if we can navigate
  const canGoPrev =
    year > yearRange.minYear || (year === yearRange.minYear && month > 1)
  const canGoNext =
    year < yearRange.maxYear || (year === yearRange.maxYear && month < 12)

  return (
    <PageWrapper>
      <HeroBanner>
        <HeroTitle>電子報總覽</HeroTitle>
      </HeroBanner>

      <ContentWrapper>
        <NavigationWrapper>
          <NavButton onClick={goToPrevMonth} disabled={!canGoPrev || loading}>
            <IconBack />
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
            <MonthText>{MONTHS[month - 1]}</MonthText>
          </MonthDisplay>

          <NavButton onClick={goToNextMonth} disabled={!canGoNext || loading}>
            <IconForward />
          </NavButton>
        </NavigationWrapper>

        <CalendarGrid>
          {WEEKDAYS.map((day) => (
            <WeekdayHeader key={day}>{day}</WeekdayHeader>
          ))}

          {calendarCells.map((cell, index) => (
            <CalendarCell key={index} $isEmpty={cell.isEmpty}>
              {!cell.isEmpty && (
                <>
                  <DateNumber>{cell.day}</DateNumber>
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
                      <CardTitle>{cell.newsletter.title}</CardTitle>
                    </NewsletterCard>
                  )}
                </>
              )}
            </CalendarCell>
          ))}
        </CalendarGrid>

        {newsletters.length === 0 && !loading && (
          <EmptyMessage>本月份暫無電子報</EmptyMessage>
        )}

        <HistoricalSection>
          <SectionTitle>歷年電子報</SectionTitle>
          <YearLinks>
            {yearOptions.map((y) => (
              <YearLink
                key={y}
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setYear(y)
                  setMonth(1)
                  fetchNewsletters(y, 1)
                }}
              >
                {y}年
              </YearLink>
            ))}
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
    // Get year range
    const { data: rangeData } = await client.query<{
      oldest: { sendDate: string }[]
      newest: { sendDate: string }[]
    }>({
      query: newsletterYearRange,
    })

    const minYear = rangeData.oldest[0]
      ? new Date(rangeData.oldest[0].sendDate).getFullYear()
      : now.getFullYear()
    const maxYear = rangeData.newest[0]
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
        initialYear,
        initialMonth,
        newsletters: newslettersData.newsletters,
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
        initialYear,
        initialMonth,
        newsletters: [],
        yearRange: { minYear: now.getFullYear(), maxYear: now.getFullYear() },
      },
    }
  }
}

export default NewsletterOverviewPage
