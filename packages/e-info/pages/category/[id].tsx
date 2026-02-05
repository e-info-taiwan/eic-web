// Category listing page - shows posts from specific category
import SharedImage from '@readr-media/react-image'
import errors from '@twreporter/errors'
import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import styled from 'styled-components'

import { getGqlClient } from '~/apollo-client'
import LayoutGeneral from '~/components/layout/layout-general'
import ArticleLists from '~/components/shared/article-lists'
import {
  DEFAULT_NEWS_IMAGE_PATH,
  DEFAULT_POST_IMAGE_PATH,
} from '~/constants/constant'
import type { HeaderContextData } from '~/contexts/header-context'
import type {
  CategoryPostForListing,
  SectionListingCategory,
} from '~/graphql/query/section'
import {
  categoryByIdWithSection,
  categoryPostsForListing,
} from '~/graphql/query/section'
import type { NextPageWithLayout } from '~/pages/_app'
import IconBack from '~/public/icons/arrow_back.svg'
import IconForward from '~/public/icons/arrow_forward.svg'
import type { ArticleCard } from '~/types/component'
import { setCacheControl } from '~/utils/common'
import { fetchHeaderData } from '~/utils/header-data'
import { postConvertFunc } from '~/utils/post'

const POSTS_PER_PAGE = 12

const PageWrapper = styled.div`
  padding: 20px 0 24px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 20px 0 48px;
  }

  ${({ theme }) => theme.breakpoint.lg} {
    padding: 20px 0 60px;
    max-width: 1200px;
    margin: auto;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 40px 0 60px;
  }
`

const ArticleWrapper = styled.div`
  padding: 0 27px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 0 98px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 0 58px;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: normal;
  padding: 0 27px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 0 98px;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 0 58px;
  }
`

const AccentBar = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[20]};
  width: 60px;
  height: 20px;
  margin-right: 0.75rem;
  border-bottom-right-radius: 12px;

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    width: 80px;
    height: 32px;
  }
`

const TitleLink = styled(Link)`
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  margin: 0;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[20]};
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 28px;
    line-height: 32px;
  }
`

const CategoryTabs = styled.div`
  display: flex;
  row-gap: 8px;
  column-gap: 16px;
  margin-top: 12px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex-wrap: nowrap;
  padding: 0 27px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    width: 100%;
    overflow-x: visible;
    flex-wrap: wrap;
    padding: 0 98px;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    width: auto;
    margin-top: 0;
    padding: 0 58px;
  }
`

const CategoryTab = styled(Link)<{ $isActive?: boolean }>`
  background: none;
  border: none;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary[20] : '#373740'};
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  cursor: pointer;
  transition: color 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[20]};
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #000;
  margin: 20px 28px 24px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    margin-top: 24px;
    margin-left: 98px;
    margin-right: 98px;
    margin-bottom: 24px;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    margin-top: 28px;
    margin-left: 58px;
    margin-right: 58px;
    margin-bottom: 28px;
  }
`

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 13px;
  margin-top: 24px;
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

  > svg {
    width: 25px;
    height: 25px;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    min-width: 40px;
    height: 40px;

    > svg {
      width: 40px;
      height: 40px;
    }
  }
`

const PaginationButton = styled(Link)<{
  $isActive?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 1px solid;
  border-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.grayscale[0] : theme.colors.primary[20]};
  background: #fff;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.grayscale[0] : theme.colors.primary[20]};
  font-size: 10px;
  font-weight: 500;
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 11px;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[20]};
    border-color: ${({ theme }) => theme.colors.primary[20]};
    color: #fff;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    min-width: 36px;
    height: 36px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 18px;
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

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    min-width: 48px;
    height: 48px;
    font-size: 16px;
  }
`

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  font-size: 16px;
`

// ========== Column Style Header Styled Components ==========

const ColumnPageWrapper = styled.div`
  width: 100%;
`

const ColumnHeroSection = styled.div`
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

const ColumnHeroImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

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

const ColumnHeroTitleWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
`

const ColumnHeroAccentBar = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[80]};
  width: 20px;
  height: 32px;
  margin-right: 0.75rem;
  border-bottom-right-radius: 12px;
`

const ColumnHeroTitle = styled.h1`
  font-size: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary[80]};
  margin: 0;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    font-size: 32px;
  }
`

const ColumnCategoryTagsWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(
    180deg,
    rgba(207, 237, 209, 0.6) 61.06%,
    rgba(139, 200, 144, 0.6) 100%
  );
  padding: 16px 20px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 20px 40px;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 24px 60px;
  }
`

const ColumnCategoryTagsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    gap: 12px 16px;
  }
`

const ColumnCategoryTag = styled(Link)<{ $isActive?: boolean }>`
  display: inline-block;
  padding: 8px;
  border: 1px solid
    ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary[20] : theme.colors.grayscale[40]};
  border-radius: 12px;
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary[20] : 'transparent'};
  color: ${({ $isActive, theme }) =>
    $isActive ? '#fff' : theme.colors.grayscale[40]};
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[20]};
    border-color: ${({ theme }) => theme.colors.primary[20]};
    color: #fff;
  }
