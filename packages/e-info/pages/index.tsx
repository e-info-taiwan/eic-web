// under construction

/* eslint-disable no-unused-vars */
// TODO: Remove this eslint-disable when GraphQL queries are migrated to new API

// @ts-ignore: no definition
import errors from '@twreporter/errors'
import type { GetServerSideProps } from 'next'
import { ReactElement } from 'react'
import styled from 'styled-components'

import { getGqlClient } from '~/apollo-client'
import Adsense from '~/components/ad/google-adsense/adsense-ad'
import FeaturedTopicsSection from '~/components/index/featured-topics-section'
import GreenConsumptionSection from '~/components/index/green-consumption-section'
import HighlightSection from '~/components/index/highlight-section'
import Inforgraphic from '~/components/index/inforgraphic'
import type { NavigationCategoryWithArticleCards } from '~/components/index/latest-report-section'
import MainCarousel from '~/components/index/main-carousel'
import NewsSection from '~/components/index/news-section'
import SpecialColumnSection from '~/components/index/special-column-section'
import SupplementSection from '~/components/index/supplement-section'
import LayoutGeneral from '~/components/layout/layout-general'
import AdContent from '~/components/shared/ad-content'
import { DEFAULT_CATEGORY } from '~/constants/constant'
import type { FeaturedCollaboration } from '~/graphql/query/collaboration'
import type { EditorCard } from '~/graphql/query/editor-choice'
import type { Quote } from '~/graphql/query/quote'
import type {
  Ad,
  HomepagePick,
  InfoGraph,
  Section,
  SectionCategory,
  Topic,
} from '~/graphql/query/section'
import {
  homepageAds,
  homepagePicksByCategory,
  homepagePicksForCarousel,
  latestInfoGraph,
  multipleSectionsWithCategoriesAndPosts,
  topicsWithPosts,
} from '~/graphql/query/section'
import useScrollToEnd from '~/hooks/useScrollToEnd'
import type { DataSetItem, FeaturedArticle } from '~/types/component'
import type { CollaborationItem } from '~/types/component'
import { setCacheControl } from '~/utils/common'
import * as gtag from '~/utils/gtag'

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
  topics: Topic[]
  carouselPicks: HomepagePick[]
  highlightPicks: HomepagePick[]
  infoGraph: InfoGraph | null
  ads: Ad[]
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
  supplementCategories,
  columnCategories,
  newsCategories,
  greenCategories,
  topics,
  carouselPicks,
  highlightPicks,
  infoGraph,
  ads,
}) => {
  const anchorRef = useScrollToEnd(() =>
    gtag.sendEvent('homepage', 'scroll', 'scroll to end')
  )

  return (
    <>
      {/* 首頁內容 */}
      <MainCarousel picks={carouselPicks} />
      <HighlightSection picks={highlightPicks} />
      <Inforgraphic infoGraph={infoGraph} />
      <NewsSection categories={newsCategories} />
      <AdContent ads={ads} />
      <SpecialColumnSection categories={columnCategories} />
      <SupplementSection categories={supplementCategories} />
      <FeaturedTopicsSection topics={topics} />
      <AdContent ads={ads} />
      <GreenConsumptionSection categories={greenCategories} />
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
  let topics: Topic[] = []
  let carouselPicks: HomepagePick[] = []
  let highlightPicks: HomepagePick[] = []
  let infoGraph: InfoGraph | null = null
  let ads: Ad[] = []

  try {
    /**
     * 首頁資料查詢優化策略:
     * 1. 使用 Promise.all 並行執行所有查詢
     * 2. 使用 multipleSectionsWithCategoriesAndPosts 合併 4 個 section 查詢為 1 個
     *
     * 原本需要 9 個查詢，優化後減少為 6 個:
     * - 1 個合併的 sections 查詢 (取代原本 4 個分開的 section 查詢)
     * - 2 個 homepagePicks 查詢 (焦點話題 + 輪播大圖)
     * - 1 個 topics 查詢 (深度專題)
     * - 1 個 infoGraphs 查詢 (重要圖表)
     * - 1 個 ads 查詢 (首頁廣告)
     */
    const [
      // 合併查詢: 一次獲取所有 section 資料
      // Section IDs: 3=時事新聞, 4=專欄, 5=副刊, 6=綠色消費
      // 注意: postsPerCategory 統一為 8，因為時事新聞需要 8 篇，其他 section 在前端會自行截取所需數量
      sectionsResult,
      highlightResult,
      topicsResult,
      carouselResult,
      infoGraphResult,
      adsResult,
    ] = await Promise.all([
      // 1. 合併查詢: 一次獲取 4 個大分類的資料
      client.query<{ sections: Section[] }>({
        query: multipleSectionsWithCategoriesAndPosts,
        variables: {
          sectionIds: ['3', '4', '5', '6'],
          postsPerCategory: 8, // 使用最大需求量，前端可自行截取
        },
      }),
      // 2. Fetch highlight section from Homepage Picks (焦點話題)
      client.query<{ homepagePicks: HomepagePick[] }>({
        query: homepagePicksByCategory,
        variables: { categorySlug: 'hottopic' },
      }),
      // 3. Fetch topics (深度專題)
      client.query<{ topics: Topic[] }>({
        query: topicsWithPosts,
        variables: { postsPerTopic: 4 },
      }),
      // 4. Fetch homepage carousel picks (首頁輪播大圖)
      client.query<{ homepagePicks: HomepagePick[] }>({
        query: homepagePicksForCarousel,
      }),
      // 5. Fetch latest InfoGraph (重要圖表)
      client.query<{ infoGraphs: InfoGraph[] }>({
        query: latestInfoGraph,
      }),
      // 6. Fetch homepage ads (首頁廣告)
      client.query<{ ads: Ad[] }>({
        query: homepageAds,
      }),
    ])

    // Process combined sections result
    // 從合併查詢結果中，根據 section id 分配到對應的變數
    if (sectionsResult.errors) {
      console.error(
        errors.helpers.wrap(
          new Error('Errors returned in `sections` query'),
          'GraphQLError',
          'failed to complete `sections`',
          { errors: sectionsResult.errors }
        )
      )
    }
    if (sectionsResult.data?.sections) {
      // 根據 section id 分配資料到對應變數
      // Section ID 對應: 3=時事新聞, 4=專欄, 5=副刊, 6=綠色消費
      for (const section of sectionsResult.data.sections) {
        switch (section.id) {
          case '3': // 時事新聞 (latestnews)
            newsCategories = section.categories
            break
          case '4': // 專欄 (column)
            columnCategories = section.categories
            break
          case '5': // 副刊 (sub)
            supplementCategories = section.categories
            break
          case '6': // 綠色消費 (green)
            greenCategories = section.categories
            break
        }
      }
    }

    // Process highlight section result
    if (highlightResult.errors) {
      console.error(
        errors.helpers.wrap(
          new Error('Errors returned in `homepagePicks` query for highlight'),
          'GraphQLError',
          'failed to complete `homepagePicks` for highlight',
          { errors: highlightResult.errors }
        )
      )
    }
    if (highlightResult.data?.homepagePicks) {
      highlightPicks = highlightResult.data.homepagePicks
    }

    // Process topics result
    if (topicsResult.errors) {
      console.error(
        errors.helpers.wrap(
          new Error('Errors returned in `topics` query'),
          'GraphQLError',
          'failed to complete `topics`',
          { errors: topicsResult.errors }
        )
      )
    }
    if (topicsResult.data?.topics) {
      topics = topicsResult.data.topics
    }

    // Process carousel picks result
    if (carouselResult.errors) {
      console.error(
        errors.helpers.wrap(
          new Error('Errors returned in `homepagePicks` query for carousel'),
          'GraphQLError',
          'failed to complete `homepagePicks` for carousel',
          { errors: carouselResult.errors }
        )
      )
    }
    if (carouselResult.data?.homepagePicks) {
      carouselPicks = carouselResult.data.homepagePicks
    }

    // Process InfoGraph result
    if (infoGraphResult.errors) {
      console.error(
        errors.helpers.wrap(
          new Error('Errors returned in `infoGraphs` query'),
          'GraphQLError',
          'failed to complete `infoGraphs`',
          { errors: infoGraphResult.errors }
        )
      )
    }
    if (infoGraphResult.data?.infoGraphs?.[0]) {
      infoGraph = infoGraphResult.data.infoGraphs[0]
    }

    // Process ads result
    if (adsResult.errors) {
      console.error(
        errors.helpers.wrap(
          new Error('Errors returned in `ads` query'),
          'GraphQLError',
          'failed to complete `ads`',
          { errors: adsResult.errors }
        )
      )
    }
    if (adsResult.data?.ads) {
      ads = adsResult.data.ads
    }
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
      topics,
      carouselPicks,
      highlightPicks,
      infoGraph,
      ads,
    },
  }
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGeneral>{page}</LayoutGeneral>
}

export default Index
