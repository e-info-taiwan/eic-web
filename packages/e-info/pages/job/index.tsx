// 徵才列表頁面
import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'
import { useState } from 'react'
import styled from 'styled-components'

import LayoutGeneral from '~/components/layout/layout-general'
import type { HeaderContextData } from '~/contexts/header-context'
import type { NextPageWithLayout } from '~/pages/_app'
import IconBack from '~/public/icons/arrow_back.svg'
import IconForward from '~/public/icons/arrow_forward.svg'
import { setCacheControl } from '~/utils/common'
import * as gtag from '~/utils/gtag'
import { fetchHeaderData } from '~/utils/header-data'

const PageWrapper = styled.div`
  background-color: #ffffff;
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  gap: 20px;

  ${({ theme }) => theme.breakpoint.md} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const AccentBar = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[20]};
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
  color: ${({ theme }) => theme.colors.primary[20]};
  margin: 0;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 28px;
    line-height: 32px;
  }
`

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;

  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: repeat(2, 1fr);
    gap: 36px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    grid-template-columns: repeat(3, 1fr);
    gap: 36px;
  }
`

const JobCard = styled.a`
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.grayscale[80]};
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  cursor: pointer;
`

const JobContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
`

const JobDate = styled.div`
  color: ${({ theme }) => theme.colors.primary[20]};
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
  margin-bottom: 12px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
`

const JobTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  margin: 0 0 12px 0;
  line-height: 1.4;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 22px;
  }
`

const JobCompany = styled.div`
  color: ${({ theme }) => theme.colors.primary[20]};
  font-size: 14px;
  line-height: 1.5;
  font-weight: 400;
  margin: 0 0 16px 0;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
`

const JobDescription = styled.div`
  color: ${({ theme }) => theme.colors.grayscale[40]};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  margin-bottom: 20px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 15px;
  }
`

const ViewMoreButton = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[0]};
  color: #fff;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
  padding: 6px 40px;
  border-radius: 4px;
  text-align: center;
  transition: background-color 0.2s ease;
  align-self: center;

  ${JobCard}:hover & {
    background-color: ${({ theme }) => theme.colors.primary[20]};
  }

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
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

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[0]};
  }
`

type Job = {
  id: string
  title: string
  company: string
  location: string
  date: string
  description: string
  href: string
}

