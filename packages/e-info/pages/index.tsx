// under construction

/* eslint-disable no-unused-vars */
// TODO: Remove this eslint-disable when GraphQL queries are migrated to new API

// @ts-ignore: no definition
import errors from '@twreporter/errors'
import axios from 'axios'
import type { GetServerSideProps } from 'next'
import { ReactElement } from 'react'
import styled from 'styled-components'

import { getGqlClient } from '~/apollo-client'
import Adsense from '~/components/ad/google-adsense/adsense-ad'
import CollaborationSection from '~/components/index/collaboration-section'
import EditorChoiceSection from '~/components/index/editor-choice-section'
import FeatureSection from '~/components/index/feature-section'
import FeaturedTopicsSection from '~/components/index/featured-topics-section'
import GreenConsumptionSection from '~/components/index/green-consumption-section'
import HighlightSection from '~/components/index/highlight-section'
import Inforgraphic from '~/components/index/inforgraphic'
import type { NavigationCategoryWithArticleCards } from '~/components/index/latest-report-section'
import LatestReportSection from '~/components/index/latest-report-section'
import MainCarousel from '~/components/index/main-carousel'
import NewsSection from '~/components/index/news-section'
import OpenDataSection from '~/components/index/open-data-section'
import SpecialColumnSection from '~/components/index/special-column-section'
import SupplementSection from '~/components/index/supplement-section'
import LayoutGeneral from '~/components/layout/layout-general'
import AdContent from '~/components/shared/ad-content'
import Placeholder from '~/components/shared/placeholder'
import { DEFAULT_CATEGORY } from '~/constants/constant'
import {
  LATEST_POSTS_IN_CATEGORIES_URL,
  LATEST_POSTS_URL,
} from '~/constants/environment-variables'
import type { Post } from '~/graphql/fragments/post'
import type { Category } from '~/graphql/query/category'
import type {
  Collaboration,
  FeaturedCollaboration,
} from '~/graphql/query/collaboration'
import { collaborations as collaborationsQuery } from '~/graphql/query/collaboration'
import { featuredCollaborations as featuredCollaborationsQuery } from '~/graphql/query/collaboration'
// TODO: Re-enable when migrating to new API
// import type { DataSetWithCount } from '~/graphql/query/dataset'
// import { dataSets as dataSetsQuery } from '~/graphql/query/dataset'
import type { EditorChoice } from '~/graphql/query/editor-choice'
import type { EditorCard } from '~/graphql/query/editor-choice'
import { editorChoices as editorChoicesQuery } from '~/graphql/query/editor-choice'
import type { Feature } from '~/graphql/query/feature'
import { features as featuresQuery } from '~/graphql/query/feature'
import type { Quote } from '~/graphql/query/quote'
import { quotes as quotesQuery } from '~/graphql/query/quote'
import type { Section, SectionCategory } from '~/graphql/query/section'
import { sectionWithCategoriesAndPosts } from '~/graphql/query/section'
import useScrollToEnd from '~/hooks/useScrollToEnd'
import { ValidPostStyle } from '~/types/common'
import type { DataSetItem, FeaturedArticle } from '~/types/component'
import type { CollaborationItem } from '~/types/component'
import { setCacheControl } from '~/utils/common'
// TODO: Re-enable when migrating to new API
// import { convertDataSet } from '~/utils/data-set'
import * as gtag from '~/utils/gtag'
import { sortByTimeStamp } from '~/utils/index'
import { convertPostToArticleCard } from '~/utils/post'
import { postConvertFunc } from '~/utils/post'

import type { NextPageWithLayout } from './_app'

type PageProps = {
  editorChoices: EditorCard[]
  categories: NavigationCategoryWithArticleCards[]
  latest: NavigationCategoryWithArticleCards
  features: FeaturedArticle[]
  quotes?: Quote[]
  collaborations: CollaborationItem[]
  featuredCollaboration: FeaturedCollaboration
  dataSetItems: DataSetItem[]
  dataSetCount: number
  supplementCategories: SectionCategory[]
  columnCategories: SectionCategory[]
  newsCategories: SectionCategory[]
  greenCategories: SectionCategory[]
}

const HiddenAnchor = styled.div`
  display: block;
  width: 100%;
  height: 0;
  padding: 0;
  margin: 0;
`

const StyledAdsense_HD = styled(Adsense)`
  margin-bottom: 40px;
`

const StyledAdsense_FT = styled(Adsense)`
  margin-bottom: 40px;

  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: 60px;
  }
`

