// 列表頁
import errors from '@twreporter/errors'
import axios from 'axios'
import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { getGqlClient } from '~/apollo-client'
import Adsense from '~/components/ad/google-adsense/adsense-ad'
import type { NavigationCategoryWithArticleCards } from '~/components/index/latest-report-section'
import LayoutGeneral from '~/components/layout/layout-general'
import ArticleLists from '~/components/shared/article-lists'
import CategoryNav from '~/components/shared/category-nav'
import SectionHeading from '~/components/shared/section-heading'
import { DEFAULT_CATEGORY } from '~/constants/constant'
import {
  LATEST_POSTS_IN_CATEGORIES_FOR_CATEGORY_PAGE_URL,
  LATEST_POSTS_URL,
} from '~/constants/environment-variables'
import type { Post } from '~/graphql/fragments/post'
import type { Category, CategoryWithoutPosts } from '~/graphql/query/category'
import { categories as categoriesQuery } from '~/graphql/query/category'
import { latestPosts as latestPostsQuery } from '~/graphql/query/post'
import { postStyles } from '~/graphql/query/post'
import useInfiniteScroll from '~/hooks/useInfiniteScroll'
import type { NextPageWithLayout } from '~/pages/_app'
import IconBack from '~/public/icons/arrow_back.svg'
import IconForward from '~/public/icons/arrow_forward.svg'
import type { NavigationCategory } from '~/types/component'
import { setCacheControl } from '~/utils/common'
import * as gtag from '~/utils/gtag'
import { getResizedUrl, postConvertFunc } from '~/utils/post'

const CategoryWrapper = styled.div`
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

const StyledAdsense_HD = styled(Adsense)`
  margin-bottom: 20px;

  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: 60px;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: normal;
  padding: 0 27px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 0 98px;
  }

  // Desktop
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
  color: ${({ theme }) => theme.colors.grayscale[0]};
  margin: 0;

  // Desktop
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

  &::-webkit-scrollbar {
    display: none;
  }

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    width: 100%;
    overflow-x: visible;
    flex-wrap: wrap;
    padding: 0 98px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    width: auto;
    margin-top: 0;
    padding: 0 58px;
  }
`

const CategoryTab = styled.button`
  background: none;
  border: none;
  color: #373740;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  cursor: pointer;
  transition: color 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[20]};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary[20]};
  }
`

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 13px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
  }
`

const BackForwardButton = styled.button`
  display: flex;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;

  > svg {
    width: 25px;
    height: 25px;
  }

  // Tablet, Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
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
  $isNavigation?: boolean
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

  &:hover {
    background: ${({ theme }) => theme.colors.primary[20]};
    border-color: ${({ theme }) => theme.colors.primary[20]};
    color: #fff;
  }

  // Tablet, Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    min-width: 36px;
    height: 36px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 18px;
  }

  &:disabled {
    opacity: 0.5;
  }

  ${({ $isNavigation }) =>
    $isNavigation &&
    `
    padding: 0 12px;
    font-weight: 600;
  `}
`

const PaginationEllipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  color: ${({ theme }) => theme.colors.primary[20]};
  font-size: 14px;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    min-width: 48px;
    height: 48px;
    font-size: 16px;
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #000;
  margin: 20px 28px 24px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    margin-top: 24px;
    margin-left: 98px;
    margin-right: 98px;
    margin-bottom: 24px;
  }
  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    margin-top: 28px;
    margin-left: 58px;
    margin-right: 58px;
    margin-bottom: 28px;
  }
