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

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 48px;
  }
`

const AccentBar = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[0]};
  width: 60px;
  height: 20px;
  margin-right: 12px;
  border-bottom-right-radius: 12px;

  ${({ theme }) => theme.breakpoint.xl} {
    width: 80px;
    height: 24px;
    border-bottom-right-radius: 16px;
  }
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[0]};
  margin: 0;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 32px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 36px;
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
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
`

const EventCard = styled.a`
  display: block;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`

const EventImage = styled.div<{ $image: string }>`
  width: 100%;
  aspect-ratio: 16 / 9;
  background-image: url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
`

const EventContent = styled.div`
  padding: 20px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 24px;
  }
`

const EventTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin: 0 0 12px 0;
  line-height: 1.5;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 20px;
  }
`

const EventMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #666;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 15px;
  }
`

const EventDate = styled.div`
  color: ${({ theme }) => theme.colors.primary[0]};
  font-weight: 500;
`

const EventOrganizer = styled.div`
  color: #666;
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
    date: '2025-00-00-00:00',
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
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9 // 9 events per page (3x3 grid)
  const totalPages = Math.ceil(events.length / itemsPerPage)

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
        <Header>
          <AccentBar />
          <Title>活動列表</Title>
        </Header>

        <EventGrid>
          {currentEvents.map((event) => (
            <Link key={event.id} href={event.href} passHref legacyBehavior>
              <EventCard
                onClick={() => gtag.sendEvent('events', 'click', event.title)}
              >
                <EventImage $image={event.image} />
                <EventContent>
                  <EventTitle>{event.title}</EventTitle>
                  <EventMeta>
                    <EventDate>{event.date}</EventDate>
                    <EventOrganizer>{event.organizer}</EventOrganizer>
                  </EventMeta>
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
