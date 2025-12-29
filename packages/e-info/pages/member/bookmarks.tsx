import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import LayoutGeneral from '~/components/layout/layout-general'
import { useAuth } from '~/hooks/useAuth'
import type { NextPageWithLayout } from '~/pages/_app'
import { setCacheControl } from '~/utils/common'

const PageWrapper = styled.div`
  background-color: #ffffff;
  min-height: 100vh;
`

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px 60px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 60px 20px 100px;
    display: flex;
    gap: 60px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    gap: 80px;
  }
`

const Sidebar = styled.nav`
  display: none;

  ${({ theme }) => theme.breakpoint.md} {
    display: block;
    width: 120px;
    flex-shrink: 0;
  }
`

const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

type SidebarItemProps = {
  $isActive?: boolean
}

const SidebarItem = styled.li<SidebarItemProps>`
  a {
    display: block;
    padding: 8px 0;
    font-size: 16px;
    font-weight: ${({ $isActive }) => ($isActive ? '700' : '400')};
    line-height: 1.5;
    color: ${({ theme, $isActive }) =>
      $isActive ? theme.colors.primary[40] : theme.colors.grayscale[40]};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.primary[40]};
    }
  }
`

const MobileNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px 24px;
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale[95]};

  ${({ theme }) => theme.breakpoint.md} {
    display: none;
  }
`

const MobileNavItem = styled(Link)<{ $isActive?: boolean }>`
  font-size: 16px;
  font-weight: ${({ $isActive }) => ($isActive ? '700' : '400')};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary[40] : theme.colors.grayscale[40]};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[40]};
  }
`

const MainContent = styled.main`
  flex: 1;
`

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[40]};
  margin: 0 0 24px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 24px;
    margin-bottom: 32px;
  }
`

const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    grid-template-columns: repeat(3, 1fr);
  }
`

const ArticleCard = styled.a`
  display: block;
  text-decoration: none;
  cursor: pointer;
`

const ArticleImage = styled.div`
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  margin-bottom: 12px;
  background-color: ${({ theme }) => theme.colors.grayscale[95]};
  border-radius: 2px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const ArticleDate = styled.time`
  display: block;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[40]};
  margin-bottom: 8px;
`

const ArticleTitle = styled.h3`
  font-weight: 500;
  font-size: 18px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const ArticleSummary = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const TagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
`

const Tag = styled.li`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[60]};
  border: 1px solid ${({ theme }) => theme.colors.primary[60]};
  border-radius: 4px;
  padding: 2px 10px;
`

const LoadMoreButton = styled.button`
  display: block;
  margin: 40px auto 0;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.grayscale[60]};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.grayscale[95]};
  }
`

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: ${({ theme }) => theme.colors.grayscale[60]};
`

const EmptyMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.grayscale[60]};
  font-size: 16px;
  line-height: 1.5;
