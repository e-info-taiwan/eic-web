// under construction

/* eslint-disable no-unused-vars */
// TODO: Remove this eslint-disable when GraphQL queries are migrated to new API

// @ts-ignore: no definition
import errors from '@twreporter/errors'
import type { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'

import { getGqlClient } from '~/apollo-client'
import LayoutGeneral from '~/components/layout/layout-general'
import AdContent from '~/components/shared/ad-content'
import DonationModal from '~/components/shared/donation-modal'
import { DEFAULT_CATEGORY } from '~/constants/constant'
import type { HeaderContextData } from '~/contexts/header-context'
import type { FeaturedCollaboration } from '~/graphql/query/collaboration'
import { type Donation, donationQuery } from '~/graphql/query/donation'
import type { EditorCard } from '~/graphql/query/editor-choice'
import type { Quote } from '~/graphql/query/quote'
import type {
  Ad,
  HomepagePick,
  HomepagePickCarousel,
  InfoGraph,
  PopularSearchKeyword,
  Topic,
} from '~/graphql/query/section'
import useScrollToEnd from '~/hooks/useScrollToEnd'
import type { NavigationCategoryWithArticleCards } from '~/types/component'
import type { DataSetItem, FeaturedArticle } from '~/types/component'
import type { CollaborationItem } from '~/types/component'
import * as gtag from '~/utils/gtag'
import { fetchHeaderData } from '~/utils/header-data'
import {
  type SectionInfo,
  fetchHomepageData,
  fetchPopularSearchKeywords,
} from '~/utils/homepage-api'

import type { NextPageWithLayout } from './_app'

// 關閉 SSR 避免 hydration 錯誤（react-slick 和 @readr-media/react-image）
const MainCarousel = dynamic(() => import('~/components/index/main-carousel'), {
  ssr: false,
})
const HighlightSection = dynamic(
  () => import('~/components/index/highlight-section'),
  { ssr: false }
)
const Inforgraphic = dynamic(() => import('~/components/index/inforgraphic'), {
  ssr: false,
})

// Below-the-fold 區塊使用動態載入（關閉 SSR 避免 hydration 錯誤）
const NewsSection = dynamic(() => import('~/components/index/news-section'), {
  ssr: false,
})
const SpecialColumnSection = dynamic(
  () => import('~/components/index/special-column-section'),
  { ssr: false }
)
const SupplementSection = dynamic(
  () => import('~/components/index/supplement-section'),
  { ssr: false }
)
const FeaturedTopicsSection = dynamic(
  () => import('~/components/index/featured-topics-section'),
  { ssr: false }
)
const GreenConsumptionSection = dynamic(
  () => import('~/components/index/green-consumption-section'),
  { ssr: false }
)
const HotKeywordsSection = dynamic(
  () => import('~/components/index/hot-keywords-section'),
  { ssr: false }
)

type PageProps = {
  headerData: HeaderContextData
  editorChoices: EditorCard[]
  categories: NavigationCategoryWithArticleCards[]
  latest: NavigationCategoryWithArticleCards
  features: FeaturedArticle[]
  quotes?: Quote[]
  collaborations: CollaborationItem[]
  featuredCollaboration: FeaturedCollaboration
  dataSetItems: DataSetItem[]
  dataSetCount: number
  newsSection: SectionInfo
  columnSection: SectionInfo
  supplementSection: SectionInfo
  greenSection: SectionInfo
  topics: Topic[]
  carouselPicks: HomepagePickCarousel[]
  highlightPicks: HomepagePick[]
  infoGraph: InfoGraph | null
  ads: Ad[]
  deepTopicAds: Ad[]
  donation: Donation | null
  popularSearchKeywords: PopularSearchKeyword[]
}

const HiddenAnchor = styled.div`
  display: block;
  width: 100%;
  height: 0;
  padding: 0;
  margin: 0;
`

// localStorage key for tracking dismissed donation modal
const DONATION_MODAL_DISMISSED_KEY = 'donation_modal_dismissed_id'

const Index: NextPageWithLayout<PageProps> = ({
  newsSection,
  columnSection,
  supplementSection,
  greenSection,
  topics,
  carouselPicks,
  highlightPicks,
  infoGraph,
  ads,
  deepTopicAds,
  donation,
  popularSearchKeywords,
}) => {
  const [showDonationModal, setShowDonationModal] = useState(false)

  const anchorRef = useScrollToEnd(() =>
    gtag.sendEvent('homepage', 'scroll', 'scroll to end')
  )

  // Check if donation modal should be shown on first visit
  useEffect(() => {
    if (!donation) return

    const dismissedId = localStorage.getItem(DONATION_MODAL_DISMISSED_KEY)

    // Show modal if current donation ID differs from dismissed ID
    if (dismissedId !== donation.id) {
      setShowDonationModal(true)
    }
  }, [donation])

  // Handle donation modal close
  const handleDonationModalClose = () => {
    if (donation) {
      localStorage.setItem(DONATION_MODAL_DISMISSED_KEY, donation.id)
    }
    setShowDonationModal(false)
  }

  return (
    <>
      {/* 首頁內容 */}
      <MainCarousel picks={carouselPicks} />
      <HighlightSection picks={highlightPicks} />
      <Inforgraphic infoGraph={infoGraph} />
      <NewsSection section={newsSection} />
      <AdContent ads={ads} />
      <SpecialColumnSection section={columnSection} />
      <SupplementSection section={supplementSection} />
      <FeaturedTopicsSection topics={topics} />
      <AdContent ads={deepTopicAds} />
      <GreenConsumptionSection section={greenSection} />
      <HotKeywordsSection keywords={popularSearchKeywords} />
      <HiddenAnchor ref={anchorRef} />

      {/* Donation Modal - shown on first visit */}
      <DonationModal
        isOpen={showDonationModal}
        onClose={handleDonationModalClose}
        donation={donation}
      />
    </>
  )
}

// this is not actually random, but can meet the need
// see: https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
function arrayRandomFilter<T>(arr: T[] = [], targetSize: number = 0): T[] {
  const shuffledArr = arr.sort(() => 0.5 - Math.random())
  return shuffledArr.slice(0, targetSize)
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
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
  let topics: Topic[] = []
  let carouselPicks: HomepagePickCarousel[] = []
  let highlightPicks: HomepagePick[] = []
  let infoGraph: InfoGraph | null = null
  let ads: Ad[] = []
  let deepTopicAds: Ad[] = []
  let donation: Donation | null = null

  try {
    /**
     * 首頁資料獲取策略:
     * 1. 優先嘗試 JSON API (單一請求獲取所有資料)
     * 2. 若 JSON API 失敗，自動 fallback 到 GraphQL 查詢
     *
     * JSON API endpoint: /api/homepage
     * 詳細規格請參考: docs/homepage-api-spec.md
     */
    const [headerData, homepageData, donationResult, popularSearchKeywords] =
      await Promise.all([
        fetchHeaderData(),
        fetchHomepageData(client),
        client.query<{ donations: Donation[] }>({
          query: donationQuery,
        }),
        fetchPopularSearchKeywords(),
      ])

    // Get the first (most recent) active donation
    donation = donationResult.data?.donations?.[0] || null

    // 從統一的資料結構中取出各區塊資料
    highlightPicks = homepageData.highlightPicks
    carouselPicks = homepageData.carouselPicks
    topics = homepageData.topics
    infoGraph = homepageData.infoGraph
    ads = homepageData.ads
    deepTopicAds = homepageData.deepTopicAds

    return {
      props: {
        headerData,
        editorChoices,
        categories,
        latest,
        features,
        quotes,
        collaborations,
        featuredCollaboration,
        dataSetItems,
        dataSetCount,
        newsSection: homepageData.newsSection,
        columnSection: homepageData.columnSection,
        supplementSection: homepageData.supplementSection,
        greenSection: homepageData.greenSection,
        topics,
        carouselPicks,
        highlightPicks,
        infoGraph,
        ads,
        deepTopicAds,
        donation,
        popularSearchKeywords,
      },
      revalidate: 60, // 每 60 秒重新驗證
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
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGeneral>{page}</LayoutGeneral>
}

export default Index
