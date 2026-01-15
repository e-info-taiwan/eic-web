// under construction

/* eslint-disable no-unused-vars */
// TODO: Remove this eslint-disable when GraphQL queries are migrated to new API

// @ts-ignore: no definition
import errors from '@twreporter/errors'
import type { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { ReactElement } from 'react'
import styled from 'styled-components'

import { getGqlClient } from '~/apollo-client'
import Adsense from '~/components/ad/google-adsense/adsense-ad'
import HighlightSection from '~/components/index/highlight-section'
import Inforgraphic from '~/components/index/inforgraphic'
import type { NavigationCategoryWithArticleCards } from '~/components/index/latest-report-section'
import MainCarousel from '~/components/index/main-carousel'
import LayoutGeneral from '~/components/layout/layout-general'
import AdContent from '~/components/shared/ad-content'
import { DEFAULT_CATEGORY } from '~/constants/constant'
import type { FeaturedCollaboration } from '~/graphql/query/collaboration'
import type { EditorCard } from '~/graphql/query/editor-choice'
import type { Quote } from '~/graphql/query/quote'
import type {
  Ad,
  HomepagePick,
  HomepagePickCarousel,
  InfoGraph,
  SectionCategory,
  Topic,
} from '~/graphql/query/section'
import useScrollToEnd from '~/hooks/useScrollToEnd'
import type { DataSetItem, FeaturedArticle } from '~/types/component'
import type { CollaborationItem } from '~/types/component'
import { setCacheControl } from '~/utils/common'
import * as gtag from '~/utils/gtag'
import { fetchHomepageData } from '~/utils/homepage-api'

import type { NextPageWithLayout } from './_app'

// Below-the-fold 區塊使用動態載入以減少初始 bundle 大小
const NewsSection = dynamic(() => import('~/components/index/news-section'), {
  ssr: true,
})
const SpecialColumnSection = dynamic(
  () => import('~/components/index/special-column-section'),
  { ssr: true }
)
const SupplementSection = dynamic(
  () => import('~/components/index/supplement-section'),
  { ssr: true }
)
const FeaturedTopicsSection = dynamic(
  () => import('~/components/index/featured-topics-section'),
  { ssr: true }
)
const GreenConsumptionSection = dynamic(
  () => import('~/components/index/green-consumption-section'),
  { ssr: true }
)
const HotKeywordsSection = dynamic(
  () => import('~/components/index/hot-keywords-section'),
  { ssr: true }
)

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
  carouselPicks: HomepagePickCarousel[]
  highlightPicks: HomepagePick[]
  infoGraph: InfoGraph | null
  ads: Ad[]
  deepTopicAds: Ad[]
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
  deepTopicAds,
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
      <AdContent ads={deepTopicAds} />
      <GreenConsumptionSection categories={greenCategories} />
      <HotKeywordsSection />
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
  let carouselPicks: HomepagePickCarousel[] = []
  let highlightPicks: HomepagePick[] = []
  let infoGraph: InfoGraph | null = null
  let ads: Ad[] = []
  let deepTopicAds: Ad[] = []

  try {
    /**
     * 首頁資料獲取策略:
     * 1. 優先嘗試 JSON API (單一請求獲取所有資料)
     * 2. 若 JSON API 失敗，自動 fallback 到 GraphQL 查詢
     *
     * JSON API endpoint: /api/homepage
     * 詳細規格請參考: docs/homepage-api-spec.md
     */
    const homepageData = await fetchHomepageData(client)

    // 從統一的資料結構中取出各區塊資料
    newsCategories = homepageData.newsCategories
    columnCategories = homepageData.columnCategories
    supplementCategories = homepageData.supplementCategories
    greenCategories = homepageData.greenCategories
    highlightPicks = homepageData.highlightPicks
    carouselPicks = homepageData.carouselPicks
    topics = homepageData.topics
    infoGraph = homepageData.infoGraph
    ads = homepageData.ads
    deepTopicAds = homepageData.deepTopicAds
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
      deepTopicAds,
    },
  }
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGeneral>{page}</LayoutGeneral>
}

export default Index