`

const sidebarItems = [
  { label: '個人資料', href: '/member' },
  { label: '電子報', href: '/member/newsletter' },
  { label: '閱讀紀錄', href: '/member/history' },
  { label: '收藏文章', href: '/member/bookmarks' },
  { label: '通知', href: '/member/notifications' },
]

// 假資料（之後會替換為實際資料來源）
type MockArticle = {
  id: string
  title: string
  summary: string
  date: string
  imageUrl: string
  tags: { id: string; name: string }[]
}

const generateMockArticles = (): MockArticle[] => [
  {
    id: '1',
    title: '【氣候法未竟之業】強化行政院永續會權能 讓氣候治理的大腦...',
    summary:
      '核三將於本周六（17日）停機，立法院在野黨立委挾人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照規定，在「屆期前」都可提出申請、核電廠運轉年限最多再延長20年、已停機',
    date: '2023/03/28 12:59',
    imageUrl: '/images/post-default.jpg',
    tags: [
      { id: '1', name: '標籤1' },
      { id: '2', name: '標籤2' },
      { id: '3', name: '標籤3' },
      { id: '4', name: '標籤444' },
      { id: '5', name: '標籤5' },
      { id: '6', name: '標籤6' },
      { id: '7', name: '標籤7' },
      { id: '8', name: '標籤8' },
      { id: '9', name: '標籤9' },
      { id: '10', name: '標籤10' },
    ],
  },
  {
    id: '2',
    title: '《尼斯覺醒行動》逾90國家籲減塑 盼求全球塑膠公約談判達協議',
    summary:
      '聯合國海洋大會正於法國尼斯舉行，10日有超過90個會員國共同簽署《尼斯覺醒行動》（The Nice wake up call for an ambitious plastic treat...',
    date: '2023/03/28 12:59',
    imageUrl: '/images/default-post.jpg',
    tags: [
      { id: '1', name: '標籤1' },
      { id: '2', name: '標籤2' },
      { id: '3', name: '標籤3' },
      { id: '4', name: '標籤444' },
      { id: '5', name: '標籤5' },
      { id: '6', name: '標籤6' },
      { id: '7', name: '標籤7' },
      { id: '8', name: '標籤8' },
      { id: '9', name: '標籤9' },
      { id: '10', name: '標籤10' },
    ],
  },
  {
    id: '3',
    title: '《尼斯覺醒行動》逾90國家籲減塑 盼求全球塑膠公約談判達協議',
    summary:
      '聯合國海洋大會正於法國尼斯舉行，10日有超過90個會員國共同簽署《尼斯覺醒行動》（The Nice wake up call for an ambitious plastic treat...',
    date: '2023/03/28 12:59',
    imageUrl: '/images/default-post.jpg',
    tags: [
      { id: '1', name: '標籤1' },
      { id: '2', name: '標籤2' },
      { id: '3', name: '標籤3' },
      { id: '4', name: '標籤444' },
      { id: '5', name: '標籤5' },
      { id: '6', name: '標籤6' },
      { id: '7', name: '標籤7' },
      { id: '8', name: '標籤8' },
    ],
  },
  {
    id: '4',
    title: '百萬美金打造海廢初號機 犀牛盾要「在沿岸建造掃地機器人」',
    summary:
      '海洋廢棄物挑戰日益嚴峻，台灣起家的手機配件品牌犀牛盾，宣布推出智慧海廢清理平台「破浪者」。◇ 結合太陽能、自動化與AI辨識技術，透過無人機偵測、無人船回收與水流引導系統，打造低能耗、模組化...',
    date: '2023/03/28 12:59',
    imageUrl: '/images/default-post.jpg',
    tags: [
      { id: '1', name: '標籤1' },
      { id: '2', name: '標籤2' },
      { id: '3', name: '標籤3' },
      { id: '4', name: '標籤444' },
      { id: '5', name: '標籤5' },
      { id: '6', name: '標籤6' },
      { id: '7', name: '標籤7' },
      { id: '8', name: '標籤8' },
      { id: '9', name: '標籤9' },
      { id: '10', name: '標籤10' },
    ],
  },
  {
    id: '5',
    title: '台灣首支rPET瓶裝茶實現「瓶到瓶」循環 主婦聯盟：盼環境部...',
    summary:
      '全台一年用約50億支寶特瓶，雖然回收率高達95%，但多數回收料被降級為衣物、建材等用途，最終仍遭丟棄。在資源永續循環概念下，盼實現「瓶到瓶」的封閉式資源循環，主婦聯盟昨（21）日首度推出...',
    date: '2023/03/28 12:59',
    imageUrl: '/images/default-post.jpg',
    tags: [
      { id: '1', name: '標籤1' },
      { id: '2', name: '標籤2' },
      { id: '3', name: '標籤3' },
      { id: '4', name: '標籤444' },
      { id: '5', name: '標籤5' },
      { id: '6', name: '標籤6' },
      { id: '7', name: '標籤7' },
      { id: '8', name: '標籤8' },
      { id: '9', name: '標籤9' },
      { id: '10', name: '標籤10' },
    ],
  },
  {
    id: '6',
    title: '台灣首支rPET瓶裝茶實現「瓶到瓶」循環 主婦聯盟：盼環境部...',
    summary:
      '全台一年用約50億支寶特瓶，雖然回收率高達95%，但多數回收料被降級為衣物、建材等用途，最終仍遭丟棄。在資源永續循環概念下，盼實現「瓶到瓶」的封閉式資源循環，主婦聯盟昨（21）日首度推出...',
    date: '2023/03/28 12:59',
    imageUrl: '/images/default-post.jpg',
    tags: [
      { id: '1', name: '標籤1' },
      { id: '2', name: '標籤2' },
      { id: '3', name: '標籤3' },
      { id: '4', name: '標籤444' },
      { id: '5', name: '標籤5' },
      { id: '6', name: '標籤6' },
      { id: '7', name: '標籤7' },
      { id: '8', name: '標籤8' },
      { id: '9', name: '標籤9' },
      { id: '10', name: '標籤10' },
    ],
  },
  {
    id: '7',
    title: '「核電延役免環評」彭啟明也覺奇怪 立委呼籲環境部修法',
    summary:
      '核三將於本周六（17日）停機，立法院在野黨立委挾人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照規定，在「屆期前」都可提出申請、核電廠運轉年限最多再延長20年、已停機',
    date: '2023/03/28 12:59',
    imageUrl: '/images/default-post.jpg',
    tags: [
      { id: '1', name: '標籤1' },
      { id: '2', name: '標籤2' },
      { id: '3', name: '標籤3' },
      { id: '4', name: '標籤444' },
      { id: '5', name: '標籤5' },
      { id: '6', name: '標籤6' },
      { id: '7', name: '標籤7' },
      { id: '8', name: '標籤8' },
      { id: '9', name: '標籤9' },
      { id: '10', name: '標籤10' },
    ],
  },
  {
    id: '8',
    title: '「核電延役免環評」彭啟明也覺奇怪 立委呼籲環境部修法',
    summary:
      '核三將於本周六（17日）停機，立法院在野黨立委挾人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照規定，在「屆期前」都可提出申請、核電廠運轉年限最多再延長20年、已停機',
    date: '2023/03/28 12:59',
    imageUrl: '/images/default-post.jpg',
    tags: [
      { id: '1', name: '標籤1' },
      { id: '2', name: '標籤2' },
      { id: '3', name: '標籤3' },
      { id: '4', name: '標籤444' },
      { id: '5', name: '標籤5' },
      { id: '6', name: '標籤6' },
      { id: '7', name: '標籤7' },
      { id: '8', name: '標籤8' },
      { id: '9', name: '標籤9' },
      { id: '10', name: '標籤10' },
    ],
  },
  {
    id: '9',
    title: '「核電延役免環評」彭啟明也覺奇怪 立委呼籲環境部修法',
    summary:
      '核三將於本周六（17日）停機，立法院在野黨立委挾人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照規定，在「屆期前」都可提出申請、核電廠運轉年限最多再延長20年、已停機',
    date: '2023/03/28 12:59',
    imageUrl: '/images/default-post.jpg',
    tags: [
      { id: '1', name: '標籤1' },
      { id: '2', name: '標籤2' },
      { id: '3', name: '標籤3' },
      { id: '4', name: '標籤444' },
      { id: '5', name: '標籤5' },
      { id: '6', name: '標籤6' },
      { id: '7', name: '標籤7' },
      { id: '8', name: '標籤8' },
      { id: '9', name: '標籤9' },
      { id: '10', name: '標籤10' },
    ],
  },
]

const MemberBookmarksPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { firebaseUser, loading } = useAuth()

  const [articles, setArticles] = useState<MockArticle[]>([])
  const [hasMore, setHasMore] = useState(true)

  // Initialize with mock data
  useEffect(() => {
    setArticles(generateMockArticles())
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/auth/login')
    }
  }, [loading, firebaseUser, router])

  const handleLoadMore = () => {
    // 模擬載入更多（實際實作時會從 API 取得）
    const moreArticles = generateMockArticles().map((article, index) => ({
      ...article,
      id: `more-${articles.length + index}`,
    }))
    setArticles((prev) => [...prev, ...moreArticles])
    // 模擬沒有更多資料
    if (articles.length >= 18) {
      setHasMore(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <PageWrapper>
        <ContentWrapper>
          <LoadingWrapper>載入中...</LoadingWrapper>
        </ContentWrapper>
      </PageWrapper>
    )
  }

  // Don't render if not authenticated
  if (!firebaseUser) {
    return null
  }

  return (
    <PageWrapper>
      <ContentWrapper>
        <Sidebar>
          <SidebarList>
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.href}
                $isActive={item.href === '/member/bookmarks'}
              >
                <Link href={item.href}>{item.label}</Link>
              </SidebarItem>
            ))}
          </SidebarList>
        </Sidebar>

        <MainContent>
          <MobileNav>
            {sidebarItems.map((item) => (
              <MobileNavItem
                key={item.href}
                href={item.href}
                $isActive={item.href === '/member/bookmarks'}
              >
                {item.label}
              </MobileNavItem>
            ))}
          </MobileNav>

          <PageTitle>收藏文章</PageTitle>

          {articles.length === 0 ? (
            <EmptyMessage>目前沒有收藏文章</EmptyMessage>
          ) : (
            <>
              <ArticleGrid>
                {articles.map((article) => (
                  <ArticleCard key={article.id} href={`/node/${article.id}`}>
                    <ArticleImage>
                      <img src={article.imageUrl} alt={article.title} />
                    </ArticleImage>
                    <ArticleDate>{article.date}</ArticleDate>
                    <ArticleTitle>{article.title}</ArticleTitle>
                    <ArticleSummary>{article.summary}</ArticleSummary>
                    <TagList>
                      {article.tags.map((tag) => (
                        <Tag key={tag.id}>{tag.name}</Tag>
                      ))}
                    </TagList>
                  </ArticleCard>
                ))}
              </ArticleGrid>

              {hasMore && (
                <LoadMoreButton onClick={handleLoadMore}>
                  load more
                </LoadMoreButton>
              )}
            </>
          )}
        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  )
}

MemberBookmarksPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutGeneral title="收藏文章 - 環境資訊中心" description="您的收藏文章">
      {page}
    </LayoutGeneral>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  setCacheControl(res)

  return {
    props: {},
  }
}

export default MemberBookmarksPage