`

const ColumnContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 27px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 24px 98px;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 24px 58px;
  }
`

type CategoryInfo = {
  id: string
  slug: string
  name: string
  postsCount: number
}

type SectionHeroImage = {
  resized: {
    original?: string
    w480?: string
    w800?: string
    w1200?: string
    w1600?: string
    w2400?: string
  } | null
  resizedWebp: {
    original?: string
    w480?: string
    w800?: string
    w1200?: string
    w1600?: string
    w2400?: string
  } | null
} | null

type SectionInfo = {
  id: string
  slug: string
  name: string
  style: string | null
  heroImage: SectionHeroImage
  categories: SectionListingCategory[]
}

type PageProps = {
  headerData: HeaderContextData
  category: CategoryInfo
  section: SectionInfo
  categories: SectionListingCategory[]
  posts: ArticleCard[]
  totalPosts: number
  currentPage: number
  totalPages: number
}

function generatePaginationItems(
  currentPage: number,
  totalPages: number
): (number | 'ellipsis')[] {
  const items: (number | 'ellipsis')[] = []

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      items.push(i)
    }
    return items
  }

  // Always show first page
  items.push(1)

  if (currentPage > 3) {
    items.push('ellipsis')
  }

  // Show pages around current page
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  for (let i = start; i <= end; i++) {
    items.push(i)
  }

  if (currentPage < totalPages - 2) {
    items.push('ellipsis')
  }

  // Always show last page
  if (totalPages > 1) {
    items.push(totalPages)
  }

  return items
}

