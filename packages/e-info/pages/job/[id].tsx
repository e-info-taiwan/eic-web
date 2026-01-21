// 徵才詳細頁面
import type { GetServerSideProps } from 'next'
import type { ReactElement } from 'react'
import styled from 'styled-components'

import LayoutGeneral from '~/components/layout/layout-general'
import type { HeaderContextData } from '~/contexts/header-context'
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
  gap: 0px;
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

const ContentText = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: #000;
  white-space: pre-wrap;

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
`

type JobData = {
  id: string
  title: string
  date: string
  company: string
  location: string
  salary: string
  phone: string
  description: string
}

// Dummy job data
const DUMMY_JOB: JobData = {
  id: '1',
  title: '【自然環資】專案執行（環境教育）',
  date: '時間—0000-00-00 至0000-00-00',
  company: '報導單位—單位揭開',
  location: '工作地點—台北',
  salary: '薪資—99999999',
  phone: '',
  description: `【職務介紹】
教育，為大自然發聲、行動，讓大自然發生。

自2004年，本會將「生態工作假期」作為體驗型態保育，帶領志工實際走入清林、海洋、濕地，為自己章下根與土地連結的故事。經過數回合後論壇線上對談，我們決定透過推廣此行動，生態體驗、環教體驗、市場推廣等多元的方式，重新建立人．生物與環境間的新連結。

• TNF 2024年報
• 生態工作假期TNF專頁

【職務內容】
1. 環教活動執行：活動籌辦、內外部合作單位溝通、專案發材與與整理、活動現場支援，環境教育推廣、影像紀錄、社群媒體貼文編撰、結案資料整理等。
2. 專案事務協助：企業合作接洽、提案簡報製作、資料檔視製作、資料彙整統計、機子廠部串聯支工關係通經理等。
3. 行政庶務處理：CRM系統操作（報名、收費）、請款、核銷、環教/志工時數管理、機情資料彙整等。

【需求與條件】
1. 二年以上工作經驗。
2. 具汽、機車駕照，且能實際上路駕駛（必備條件）。
3. 具醫影、文書產體能力。
4. 熟悉文書處理軟體及雲端軟體功式。
5. 能接受假日體休、不定時出差。
6. 體能好，喜愛戶外活動、樂光與野手動、植物。
7. 因工作性質與空間受限，此職務薪酬自備筆記型電腦（本會有租用補助辦）。

【加分條件】
• 有志於拳擊組織工作，關注環境議題並具有領導能力。
• 具環境教育人員認證（環境供應專/職般）或環境教育背景。
• 開心自然、生態，具環境保護生物知能。
• 基礎與專業相關之能力試證（須與相關議證）。
• 認來自然環境與專業發商生活，喜愛發證性地紋。
• 正向積極、樂於溝通、不良態面對人群、嚴謹目標、承擔責任。

【待遇】
• 薪資：月薪34,000元以上
• 工作時間：週間一到五，9:00-18:00（含午休1小時），會需依專送基本延後或假日固執整理
• 遠端工作：部分補追，每周至少需進辦公室2次
• 過應紀錄可議（提供紀錄前出時受審讀）
• 志工行動組提讀
• 環境教育組經讀`,
}

type PageProps = {
  headerData: HeaderContextData
  job: JobData
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

  return (
    <PageWrapper>
      <ContentWrapper>
        <JobHeader>
          <CategoryLabel>環境徵才</CategoryLabel>
          <DateInfo>{job.date}</DateInfo>
          <JobTitle>{job.title}</JobTitle>

          <JobMetaGrid>
            <MetaItem>
              <MetaLabel>{job.company}</MetaLabel>
            </MetaItem>
            <MetaItem>
              <MetaLabel>{job.location}</MetaLabel>
            </MetaItem>
            <MetaItem>
              <MetaLabel>{job.salary}</MetaLabel>
            </MetaItem>
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
          <ContentText>{job.description}</ContentText>
        </JobContent>
      </ContentWrapper>
    </PageWrapper>
  )
}

JobPage.getLayout = function getLayout(page: ReactElement) {
  const { props } = page
  const { job } = props

  return (
    <LayoutGeneral
      title={job.title}
      description={job.description.substring(0, 150)}
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
  const headerData = await fetchHeaderData()

  // TODO: Fetch real job data from API
  // For now, return dummy data
  return {
    props: {
      headerData,
      job: {
        ...DUMMY_JOB,
        id,
      },
    },
  }
}

export default JobPage
