// Featured Topic 單頁
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
  max-width: 1200px;
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
    margin-bottom: 40px;
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

const TopicHeader = styled.div`
  max-width: 760px;
  margin: 0 auto 40px;
`

const TopicTitleSection = styled.div`
  text-align: center;
`

const TopicTitle = styled.h2`
  display: inline-block;
  font-size: 28px;
  font-weight: 500;
  line-height: 32px;
  color: ${({ theme }) => theme.colors.secondary[0]};
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.secondary[0]};

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 36px;
    line-height: 1.25;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 48px;
    line-height: 1.25;
  }
`

const TopicSummary = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.8;
  color: #333;
  margin: 0 0 16px;
  text-align: center;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
  }
`

const UpdateTime = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #000;
  margin-bottom: 20px;
  text-align: center;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }

  span {
    color: ${({ theme }) => theme.colors.secondary[20]};
  }
`

const TagSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 48px;
`

const TagRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: wrap;
  justify-content: center;
`

const TagLabel = styled.span`
  font-size: 16px;
  line-height: 1.5;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary[20]};
  white-space: nowrap;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
`

const TagList = styled.div`
  display: flex;
  gap: 0;
  flex-wrap: wrap;
  justify-content: center;
`

const Tag = styled.span`
  font-size: 16px;
  line-height: 1.5;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary[20]};
  white-space: nowrap;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
`

const ArticleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 760px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoint.md} {
    gap: 40px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    gap: 48px;
  }
`

const ArticleCard = styled.a`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  text-decoration: none;
  cursor: pointer;

  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: 283px 1fr;
    gap: 20px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    gap: 20px;
  }
`

const ArticleImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background-color: #f0f0f0;

  ${({ theme }) => theme.breakpoint.md} {
    width: 283px;
    height: 176px;
    flex-shrink: 0;
  }
`

const ArticleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ArticleContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const ArticleTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  color: #000;
  margin: 0 0 12px;
  transition: color 0.3s ease;

  ${ArticleCard}:hover & {
    color: #e07a3f;
  }

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 20px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 22px;
  }
`

const ArticleExcerpt = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  color: #666;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

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

  ${({ theme }) => theme.breakpoint.xl} {
    margin-top: 80px;
  }
`