const CategoryPage: NextPageWithLayout<PageProps> = ({
  category,
  section,
  categories,
  posts,
  currentPage,
  totalPages,
}) => {
  const router = useRouter()
  const categoryId = router.query.id as string
  const isColumnStyle = section.style !== 'default' && section.style !== null

  const buildPageUrl = (page: number) => {
    if (page === 1) {
      return `/category/${categoryId}`
    }
    return `/category/${categoryId}?page=${page}`
  }

  const paginationItems = generatePaginationItems(currentPage, totalPages)
  const hasHeroImage = !!section.heroImage?.resized

  // Column style header (when section.style is not 'default')
  if (isColumnStyle) {
    return (
      <ColumnPageWrapper>
        {/* Hero Section */}
        <ColumnHeroSection>
          <ColumnHeroImageWrapper>
            {hasHeroImage ? (
              <SharedImage
                images={section.heroImage?.resized || {}}
                imagesWebP={section.heroImage?.resizedWebp || {}}
                alt={section.name}
                priority={true}
                rwd={{
                  mobile: '100vw',
                  tablet: '100vw',
                  desktop: '100vw',
                  default: '100vw',
                }}
              />
            ) : (
              <img src={DEFAULT_POST_IMAGE_PATH} alt={section.name} />
            )}
          </ColumnHeroImageWrapper>
          <ColumnHeroTitleWrapper>
            <ColumnHeroAccentBar />
            <ColumnHeroTitle>{section.name}</ColumnHeroTitle>
          </ColumnHeroTitleWrapper>
        </ColumnHeroSection>

        {/* Category Tags */}
        <ColumnCategoryTagsWrapper>
          <ColumnCategoryTagsContainer>
            {categories.map((cat) => (
              <ColumnCategoryTag
                key={cat.id}
                href={`/category/${cat.id}`}
                $isActive={cat.id === category.id}
              >
                {cat.name}
              </ColumnCategoryTag>
            ))}
          </ColumnCategoryTagsContainer>
        </ColumnCategoryTagsWrapper>

        {/* Article Content */}
        <ColumnContentWrapper>
          {posts.length > 0 ? (
            <ArticleLists
              posts={posts}
              AdPageKey={category.slug}
              defaultImage={
                category.slug === 'editorpick'
                  ? DEFAULT_NEWS_IMAGE_PATH
                  : DEFAULT_POST_IMAGE_PATH
              }
            />
          ) : (
            <EmptyMessage>目前沒有文章</EmptyMessage>
          )}
        </ColumnContentWrapper>

        {totalPages > 1 && (
          <PaginationWrapper>
            <BackForwardButton
              $isDisabled={currentPage === 1}
              onClick={() => {
                if (currentPage > 1) {
                  router.push(buildPageUrl(currentPage - 1))
                }
              }}
            >
              <IconBack />
            </BackForwardButton>

            {paginationItems.map((item, index) =>
              item === 'ellipsis' ? (
                <PaginationEllipsis key={`ellipsis-${index}`}>
                  ......
                </PaginationEllipsis>
              ) : (
                <PaginationButton
                  key={item}
                  href={buildPageUrl(item)}
                  $isActive={item === currentPage}
                >
                  {String(item).padStart(2, '0')}
                </PaginationButton>
              )
            )}

            <BackForwardButton
              $isDisabled={currentPage === totalPages}
              onClick={() => {
                if (currentPage < totalPages) {
                  router.push(buildPageUrl(currentPage + 1))
                }
              }}
            >
              <IconForward />
            </BackForwardButton>
          </PaginationWrapper>
        )}
      </ColumnPageWrapper>
    )
  }

  // Default style header
  return (
    <PageWrapper>
      <Header>
        <AccentBar />
        <TitleLink href={`/section/${section.slug}`}>{section.name}</TitleLink>
      </Header>
      <CategoryTabs>
        {categories.map((cat) => (
          <CategoryTab
            key={cat.id}
            href={`/category/${cat.id}`}
            $isActive={cat.id === category.id}
          >
            {cat.name}
          </CategoryTab>
        ))}
      </CategoryTabs>
      <Divider />

      <ArticleWrapper>
        {posts.length > 0 ? (
          <ArticleLists
            posts={posts}
            AdPageKey={category.slug}
            defaultImage={
              category.slug === 'editorpick'
                ? DEFAULT_NEWS_IMAGE_PATH
                : DEFAULT_POST_IMAGE_PATH
            }
          />
        ) : (
          <EmptyMessage>目前沒有文章</EmptyMessage>
        )}
      </ArticleWrapper>

      {totalPages > 1 && (
        <PaginationWrapper>
          <BackForwardButton
            $isDisabled={currentPage === 1}
            onClick={() => {
              if (currentPage > 1) {
                router.push(buildPageUrl(currentPage - 1))
              }
            }}
          >
            <IconBack />
          </BackForwardButton>

          {paginationItems.map((item, index) =>
            item === 'ellipsis' ? (
              <PaginationEllipsis key={`ellipsis-${index}`}>
                ......
              </PaginationEllipsis>
            ) : (
              <PaginationButton
                key={item}
                href={buildPageUrl(item)}
                $isActive={item === currentPage}
              >
                {String(item).padStart(2, '0')}
              </PaginationButton>
            )
          )}

          <BackForwardButton
            $isDisabled={currentPage === totalPages}
            onClick={() => {
              if (currentPage < totalPages) {
                router.push(buildPageUrl(currentPage + 1))
              }
            }}
          >
            <IconForward />
          </BackForwardButton>
        </PaginationWrapper>
      )}
    </PageWrapper>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  params,
  query,
  res,
}) => {
  setCacheControl(res)

  const categoryId = params?.id as string
  const page = Math.max(1, parseInt(query.page as string, 10) || 1)
  const client = getGqlClient()

  try {
    // Fetch header data and category with section info in parallel
    const [headerData, { data: categoryData, error: categoryError }] =
      await Promise.all([
        fetchHeaderData(),
        client.query<{
          categories: Array<{
            id: string
            slug: string
            name: string
            postsCount: number
            section: SectionInfo
          }>
        }>({
          query: categoryByIdWithSection,
          variables: { categoryId },
        }),
      ])

    if (categoryError || !categoryData?.categories?.length) {
      return { notFound: true }
    }

    const categoryInfo = categoryData.categories[0]

    // Hidden categories - used only for homepage picks, not for direct browsing
    const HIDDEN_CATEGORY_SLUGS = ['homepagegraph', 'breakingnews', 'hottopic']
    if (HIDDEN_CATEGORY_SLUGS.includes(categoryInfo.slug)) {
      return { notFound: true }
    }

    const section = categoryInfo.section

    if (!section) {
      return { notFound: true }
    }

    const categories = section.categories
    const skip = (page - 1) * POSTS_PER_PAGE

    // Fetch posts for this category
    const { data: postsData, error: postsError } = await client.query<{
      categories: Array<{
        id: string
        postsCount: number
        posts: CategoryPostForListing[]
      }>
    }>({
      query: categoryPostsForListing,
      variables: {
        categoryId,
        take: POSTS_PER_PAGE,
        skip,
      },
    })

    if (postsError || !postsData?.categories?.length) {
      throw new Error('Failed to fetch posts')
    }

    const postsCategory = postsData.categories[0]
    const totalPosts = postsCategory.postsCount
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

    // Convert posts to ArticleCard format
    const posts: ArticleCard[] = postsCategory.posts.map((post) =>
      postConvertFunc(post as Parameters<typeof postConvertFunc>[0])
    )

    return {
      props: {
        headerData,
        category: {
          id: categoryInfo.id,
          slug: categoryInfo.slug,
          name: categoryInfo.name,
          postsCount: categoryInfo.postsCount,
        },
        section: {
          id: section.id,
          slug: section.slug,
          name: section.name,
          style: section.style,
          heroImage: section.heroImage || null,
          categories: section.categories,
        },
        categories,
        posts,
        totalPosts,
        currentPage: page,
        totalPages,
      },
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching data at Category page'
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

    throw new Error('Error occurs while fetching data.')
  }
}

CategoryPage.getLayout = function getLayout(page: ReactElement<PageProps>) {
  const { props } = page

  return (
    <LayoutGeneral title={`${props.category.name} - ${props.section.name}`}>
      {page}
    </LayoutGeneral>
  )
}

export default CategoryPage