const Index: NextPageWithLayout<PageProps> = ({
  editorChoices,
  categories,
  latest,
  features,
  quotes,
  collaborations,
  featuredCollaboration,
  dataSetItems,
  dataSetCount,
  supplementCategories,
  columnCategories,
  newsCategories,
  greenCategories,
}) => {
  const anchorRef = useScrollToEnd(() =>
    gtag.sendEvent('homepage', 'scroll', 'scroll to end')
  )

  const shouldShowEditorChoiceSection = editorChoices.length > 0
  const shouldShowLatestReportSection = categories.length > 0
  const shouldShowFeatureSection = features.length > 0
  const shouldShowCollaborationSection = collaborations.length > 0

  return (
    <>
      {/* 首頁內容 */}

      {/* Demo - begin */}
      <MainCarousel />
      <HighlightSection />
      <Inforgraphic />
      <NewsSection categories={newsCategories} />
      <AdContent />
      <SpecialColumnSection categories={columnCategories} />
      <SupplementSection categories={supplementCategories} />
      <FeaturedTopicsSection />
      <AdContent />
      <GreenConsumptionSection categories={greenCategories} />
      {/* Demo - end */}

      {/* {shouldShowEditorChoiceSection && (
        <EditorChoiceSection posts={editorChoices} />
      )}

      <StyledAdsense_HD pageKey="home" adKey="HD" />

      {shouldShowLatestReportSection && (
        <LatestReportSection categories={categories} latest={latest} />
      )}
      {shouldShowFeatureSection && <FeatureSection posts={features} />}
      {shouldShowCollaborationSection && (
        <CollaborationSection
          quotes={quotes}
          items={collaborations}
          featured={featuredCollaboration}
        />
      )}
      <StyledAdsense_FT pageKey="home" adKey="FT" />
      <OpenDataSection items={dataSetItems} totalCount={dataSetCount} /> */}
      <HiddenAnchor ref={anchorRef} />
    </>
  )
}

