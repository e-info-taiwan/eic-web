// 活動列表頁面
import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'
import { useState } from 'react'
import styled from 'styled-components'

import LayoutGeneral from '~/components/layout/layout-general'
import type { NextPageWithLayout } from '~/pages/_app'
import IconBack from '~/public/icons/arrow_back.svg'
import IconForward from '~/public/icons/arrow_forward.svg'
import { setCacheControl } from '~/utils/common'
import * as gtag from '~/utils/gtag'

const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[20]};
  min-height: 100vh;
  padding: 40px 20px 60px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 48px 98px 80px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 60px 0 100px;
  }
`

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 0 58px;
  }
`

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  gap: 12px;

  ${({ theme }) => theme.breakpoint.xl} {
    justify-content: flex-start;
  }
`

const AccentBar = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary[80]};
  width: 60px;
  height: 20px;
  margin-right: 0.75rem;
  border-bottom-right-radius: 12px;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    width: 80px;
    height: 32px;
  }
`

const Title = styled.h1`
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.secondary[80]};
  margin: 0;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 28px;
    line-height: 32px;
  }
`

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
`

const EventCard = styled.a`
  display: block;
  background: #fff;
  overflow: hidden;
  text-decoration: none;
  cursor: pointer;
`

const EventImage = styled.div<{ $image: string }>`
  width: 100%;
  aspect-ratio: 16 / 9;
  background-image: url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
`

const EventContent = styled.div`
  padding: 10px 20px;
`

const EventTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  margin: 0 0 12px 0;
  line-height: 32px;
`

const EventDate = styled.div`
  color: ${({ theme }) => theme.colors.primary[20]};
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
  margin: 0 0 12px 0;
`

const EventOrganizer = styled.div`
  color: ${({ theme }) => theme.colors.grayscale[0]};
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
`

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 13px;
  margin-top: 48px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 60px;
  }
`

const BackForwardButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;

  > svg {
    width: 25px;
    height: 25px;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  ${({ theme }) => theme.breakpoint.md} {
    width: 40px;
    height: 40px;

    > svg {
      width: 40px;
      height: 40px;
    }
  }
`

const PaginationButton = styled.button<{
  $isActive?: boolean
  $isDisabled?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 1px solid #000;
  border-color: ${({ $isActive, $isDisabled, theme }) =>
    $isDisabled
      ? theme.colors.grayscale[60]
      : $isActive
      ? theme.colors.grayscale[0]
      : theme.colors.secondary[20]};
  background: #fff;
  color: ${({ $isActive, $isDisabled, theme }) =>
    $isDisabled
      ? theme.colors.grayscale[60]
      : $isActive
      ? theme.colors.grayscale[0]
      : theme.colors.secondary[20]};
  font-size: 10px;
  font-weight: 500;
  line-height: 1.5;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  border-radius: 11px;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.secondary[20]};
    border-color: ${({ theme }) => theme.colors.secondary[20]};
    color: #fff;
  }

  ${({ theme }) => theme.breakpoint.md} {
    width: 36px;
    height: 36px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 18px;
  }

  &:disabled {
    opacity: 0.5;
  }
`

const PaginationEllipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  color: ${({ theme }) => theme.colors.secondary[20]};
  font-size: 14px;

  ${({ theme }) => theme.breakpoint.xl} {
    min-width: 48px;
    height: 48px;
    font-size: 16px;
  }
`

const FilterBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;

  ${({ theme }) => theme.breakpoint.md} {
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }
`

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${({ theme }) => theme.breakpoint.md} {
    justify-content: flex-start;
    gap: 12px;
  }
`

const FilterLabel = styled.label`
  font-size: 16px;
  line-heigth: 1.5;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  min-width: 70px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
    min-width: auto;
  }
`

const Select = styled.select`
  padding: 0 22px 0 8px;
  font-size: 16px;
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.grayscale[60]};
  border-radius: 0;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  min-width: 128px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[0]};
  }

  ${({ theme }) => theme.breakpoint.md} {
    padding: 0 22px 0 8px;
    font-size: 15px;
    min-width: 140px;
    background-size: 18px;
  }
`

const SubmitButton = styled.a`
  padding: 4px 10px;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
  color: #fff;
  background-color: ${({ theme }) => theme.colors.secondary[20]};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.2s ease;
  text-align: center;
  align-self: center;
  width: fit-content;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[0]};
  }

  ${({ theme }) => theme.breakpoint.md} {
    margin-left: auto;
    align-self: auto;
  }
`

type Event = {
  id: string
  title: string
  date: string
  organizer: string
  image: string
  href: string
}