const BackForwardButton = styled.button<{ $isDisabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  background: none;
  border: none;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.3 : 1)};
  padding: 0;

  > svg {
    width: 25px;
    height: 25px;
  }

  ${({ theme }) => theme.breakpoint.md} {
    min-width: 40px;
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
      : theme.colors.primary[20]};
  background: #fff;
  color: ${({ $isActive, $isDisabled, theme }) =>
    $isDisabled
      ? theme.colors.grayscale[60]
      : $isActive
      ? theme.colors.grayscale[0]
      : theme.colors.primary[20]};
  font-size: 10px;
  font-weight: 500;
  line-height: 1.5;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  border-radius: 11px;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[20]};
    border-color: ${({ theme }) => theme.colors.primary[20]};
    color: #fff;
  }

  ${({ theme }) => theme.breakpoint.md} {
    min-width: 36px;
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
  color: ${({ theme }) => theme.colors.primary[20]};
  font-size: 14px;

  ${({ theme }) => theme.breakpoint.xl} {
    min-width: 48px;
    height: 48px;
    font-size: 16px;
  }
`

// Dummy data types
type TopicArticle = {
  id: string
  title: string
  excerpt: string
  image: string
  href: string
}

type TopicData = {
  id: string
  heroImage: string
  heroTopText: string
  heroTitle: string
  title: string
  summary: string
  updateTime: string
  tags: {
    editors: string[]
    writers: string[]
    photographers: string[]
    designers: string[]
    illustrators: string[]
  }
  articles: TopicArticle[]
}

// Dummy topic data
const DUMMY_TOPIC: TopicData = {
  id: '1',
  heroImage: 'https://picsum.photos/seed/hero-topic1/1600/900',
  heroTopText: '深度專題系列報導',
  heroTitle: '卓永脛觀察員',
  title: '在理想中擱淺的鯨豚觀察員',
  summary:
    '核三將於本周六（17日）停機，立法院在野黨立委挾人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照規定，在「屆期前」都可提出申請、核電廠運轉年限最多再延長20年、已停機',
  updateTime: '2023/03/28 12:59',
  tags: {
    editors: ['陳慶昇', '李雪莉', '黃鈺婷'],
    writers: ['陳立方', '劉光明', '顏聰聲', '美芳姨'],
    photographers: ['許書豪'],
    designers: ['黃禹禛'],
    illustrators: ['劉紀平'],
  },
  articles: [
    {
      id: '1',
      title: '《尼斯護照旅行》總90國家簽證單 拆來全球塑膠公約談判逐協議',
      excerpt:
        '聯合國海洋大會正在法國尼斯舉行，10日有超過90個會員國簽署《尼斯護照旅行》（The Nice wake up call for an ambitious plastic treat...',
      image: 'https://picsum.photos/seed/article1/400/250',
      href: '/node/1',
    },
    {
      id: '2',
      title: '海洋保護區的建立與挑戰 台灣周邊海域生態調查報告',
      excerpt:
        '根據最新的海洋生態調查顯示，台灣周邊海域的生物多樣性正面臨嚴峻挑戰，海洋保護區的設立刻不容緩...',
      image: 'https://picsum.photos/seed/article2/400/250',
      href: '/node/2',
    },
    {
      id: '3',
      title: '氣候變遷下的珊瑚礁白化危機 專家呼籲立即行動',
      excerpt:
        '全球暖化導致海水溫度上升，珊瑚礁白化現象日益嚴重。海洋生物學家警告，若不採取行動，珊瑚生態系統將面臨崩潰...',
      image: 'https://picsum.photos/seed/article3/400/250',
      href: '/node/3',
    },
    {
      id: '4',
      title: '漁業永續發展的新契機 智慧養殖技術突破',
      excerpt:
        '台灣養殖業者引進智慧監測系統，結合物聯網技術，大幅提升養殖效率，同時減少對環境的衝擊...',
      image: 'https://picsum.photos/seed/article4/400/250',
      href: '/node/4',
    },
    {
      id: '5',
      title: '海洋廢棄物處理新方案 民間團體推動淨灘行動',
      excerpt:
        '環保團體發起全台淨灘活動，一年內清理超過50噸海洋垃圾，喚起民眾對海洋污染的關注...',
      image: 'https://picsum.photos/seed/article5/400/250',
      href: '/node/5',
    },
    {
      id: '6',
      title: '離岸風電與海洋生態的平衡 環評爭議持續延燒',
      excerpt:
        '離岸風電開發案引發環保團體與能源業者論戰，如何在綠能發展與生態保護之間取得平衡成為焦點...',
      image: 'https://picsum.photos/seed/article6/400/250',
      href: '/node/6',
    },
    {
      id: '7',
      title: '海龜保育有成 野放數量創新高紀錄',
      excerpt:
        '今年度海龜救傷中心成功野放123隻海龜，創下歷年新高。保育人員表示，這是多年努力的成果...',
      image: 'https://picsum.photos/seed/article7/400/250',
      href: '/node/7',
    },
    {
      id: '8',
      title: '深海探測新發現 台灣海溝發現未知物種',
      excerpt:
        '研究團隊在台灣海溝進行深海探測時，發現多種未曾記錄的生物，為海洋生物學研究開啟新頁...',
      image: 'https://picsum.photos/seed/article8/400/250',
      href: '/node/8',
    },
    {
      id: '9',
      title: '海洋教育向下扎根 偏鄉學校推動海洋課程',
      excerpt:
        '教育部推動海洋教育計畫，在沿海偏鄉學校開設特色課程，培養學生海洋素養與保育意識...',
      image: 'https://picsum.photos/seed/article9/400/250',
      href: '/node/9',
    },
    {
      id: '10',
      title: '漁港轉型觀光 漁村再生計畫啟動',
      excerpt:
        '政府推動漁港多元化發展，結合觀光與在地文化，為傳統漁村注入新活力，創造就業機會...',
      image: 'https://picsum.photos/seed/article10/400/250',
      href: '/node/10',
    },
    {
      id: '11',
      title: '海洋污染監測系統升級 即時掌握水質狀況',
      excerpt:
        '環保署建置新一代海洋水質監測系統，運用AI技術分析數據，提供即時預警機制...',
      image: 'https://picsum.photos/seed/article11/400/250',
      href: '/node/11',
    },
    {
      id: '12',
      title: '鯨豚擁擠頻傳 專家呼籲加強海域巡護',
      excerpt:
        '今年鯨豚擱淺案件數量攀升，海洋保育專家分析原因，呼籲政府加強海域巡護與救援機制...',
      image: 'https://picsum.photos/seed/article12/400/250',
      href: '/node/12',
    },
    {
      id: '13',
      title: '海洋再生能源發展藍圖 2030目標出爐',
      excerpt:
        '政府公布海洋能源發展藍圖，規劃2030年前完成10GW離岸風電裝置容量，推動能源轉型...',
      image: 'https://picsum.photos/seed/article13/400/250',
      href: '/node/13',
    },
    {
      id: '14',
      title: '海洋科技產業起飛 水下無人機需求大增',
      excerpt:
        '隨著海洋探測與監測需求增加，水下無人機市場快速成長，台灣廠商積極搶攻商機...',
      image: 'https://picsum.photos/seed/article14/400/250',
      href: '/node/14',
    },
    {
      id: '15',
      title: '海洋文化資產保存 水下考古新發現',
      excerpt:
        '文化部水下考古團隊在澎湖海域發現清代沉船遺跡，出土大量文物，具有重要歷史價值...',
      image: 'https://picsum.photos/seed/article15/400/250',
      href: '/node/15',
    },
    {
      id: '16',
      title: '永續海鮮指南發布 消費者選購新參考',
      excerpt:
        '環保團體推出永續海鮮指南，協助消費者辨識友善環境的海產品，推動負責任的消費行為...',
      image: 'https://picsum.photos/seed/article16/400/250',
      href: '/node/16',
    },
    {
      id: '17',
      title: '海洋熱浪襲擊 漁獲量驟減引發關注',
      excerpt:
        '連續高溫導致海洋熱浪現象，影響魚群洄游路線，漁民收入大減，專家憂心氣候變遷加劇...',
      image: 'https://picsum.photos/seed/article17/400/250',
      href: '/node/17',
    },
    {
      id: '18',
      title: '海洋生物多樣性公約 台灣參與受阻',
      excerpt:
        '聯合國海洋生物多樣性公約談判進入關鍵階段，台灣雖積極爭取參與，仍面臨國際政治阻力...',
      image: 'https://picsum.photos/seed/article18/400/250',
      href: '/node/18',
    },
    {
      id: '19',
      title: '海洋運動風潮興起 衝浪列入正式課程',
      excerpt:
        '教育部將衝浪納入體育課程選項，東海岸地區學校率先試辦，培養學生親海愛海的態度...',
      image: 'https://picsum.photos/seed/article19/400/250',
      href: '/node/19',
    },
    {
      id: '20',
      title: '海洋塑膠微粒污染 食物鏈威脅浮現',
      excerpt:
        '研究發現海洋生物體內塑膠微粒濃度上升，透過食物鏈累積，對人體健康構成潛在風險...',
      image: 'https://picsum.photos/seed/article20/400/250',
      href: '/node/20',
    },
    {
      id: '21',
      title: '潮間帶生態調查 公民科學家動員',
      excerpt:
        '海洋保育團體招募公民科學家進行潮間帶生態調查，累積寶貴數據，建立長期監測機制...',
      image: 'https://picsum.photos/seed/article21/400/250',
      href: '/node/21',
    },
    {
      id: '22',
      title: '海洋法規修訂 加重非法捕撈罰則',
      excerpt:
        '立法院三讀通過海洋法規修正案，大幅提高非法捕撈罰金，強化執法力度遏止違規行為...',
      image: 'https://picsum.photos/seed/article22/400/250',
      href: '/node/22',
    },
    {
      id: '23',
      title: '海洋研究船隊擴編 提升科研能量',
      excerpt:
        '科技部投資建造新一代海洋研究船，配備先進儀器設備，強化台灣海洋科學研究實力...',
      image: 'https://picsum.photos/seed/article23/400/250',
      href: '/node/23',
    },
    {
      id: '24',
      title: '藍碳經濟新商機 紅樹林復育成焦點',
      excerpt:
        '紅樹林具有高效碳匯能力，政府推動沿海紅樹林復育計畫，發展藍碳經濟創造多重效益...',
      image: 'https://picsum.photos/seed/article24/400/250',
      href: '/node/24',
    },
  ],
}

type PageProps = {
  topic: TopicData
}

const TopicPage: NextPageWithLayout<PageProps> = ({ topic }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const totalPages = Math.ceil(topic.articles.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    gtag.sendEvent('topic', 'click', `page-${page}`)
  }

  // Paginate articles
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentArticles = topic.articles.slice(startIndex, endIndex)

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)

    if (currentPage > 3) {
      pages.push('...')
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push('...')
    }

    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const renderTagRow = (label: string, tags: string[]) => {
    if (!tags || tags.length === 0) return null

    return (
      <TagRow>
        <TagLabel>{label}：</TagLabel>
        <TagList>
          {tags.map((tag, index) => (
            <Tag key={index}>
              {tag}
              {index < tags.length - 1 && '、'}
            </Tag>
          ))}
        </TagList>
      </TagRow>
    )
  }

  return (
    <PageWrapper>
      {/* Hero Section */}
      <HeroSection>
        <HeroImage src={topic.heroImage} alt={topic.heroTitle} />
      </HeroSection>

      {/* Content */}
      <ContentWrapper>
        <TopicHeader>
          {/* Topic Title */}
          <TopicTitleSection>
            <TopicTitle>{topic.title}</TopicTitle>
          </TopicTitleSection>

          {/* Summary */}
          <TopicSummary>{topic.summary}</TopicSummary>

          {/* Update Time */}
          <UpdateTime>
            最新更新時間 <span>{topic.updateTime}</span>
          </UpdateTime>

          {/* Tags */}
          <TagSection>
            {renderTagRow('標籤記者', topic.tags.editors)}
            {renderTagRow('文字編輯', topic.tags.writers)}
            {renderTagRow('攝影編輯', topic.tags.photographers)}
            {renderTagRow('設計製作', topic.tags.designers)}
            {renderTagRow('美術編輯', topic.tags.illustrators)}
          </TagSection>
        </TopicHeader>

        {/* Article List */}
        <ArticleList>
          {currentArticles.map((article) => (
            <Link key={article.id} href={article.href} passHref legacyBehavior>
              <ArticleCard
                onClick={() =>
                  gtag.sendEvent('topic', 'click', `article-${article.title}`)
                }
              >
                <ArticleImageWrapper>
                  <ArticleImage src={article.image} alt={article.title} />
                </ArticleImageWrapper>
                <ArticleContent>
                  <ArticleTitle>{article.title}</ArticleTitle>
                  <ArticleExcerpt>{article.excerpt}</ArticleExcerpt>
                </ArticleContent>
              </ArticleCard>
            </Link>
          ))}
        </ArticleList>

        {/* Pagination */}
        {totalPages > 1 && (
          <PaginationWrapper>
            <BackForwardButton
              $isDisabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <IconBack />
            </BackForwardButton>

            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <PaginationEllipsis key={`ellipsis-${index}`}>
                    ...
                  </PaginationEllipsis>
                )
              }

              return (
                <PaginationButton
                  key={page}
                  $isActive={currentPage === page}
                  onClick={() => handlePageChange(page as number)}
                >
                  {String(page).padStart(2, '0')}
                </PaginationButton>
              )
            })}

            <BackForwardButton
              $isDisabled={currentPage === totalPages}
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

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  res,
}) => {
  setCacheControl(res)

  // TODO: Replace with actual API call or JSON data
  // const topicId = params?.id as string
  const topic = DUMMY_TOPIC

  // In production, you would fetch the topic by ID here
  // If topic not found, return notFound: true

  return {
    props: {
      topic,
    },
  }
}

TopicPage.getLayout = function getLayout(page: ReactElement<PageProps>) {
  const { props } = page
  const { topic } = props

  return (
    <LayoutGeneral
      title={topic.title}
      description={topic.summary}
      imageUrl={topic.heroImage}
    >
      {page}
    </LayoutGeneral>
  )
}

export default TopicPage