// Dummy jobs data
const DUMMY_JOBS: Job[] = [
  {
    id: '1',
    title: '【自然環資】專案執行（環境教育）',
    company: '社團法人中華民國自然生態保育協會',
    location: '台北市',
    date: '2025年06月02日',
    description:
      '約100字左右。1.課教活動執行：活動籌辦、內外部合作單位溝通、專案發材與與整理、活動現場支援，環境教育推廣、影像紀錄、社群媒體貼文編撰、結案資料整理等。2.專案事務協助：企業合作接洽、提案簡報製…',
    href: '/job/1',
  },
  {
    id: '2',
    title: '生態保育研究員',
    company: '台灣野鳥協會',
    location: '台北市',
    date: '2025年05月20日',
    description:
      '負責野鳥生態調查與研究工作，進行野外觀察記錄、數據分析與報告撰寫。需具備鳥類辨識能力與野外調查經驗，熟悉生態研究方法與統計分析。協助規劃保育計畫，參與環境教育推廣活動。',
    href: '/job/2',
  },
  {
    id: '3',
    title: '海洋保育專員',
    company: '海洋保育協會',
    location: '高雄市',
    date: '2025年05月15日',
    description:
      '執行海洋保育相關專案，包括海洋生態調查、淨灘活動規劃、海洋教育推廣等。協調各界合作夥伴，推動海洋保育政策倡議。需具備潛水證照與海洋生態知識，有專案管理經驗者佳。',
    href: '/job/3',
  },
  {
    id: '4',
    title: '永續發展顧問',
    company: '綠色企業顧問公司',
    location: '台北市',
    date: '2025年05月10日',
    description:
      '協助企業建立永續發展策略，進行碳盤查、ESG報告書撰寫、永續供應鏈管理等。需具備永續相關證照（如ISO 14064、GRI等），熟悉國際永續標準與趨勢。優秀的簡報與溝通能力。',
    href: '/job/4',
  },
  {
    id: '5',
    title: '環境教育講師',
    company: '森林教育推廣協會',
    location: '台中市',
    date: '2025年05月05日',
    description:
      '設計並執行環境教育課程，帶領學校與社區進行自然體驗活動。開發教材教具，培訓環境教育志工。需具備環境教育人員認證，有教學經驗與活動帶領能力，喜愛與大自然互動。',
    href: '/job/5',
  },
  {
    id: '6',
    title: '氣候變遷分析師',
    company: '環境科學研究中心',
    location: '新竹市',
    date: '2025年04月28日',
    description:
      '進行氣候變遷相關研究與數據分析，撰寫研究報告與政策建議。需具備環境科學、大氣科學或相關領域碩士學位，熟悉氣候模式與統計軟體。優秀的英文閱讀與寫作能力。',
    href: '/job/6',
  },
  {
    id: '7',
    title: '綠建築規劃師',
    company: '永續建築設計事務所',
    location: '台北市',
    date: '2025年04月20日',
    description:
      '負責綠建築規劃設計，協助取得綠建築標章（如LEED、EEWH等）。進行建築能源效率分析，提供永續設計建議。需具備建築相關背景，熟悉綠建築評估系統與節能技術。',
    href: '/job/7',
  },
  {
    id: '8',
    title: '環保政策研究員',
    company: '環境政策研究所',
    location: '台北市',
    date: '2025年04月15日',
    description:
      '研究分析國內外環保政策，撰寫政策評析報告。參與政策倡議活動，與政府部門及民間團體溝通協調。需具備公共政策、環境科學相關背景，優秀的研究與寫作能力。',
    href: '/job/8',
  },
  {
    id: '9',
    title: '有機農業推廣員',
    company: '有機農業推廣協會',
    location: '台南市',
    date: '2025年04月10日',
    description:
      '推廣有機農業理念與技術，輔導農民轉型有機耕作。規劃農業體驗活動，建立農產品銷售通路。需具備農業相關背景，熟悉有機農業規範與實務，良好的溝通協調能力。',
    href: '/job/9',
  },
]

type PageProps = {
  headerData: HeaderContextData
  jobs: Job[]
}

const JobsPage: NextPageWithLayout<PageProps> = ({ jobs }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9 // 9 jobs per page (3x3 grid)
  const totalPages = Math.ceil(jobs.length / itemsPerPage)

  // Calculate current jobs to display
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentJobs = jobs.slice(startIndex, endIndex)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    gtag.sendEvent('jobs', 'click', `pagination-page-${page}`)
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
          <TitleGroup>
            <AccentBar />
            <Title>徵才</Title>
          </TitleGroup>
          <SubmitButton
            href="https://forms.gle/your-form-id"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => gtag.sendEvent('jobs', 'click', 'submit-job')}
          >
            我要刊登
          </SubmitButton>
        </SectionTitle>

        <JobGrid>
          {currentJobs.map((job) => (
            <Link key={job.id} href={job.href} passHref legacyBehavior>
              <JobCard
                onClick={() => gtag.sendEvent('jobs', 'click', job.title)}
              >
                <JobContent>
                  <JobDate>{job.date}</JobDate>
                  <JobTitle>{job.title}</JobTitle>
                  <JobCompany>{job.company}</JobCompany>
                  <JobDescription>{job.description}</JobDescription>
                  <ViewMoreButton>查看更多</ViewMoreButton>
                </JobContent>
              </JobCard>
            </Link>
          ))}
        </JobGrid>

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

JobsPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGeneral>{page}</LayoutGeneral>
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  res,
}) => {
  setCacheControl(res)

  const headerData = await fetchHeaderData()

  return {
    props: {
      headerData,
      jobs: DUMMY_JOBS,
    },
  }
}

export default JobsPage