// this is not actually random, but can meet the need
// see: https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
function arrayRandomFilter<T>(arr: T[] = [], targetSize: number = 0): T[] {
  const shuffledArr = arr.sort(() => 0.5 - Math.random())
  return shuffledArr.slice(0, targetSize)
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  res,
}) => {
  setCacheControl(res)

  const client = getGqlClient()

  let editorChoices: EditorCard[] = []
  let categories: NavigationCategoryWithArticleCards[] = []
  let latest: NavigationCategoryWithArticleCards = {
    id: DEFAULT_CATEGORY.id,
    title: DEFAULT_CATEGORY.title,
    slug: DEFAULT_CATEGORY.slug,
  }
  let features: FeaturedArticle[] = []
  let quotes: Quote[] = []
  let collaborations: CollaborationItem[] = []
  let featuredCollaboration: FeaturedCollaboration = {
    id: '',
    name: '',
    collabLink: '',
    bannerDesktop: null,
    bannerTablet: null,
    bannerMobile: null,
  }
  let dataSetItems: DataSetItem[] = []
  let dataSetCount: number = 0
  let supplementCategories: SectionCategory[] = []
  let columnCategories: SectionCategory[] = []
  let newsCategories: SectionCategory[] = []
  let greenCategories: SectionCategory[] = []

  try {
    // Fetch news section (Section ID: 3 = 時事新聞)
    {
      const { data, errors: gqlErrors } = await client.query<{
        sections: Section[]
      }>({
        query: sectionWithCategoriesAndPosts,
        variables: {
          sectionId: '3',
          postsPerCategory: 8,
        },
      })

      if (gqlErrors) {
        const annotatingError = errors.helpers.wrap(
          new Error('Errors returned in `sections` query for news'),
          'GraphQLError',
          'failed to complete `sections` for news',
          { errors: gqlErrors }
        )
        console.error(annotatingError)
      }

      if (data?.sections?.[0]?.categories) {
        newsCategories = data.sections[0].categories
      }
    }

    // Fetch column section (Section ID: 4 = 專欄)
    {
      const { data, errors: gqlErrors } = await client.query<{
        sections: Section[]
      }>({
        query: sectionWithCategoriesAndPosts,
        variables: {
          sectionId: '4',
          postsPerCategory: 6,
        },
      })

      if (gqlErrors) {
        const annotatingError = errors.helpers.wrap(
          new Error('Errors returned in `sections` query for column'),
          'GraphQLError',
          'failed to complete `sections` for column',
          { errors: gqlErrors }
        )
        console.error(annotatingError)
      }

      if (data?.sections?.[0]?.categories) {
        columnCategories = data.sections[0].categories
      }
    }

    // Fetch supplement section (Section ID: 5 = 副刊)
    {
      const { data, errors: gqlErrors } = await client.query<{
        sections: Section[]
      }>({
        query: sectionWithCategoriesAndPosts,
        variables: {
          sectionId: '5',
          postsPerCategory: 3,
        },
      })

      if (gqlErrors) {
        const annotatingError = errors.helpers.wrap(
          new Error('Errors returned in `sections` query'),
          'GraphQLError',
          'failed to complete `sections`',
          { errors: gqlErrors }
        )
        console.error(annotatingError)
      }

      if (data?.sections?.[0]?.categories) {
        supplementCategories = data.sections[0].categories
      }
    }

    // Fetch green consumption section (Section ID: 6 = 綠色消費)
    {
      const { data, errors: gqlErrors } = await client.query<{
        sections: Section[]
      }>({
        query: sectionWithCategoriesAndPosts,
        variables: {
          sectionId: '6',
          postsPerCategory: 3,
        },
      })

      if (gqlErrors) {
        const annotatingError = errors.helpers.wrap(
          new Error('Errors returned in `sections` query for green'),
          'GraphQLError',
          'failed to complete `sections` for green',
          { errors: gqlErrors }
        )
        console.error(annotatingError)
      }

      if (data?.sections?.[0]?.categories) {
        greenCategories = data.sections[0].categories
      }
    }
    // TODO: Temporarily disabled until GraphQL queries are migrated to new API
    /*
    {
      // fetch editor choice data
      const { data, errors: gqlErrors } = await client.query<{
        editorChoices: EditorChoice[]
      }>({
        query: editorChoicesQuery,
      })

      if (gqlErrors) {
        const annotatingError = errors.helpers.wrap(
          new Error('Errors returned in `editorChoices` query'),
          'GraphQLError',
          'failed to complete `editorChoices`',
          { errors: gqlErrors }
        )

        throw annotatingError
      }

      editorChoices = data.editorChoices.map((editorChoice) => {
        if (editorChoice.choices) {
          const { heroImage, ogImage } = editorChoice.choices ?? {}

          const images =
            editorChoice.heroImage?.resized ??
            ogImage?.resized ??
            heroImage?.resized ??
            {}

          const imagesWebP =
            editorChoice.heroImage?.resizedWebp ??
            ogImage?.resizedWebp ??
            heroImage?.resizedWebp ??
            {}

          const choices = {
            ...convertPostToArticleCard(
              editorChoice?.choices,
              images,
              imagesWebP
            ),
            shouldHideBottomInfos: false,
          }

          return choices
        } else {
          const externalLinkEditorChoice = {
            id: editorChoice.id ?? 'default-uid-undefined--no-id',
            title: editorChoice.name ?? '',
            href: editorChoice.link ?? '/',
            date: 'Invalid Date',
            isReport: false,
            images: editorChoice.heroImage?.resized ?? {},
            imagesWebP: editorChoice.heroImage?.resizedWebp ?? {},
            readTimeText: '閱讀時間 10 分鐘',
            shouldHideBottomInfos: true,
          }

          return externalLinkEditorChoice
        }
      })
    }
    */
    // TODO: Temporarily disabled until GraphQL queries are migrated to new API
    /*
    {
      {
        // fetch categories and related latest reports
        let data: { categories: Category[] }
        const response = await axios.get<{ categories: Category[] }>(
          LATEST_POSTS_IN_CATEGORIES_URL
        )
        data = response.data

        const sortedCategories =
          sortByTimeStamp(data.categories) || data.categories || []

        categories = sortedCategories.map((category) => {
          const reports = category.reports?.map(postConvertFunc)

          const posts =
            category.posts?.length && !reports?.length
              ? category.posts
              : category.posts?.slice(0, 4)

          return {
            id: category.id,
            title: category.title,
            slug: category.slug,
            posts: posts?.map(postConvertFunc),
            reports,
          }
        })
      }

      {
        // fetch uncategorized latest reports

        const response = await axios.get<{ posts: Post[] }>(LATEST_POSTS_URL)
        const { posts: latestPosts } = response.data

        const { posts, reports } = latestPosts.reduce(
          ({ posts, reports }, latestPost) => {
            if (latestPost.style === ValidPostStyle.NEWS) {
              posts.push(latestPost)
            } else {
              reports.push(latestPost)
            }
            return { posts, reports }
          },
          {
            posts: [] as Post[],
            reports: [] as Post[],
          }
        )

        if (reports.length) {
          latest.reports = [postConvertFunc(reports[0])]
        }

        latest.posts = (reports.length ? posts.slice(0, 4) : posts).map(
          postConvertFunc
        )
      }
    }
    */
    // TODO: Temporarily disabled until GraphQL queries are migrated to new API
    /*
    {
      // fetch featured post data
      const { data, errors: gqlErrors } = await client.query<{
        features: Feature[]
      }>({
        query: featuresQuery,
      })

      if (gqlErrors) {
        const annotatingError = errors.helpers.wrap(
          new Error('Errors returned in `features` query'),
          'GraphQLError',
          'failed to complete `features`',
          { errors: gqlErrors }
        )

        throw annotatingError
      }

      features = arrayRandomFilter(data.features, 4).map((feature) => {
        const { description } = feature
        const { subtitle = '', heroImage, ogImage } = feature.featurePost ?? {}

        const images = ogImage?.resized ?? heroImage?.resized ?? {}
        const imagesWebP = ogImage?.resized ?? heroImage?.resized ?? {}

        const article = convertPostToArticleCard(
          feature?.featurePost,
          images,
          imagesWebP
        )

        return {
          ...article,
          subtitle,
          description,
        }
      })
    }
    */
    /**
     * this section is disabled since <CollaborationQuoteSlider /> is replaced by <CollaborationHighlight />,
     * see <CollaborationSection />
    {
      // fetch quote data
      const { data, errors: gqlErrors } = await client.query<{
        quotes: Quote[]
      }>({
        query: quotesQuery,
      })

      if (gqlErrors) {
        const annotatingError = errors.helpers.wrap(
          new Error('Errors returned in `quotes` query'),
          'GraphQLError',
          'failed to complete `quotes`',
          { errors: gqlErrors }
        )

        throw annotatingError
      }

      quotes = data.quotes
    }
    */
    // TODO: Temporarily disabled until GraphQL queries are migrated to new API
    /*
    {
      // fetch collaboration items
      const { data, errors: gqlErrors } = await client.query<{
        collaborations: Collaboration[]
      }>({
        query: collaborationsQuery,
      })

      if (gqlErrors) {
        const annotatingError = errors.helpers.wrap(
          new Error('Errors returned in `collaborations` query'),
          'GraphQLError',
          'failed to complete `collaborations`',
          { errors: gqlErrors }
        )

        throw annotatingError
      }

      collaborations = data.collaborations.map((collaboration) => {
        const {
          id,
          title = '',
          description,
          progress,
          achvLink,
          collabLink,
          requireTime,
          endTime,
          heroImage,
        } = collaboration

        return {
          id,
          title,
          description,
          progress,
          achvLink,
          collabLink,
          requireTime,
          endTime,
          images: heroImage?.resized ?? {},
          imagesWebP: heroImage?.resizedWebp ?? {},
        }
      })
    }
    */
    // TODO: Temporarily disabled until GraphQL queries are migrated to new API
    /*
    {
      // fetch featured collaboration (collaboration banner)
      const { data, errors: gqlErrors } = await client.query<{
        collaborations: FeaturedCollaboration[]
      }>({
        query: featuredCollaborationsQuery,
      })

      if (gqlErrors) {
        const annotatingError = errors.helpers.wrap(
          new Error('Errors returned in `collaborations` query'),
          'GraphQLError',
          'failed to complete `collaborations`',
          { errors: gqlErrors }
        )

        throw annotatingError
      }

      featuredCollaboration = data.collaborations[0] ?? {}
    }
    */
    // TODO: Temporarily disabled until GraphQL queries are migrated to new API
    /*
    {
      // fetch open data items
      const { data, error: gqlErrors } = await client.query<DataSetWithCount>({
        query: dataSetsQuery,
        variables: {
          first: 3,
          shouldQueryCount: true,
        },
      })

      if (gqlErrors) {
        const annotatingError = errors.helpers.wrap(
          new Error('Errors returned in `dataSets` query'),
          'GraphQLError',
          'failed to complete `dataSets`',
          { errors: gqlErrors }
        )

        throw annotatingError
      }

      const { dataSets, count } = data
      dataSetItems = dataSets.map(convertDataSet)
      dataSetCount = count ?? dataSetItems.length
    }
    */
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching data at Index page'
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
      editorChoices,
      categories,
      latest,
      features,
      quotes,
      collaborations,
      featuredCollaboration,
      dataSetItems,
      dataSetCount,
      supplementCategories,
      columnCategories,
      newsCategories,
      greenCategories,
    },
  }
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGeneral>{page}</LayoutGeneral>
}

export default Index