`

type PageProps = {
  categories: NavigationCategoryWithArticleCards[]
  categoriesWithoutPosts: CategoryWithoutPosts[]
  latest: NavigationCategoryWithArticleCards
}

const Category: NextPageWithLayout<PageProps> = ({ categories, latest }) => {
  //update title by router.query.slug
  const router = useRouter()
  const slug = router?.query?.slug
  const client = getGqlClient()

  const [sectionTitle, setSectionTitle] = useState('所有報導')

  const [activeCategory, setActiveCategory] =
    useState<NavigationCategory>(DEFAULT_CATEGORY)

  useEffect(() => {
    const matchedItem = categories.find((category) => category.slug === slug)

    if (matchedItem) {
      setActiveCategory(matchedItem)
      setSectionTitle(
        matchedItem.slug === 'all' ? '所有報導' : `所有${matchedItem.title}報導`
      )
    }
  }, [categories, slug])

  const updateActiveCategory = (category: NavigationCategory) => {
    router.push(`/category/${category.slug}`, undefined, { shallow: true })
    setActiveCategory(category)
    setSectionTitle(
      category.slug === 'all' ? '所有報導' : `所有${category.title}報導`
    )
    // setIsAtBottom(false) //infinite scroll: reset `isAtBottom` to false when change category
    gtag.sendEvent('listing', 'click', `listing-${category.title}`)
  }

  //render posts based on `currentItem`
  const [categoryPosts, setCategoryPosts] = useState(categories)
  const [allPosts, setAllPosts] = useState(latest)

  const currentItem: NavigationCategoryWithArticleCards | undefined =
    activeCategory?.slug === 'all'
      ? allPosts
      : categoryPosts.find((category) => category.slug === activeCategory.slug)

  //infinite scroll: check number of posts yet to be displayed.
  //if number = 0, means all posts are displayed, observer.unobserve.
  const [dataAmount, setDataAmount] = useState(0)

  //infinite scroll: fetch more latest 12 posts
  const fetchMoreLatestPosts = async () => {
    try {
      const variables: {
        first: number
        skip?: number
      } = {
        first: 12,
        skip: currentItem?.posts?.length,
      }

      const {
        data: { latestPosts },
        errors: gqlErrors,
      } = await client.query<{ latestPosts: Post[] }>({
        query: latestPostsQuery,
        variables,
      })

      if (gqlErrors) {
        const annotatingError = errors.helpers.wrap(
          new Error('Errors returned in `latestPosts` query'),
          'GraphQLError',
          'failed to complete `latestPosts`',
          { errors: gqlErrors }
        )

        throw annotatingError
      }

      const newPosts = [
        ...(allPosts.posts ?? []),
        ...latestPosts.map(postConvertFunc),
      ]
      setDataAmount(latestPosts.length) //number of posts yet to be displayed.

      setAllPosts({
        ...allPosts,
        posts: newPosts,
      })
    } catch (err) {
      console.log(err)
    }
  }

  //infinite scroll: fetch more specific category related 12 posts
  const fetchMoreCategoryPosts = async (
    activeCategory: NavigationCategoryWithArticleCards
  ) => {
    try {
      {
        const {
          data: { categories },
          error: gqlErrors,
        } = await client.query<{
          categories: Category[]
        }>({
          query: categoriesQuery,
          variables: {
            relatedPostFirst: 12,
            shouldQueryRelatedPost: true,
            shouldQueryRelatedReport: false,
            relatedPostTypes: postStyles,
            slug: activeCategory?.slug,
            postSkip: currentItem?.posts?.length,
          },
        })

        if (gqlErrors) {
          const annotatingError = errors.helpers.wrap(
            new Error('Errors returned in `categories` query'),
            'GraphQLError',
            'failed to complete `categories`',
            { errors: gqlErrors }
          )

          throw annotatingError
        }

        const newPosts = categories[0]?.posts?.map(postConvertFunc) || []

        setDataAmount(newPosts.length) //number of posts yet to be displayed.

        setCategoryPosts(
          categoryPosts.map((category) =>
            category.slug === activeCategory.slug
              ? { ...category, posts: [...(category.posts ?? []), ...newPosts] }
              : category
          )
        )
      }
    } catch (err) {
      console.log(err)
    }
  }

  // infinite scroll
  // const [ref, isAtBottom, setIsAtBottom] = useInfiniteScroll({
  //   amount: dataAmount,
  //   dependency: activeCategory.slug,
  // })

  // useEffect(() => {
  //   if (isAtBottom) {
  //     activeCategory.slug === 'all'
  //       ? fetchMoreLatestPosts()
  //       : fetchMoreCategoryPosts(activeCategory)
  //   }
  // }, [isAtBottom])

  return (
    <CategoryWrapper aria-label={sectionTitle}>
      {/* <StyledAdsense_HD pageKey={activeCategory.slug} adKey="HD" /> */}
      {/* <SectionHeading
        title={sectionTitle}
        highlightColor="#eee500"
        headingLevel={2}
        categorySlug={activeCategory.slug}
      />
      <CategoryNav
        currentCategorySlug={activeCategory.slug}
        categoryClickHandler={updateActiveCategory}
      /> */}

      <Header>
        <AccentBar />
        <Title>{sectionTitle}</Title>
      </Header>
      <CategoryTabs>
        <CategoryTab>分類標題1</CategoryTab>
        <CategoryTab>分類標題2</CategoryTab>
        <CategoryTab>分類標題3</CategoryTab>
        <CategoryTab>分類標題4</CategoryTab>
        <CategoryTab>分類標題5</CategoryTab>
        <CategoryTab>分類標題6</CategoryTab>
        <CategoryTab>分類標題7</CategoryTab>
        <CategoryTab>分類標題8</CategoryTab>
        <CategoryTab>分類標題9</CategoryTab>
        <CategoryTab>分類標題10</CategoryTab>
      </CategoryTabs>
      <Divider />

      <ArticleWrapper>
        <ArticleLists
          posts={currentItem?.posts}
          AdPageKey={activeCategory.slug}
        />
      </ArticleWrapper>
      {/* Pagination */}
      <PaginationWrapper>
        <BackForwardButton>
          <IconBack />
        </BackForwardButton>
        <PaginationButton $isActive>01</PaginationButton>
        <PaginationButton>02</PaginationButton>
        <PaginationButton>03</PaginationButton>
        <PaginationEllipsis>......</PaginationEllipsis>
        <PaginationButton>15</PaginationButton>
        <BackForwardButton>
          <IconForward />
        </BackForwardButton>
      </PaginationWrapper>
      {/* <span ref={ref} id="scroll-to-bottom-anchor" /> */}
    </CategoryWrapper>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  res,
}) => {
  setCacheControl(res)

  let categories: NavigationCategoryWithArticleCards[] = []
  let latest: NavigationCategoryWithArticleCards = {
    id: DEFAULT_CATEGORY.id,
    title: DEFAULT_CATEGORY.title,
    slug: DEFAULT_CATEGORY.slug,
  }
  let categoriesWithoutPosts: CategoryWithoutPosts[] = []

  try {
    {
      // fetch categories and related 12 posts
      const response = await axios.get<{ categories: Category[] }>(
        LATEST_POSTS_IN_CATEGORIES_FOR_CATEGORY_PAGE_URL
      )
      let data = response.data

      categories = data.categories.map((category) => {
        const posts = category.posts

        return {
          id: category.id,
          title: category.title,
          slug: category.slug,
          posts: posts?.map(postConvertFunc),
        }
      })

      // data for open graph
      categoriesWithoutPosts = data.categories.map((category) => {
        return {
          id: category.id,
          title: category.title,
          slug: category.slug,
          ogImage: category.ogImage,
          ogDescription: category.ogDescription,
        }
      })
    }

    {
      // fetch latest 12 posts
      const response = await axios.get<{ posts: Post[] }>(LATEST_POSTS_URL)
      const { posts } = response.data
      // since the json is shared with the homepage latest, here we only take 12 posts
      let latestPosts = posts.slice(0, 12)

      latest.posts = latestPosts.map(postConvertFunc)
      latest.reports = []
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching data at Category page'
    )

    // All exceptions that include a stack trace will be
    // integrated with Error Reporting.
    // See https://cloud.google.com/run/docs/error-reporting
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

  return {
    props: {
      categories,
      categoriesWithoutPosts,
      latest,
    },
  }
}

Category.getLayout = function getLayout(page: ReactElement<PageProps>) {
  const { props } = page

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter()
  const slug = router?.query?.slug

  const allCategoryOG = {
    title: '所有',
    ogImage: null, // show default og image
    ogDescription: null, // show default og desc
  }

  const currentCategory =
    slug === 'all'
      ? allCategoryOG
      : props.categoriesWithoutPosts.find((category) => category.slug === slug)

  const ogImageUrl = getResizedUrl(currentCategory?.ogImage?.resized)
  const ogDescription = currentCategory?.ogDescription ?? undefined

  return (
    <LayoutGeneral
      title={`${currentCategory?.title}報導`}
      description={ogDescription}
      imageUrl={ogImageUrl}
    >
      {page}
    </LayoutGeneral>
  )
}

export default Category
