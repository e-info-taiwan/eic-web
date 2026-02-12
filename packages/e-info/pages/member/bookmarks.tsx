import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import LayoutGeneral from '~/components/layout/layout-general'
import { DEFAULT_POST_IMAGE_PATH } from '~/constants/constant'
import { MAX_CONTENT_WIDTH } from '~/constants/layout'
import { useAuth } from '~/hooks/useAuth'
import type { FavoriteWithPost } from '~/lib/graphql/member'
import {
  getMemberFavorites,
  getMemberFavoritesCount,
} from '~/lib/graphql/member'
import type { NextPageWithLayout } from '~/pages/_app'
import { setCacheControl } from '~/utils/common'
import { fetchHeaderData } from '~/utils/header-data'

const PageWrapper = styled.div`
  background-color: #ffffff;
  min-height: 100vh;
`

const ContentWrapper = styled.div`
  max-width: ${MAX_CONTENT_WIDTH};
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

const ITEMS_PER_PAGE = 9

// Helper function to format date
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}/${month}/${day} ${hours}:${minutes}`
  } catch {
    return ''
  }
}

// Helper function to get image URL from favorite post
const getImageUrl = (favorite: FavoriteWithPost): string => {
  const heroImage = favorite.post.heroImage
  const resized = heroImage?.resized
  const resizedWebp = heroImage?.resizedWebp
  return (
    resizedWebp?.w800 ||
    resizedWebp?.w480 ||
    resized?.w800 ||
    resized?.w480 ||
    resized?.original ||
    DEFAULT_POST_IMAGE_PATH
  )
}

const MemberBookmarksPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { firebaseUser, member, loading } = useAuth()

  const [favorites, setFavorites] = useState<FavoriteWithPost[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Fetch favorites when member is available
  const fetchFavorites = useCallback(async () => {
    if (!member?.id || !firebaseUser?.uid) return

    setInitialLoading(true)
    try {
      const [data, count] = await Promise.all([
        getMemberFavorites(member.id, firebaseUser.uid, ITEMS_PER_PAGE, 0),
        getMemberFavoritesCount(member.id),
      ])
      setFavorites(data)
      setTotalCount(count)
      setHasMore(data.length < count)
    } catch (err) {
      console.error('Failed to fetch favorites:', err)
    } finally {
      setInitialLoading(false)
    }
  }, [member?.id, firebaseUser?.uid])

  useEffect(() => {
    if (member?.id) {
      fetchFavorites()
    }
  }, [member?.id, fetchFavorites])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/auth/login')
    }
  }, [loading, firebaseUser, router])

  const handleLoadMore = async () => {
    if (!member?.id || !firebaseUser?.uid || isLoadingMore) return

    setIsLoadingMore(true)
    try {
      const moreFavorites = await getMemberFavorites(
        member.id,
        firebaseUser.uid,
        ITEMS_PER_PAGE,
        favorites.length
      )
      setFavorites((prev) => [...prev, ...moreFavorites])
      setHasMore(favorites.length + moreFavorites.length < totalCount)
    } catch (err) {
      console.error('Failed to load more favorites:', err)
    } finally {
      setIsLoadingMore(false)
    }
  }

  // Show loading state
  if (loading || initialLoading) {
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

          {favorites.length === 0 ? (
            <EmptyMessage>目前沒有收藏文章</EmptyMessage>
          ) : (
            <>
              <ArticleGrid>
                {favorites.map((favorite) => (
                  <ArticleCard
                    key={favorite.id}
                    href={`/node/${favorite.post.id}`}
                  >
                    <ArticleImage>
                      <img
                        src={getImageUrl(favorite)}
                        alt={favorite.post.title}
                      />
                    </ArticleImage>
                    <ArticleDate>
                      {formatDate(favorite.post.publishTime)}
                    </ArticleDate>
                    <ArticleTitle>{favorite.post.title}</ArticleTitle>
                    <ArticleSummary>
                      {favorite.post.contentPreview}
                    </ArticleSummary>
                    <TagList>
                      {favorite.post.tags.map((tag) => (
                        <Tag key={tag.id}>{tag.name}</Tag>
                      ))}
                    </TagList>
                  </ArticleCard>
                ))}
              </ArticleGrid>

              {hasMore && (
                <LoadMoreButton
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? '載入中...' : 'load more'}
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
    <LayoutGeneral title="收藏文章" description="您的收藏文章">
      {page}
    </LayoutGeneral>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  setCacheControl(res)

  const headerData = await fetchHeaderData()

  return {
    props: {
      headerData,
    },
  }
}

export default MemberBookmarksPage