// Dummy events data
const DUMMY_EVENTS: Event[] = [
  {
    id: '1',
    title: '【台灣蝴蝶保育學會】每周日免費賞蝶導覽',
    date: '2025-01-01-01:01',
    organizer: '單位名稱單位名稱單位名稱',
    image:
      'https://images.unsplash.com/photo-1534889156217-d643df14f14a?w=800&h=450&fit=crop',
    href: '/event/1',
  },
  {
    id: '2',
    title: '生態攝影工作坊：捕捉自然之美',
    date: '2025-01-15-14:00',
    organizer: '台灣自然攝影學會',
    image:
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=450&fit=crop',
    href: '/event/2',
  },
  {
    id: '3',
    title: '海洋保育講座：守護我們的藍色家園',
    date: '2025-01-20-10:00',
    organizer: '海洋保育協會',
    image:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=450&fit=crop',
    href: '/event/3',
  },
  {
    id: '4',
    title: '濕地生態觀察活動',
    date: '2025-01-25-09:00',
    organizer: '濕地保護聯盟',
    image:
      'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=800&h=450&fit=crop',
    href: '/event/4',
  },
  {
    id: '5',
    title: '親子自然體驗營：探索森林奧秘',
    date: '2025-02-01-08:30',
    organizer: '森林教育推廣協會',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop',
    href: '/event/5',
  },
  {
    id: '6',
    title: '候鳥觀察季：迎接冬季訪客',
    date: '2025-02-05-07:00',
    organizer: '台灣野鳥協會',
    image:
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=450&fit=crop',
    href: '/event/6',
  },
  {
    id: '7',
    title: '城市綠化工作坊',
    date: '2025-02-10-13:00',
    organizer: '都市園藝推廣中心',
    image:
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&h=450&fit=crop',
    href: '/event/7',
  },
  {
    id: '8',
    title: '淨灘行動：還給海洋一片純淨',
    date: '2025-02-15-08:00',
    organizer: '環保志工聯盟',
    image:
      'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&h=450&fit=crop',
    href: '/event/8',
  },
  {
    id: '9',
    title: '永續農業實踐分享會',
    date: '2025-02-20-14:30',
    organizer: '有機農業推廣協會',
    image:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=450&fit=crop',
    href: '/event/9',
  },
]

type PageProps = {
  events: Event[]
}

const EventsPage: NextPageWithLayout<PageProps> = ({ events }) => {
  // Filter state
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedDate, setSelectedDate] = useState('all')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9 // 9 events per page (3x3 grid)
  const totalPages = Math.ceil(events.length / itemsPerPage)

  // Format date to yyyy年mm月dd日
  const formatDate = (dateString: string) => {
    // Handle format: 2025-00-00-00:00 or 2025-01-15-14:00
    const parts = dateString.split('-')
    if (parts.length >= 3) {
      const year = parts[0]
      const month = parts[1]
      const day = parts[2].split('-')[0] // Remove time part if exists
      return `${year}年${month}月${day}日`
    }
    return dateString
  }

  // Calculate current events to display
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentEvents = events.slice(startIndex, endIndex)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    gtag.sendEvent('events', 'click', `pagination-page-${page}`)
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showEllipsisThreshold = 7

    if (totalPages <= showEllipsisThreshold) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('ellipsis-start')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis-end')
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <PageWrapper>
      <ContentWrapper>
        <SectionTitle>
          <AccentBar />
          <Title>活動</Title>
        </SectionTitle>

        <FilterBar>
          <FilterGroup>
            <FilterLabel htmlFor="location-filter">活動地點</FilterLabel>
            <Select
              id="location-filter"
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value)
                setCurrentPage(1)
                gtag.sendEvent('events', 'filter', `location-${e.target.value}`)
              }}
            >
              <option value="all">全部</option>
              <option value="taipei">台北市</option>
              <option value="new-taipei">新北市</option>
              <option value="taoyuan">桃園市</option>
              <option value="taichung">台中市</option>
              <option value="tainan">台南市</option>
              <option value="kaohsiung">高雄市</option>
              <option value="other">其他縣市</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel htmlFor="date-filter">日期</FilterLabel>
            <Select
              id="date-filter"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                setCurrentPage(1)
                gtag.sendEvent('events', 'filter', `date-${e.target.value}`)
              }}
            >
              <option value="all">全部</option>
              <option value="2025-01">2025-01</option>
              <option value="2025-02">2025-02</option>
              <option value="2025-03">2025-03</option>
              <option value="2025-04">2025-04</option>
              <option value="2025-05">2025-05</option>
              <option value="2025-06">2025-06</option>
            </Select>
          </FilterGroup>

          <SubmitButton
            href="https://forms.gle/your-form-id"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => gtag.sendEvent('events', 'click', 'submit-event')}
          >
            我要刊登
          </SubmitButton>
        </FilterBar>

        <EventGrid>
          {currentEvents.map((event) => (
            <Link key={event.id} href={event.href} passHref legacyBehavior>
              <EventCard
                onClick={() => gtag.sendEvent('events', 'click', event.title)}
              >
                <EventImage $image={event.image} />
                <EventContent>
                  <EventDate>{formatDate(event.date)}</EventDate>
                  <EventTitle>{event.title}</EventTitle>
                  <EventOrganizer>{event.organizer}</EventOrganizer>
                </EventContent>
              </EventCard>
            </Link>
          ))}
        </EventGrid>

        {/* Pagination */}
        {totalPages > 1 && (
          <PaginationWrapper>
            <BackForwardButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <IconBack />
            </BackForwardButton>

            {getPageNumbers().map((page, index) => {
              if (typeof page === 'string') {
                return (
                  <PaginationEllipsis key={`ellipsis-${index}`}>
                    ......
                  </PaginationEllipsis>
                )
              }

              return (
                <PaginationButton
                  key={page}
                  $isActive={currentPage === page}
                  onClick={() => handlePageChange(page)}
                >
                  {String(page).padStart(2, '0')}
                </PaginationButton>
              )
            })}

            <BackForwardButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <IconForward />
            </BackForwardButton>
          </PaginationWrapper>
        )}
      </ContentWrapper>
    </PageWrapper>
  )
}

EventsPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGeneral>{page}</LayoutGeneral>
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  setCacheControl(res)

  return {
    props: {
      events: DUMMY_EVENTS,
    },
  }
}

export default EventsPage
