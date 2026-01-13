/**
 * Homepage API utility
 * 提供 JSON API 優先、GraphQL fallback 的資料獲取機制
 */

import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'

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
  homepageDeepTopicAds,
  homepagePicksByCategory,
  homepagePicksForCarousel,
  latestInfoGraph,
  multipleSectionsWithCategoriesAndPosts,
  topicsWithPosts,
} from '~/graphql/query/section'

// API Endpoints 設定
const ENV = process.env.NEXT_PUBLIC_ENV || 'local'

function getHomepageApiEndpoint(): string {
  switch (ENV) {
    case 'prod':
      // TODO
      return 'https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/homepage'
    case 'staging':
      // TODO
      return 'https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/homepage'
    case 'dev':
    default:
      // TODO
      return 'https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/homepage'
  }
}

/**
 * Homepage API Response 型別
 */
export interface HomepageApiResponse {
  sections: Section[]
  highlightPicks: HomepagePick[]
  carouselPicks: HomepagePick[]
  topics: Topic[]
  infoGraph: InfoGraph | null
  ads: Ad[]
  deepTopicAds: Ad[]
}

/**
 * 處理後的首頁資料型別
 */
export interface HomepageData {
  newsCategories: SectionCategory[]
  columnCategories: SectionCategory[]
  supplementCategories: SectionCategory[]
  greenCategories: SectionCategory[]
  highlightPicks: HomepagePick[]
  carouselPicks: HomepagePick[]
  topics: Topic[]
  infoGraph: InfoGraph | null
  ads: Ad[]
  deepTopicAds: Ad[]
}

/**
 * 建立具有 timeout 功能的 AbortController
 * 相容於不支援 AbortSignal.timeout 的環境
 */
function createTimeoutController(timeoutMs: number): AbortController {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), timeoutMs)
  return controller
}

/**
 * 從 JSON API 獲取首頁資料
 */
async function fetchFromJsonApi(): Promise<HomepageApiResponse> {
  const endpoint = getHomepageApiEndpoint()
  const controller = createTimeoutController(10000) // 10 秒 timeout

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: controller.signal,
  })

  if (!response.ok) {
    throw new Error(`Homepage API returned status ${response.status}`)
  }

  const data = await response.json()
  return data as HomepageApiResponse
}

/**
 * 從 GraphQL API 獲取首頁資料 (fallback)
 */
async function fetchFromGraphQL(
  client: ApolloClient<NormalizedCacheObject>
): Promise<HomepageApiResponse> {
  const [
    sectionsResult,
    highlightResult,
    topicsResult,
    carouselResult,
    infoGraphResult,
    adsResult,
    deepTopicAdsResult,
  ] = await Promise.all([
    client.query<{ sections: Section[] }>({
      query: multipleSectionsWithCategoriesAndPosts,
      variables: {
        sectionIds: ['3', '4', '5', '6'],
        postsPerCategory: 8,
      },
    }),
    client.query<{ homepagePicks: HomepagePick[] }>({
      query: homepagePicksByCategory,
      variables: { categorySlug: 'hottopic' },
    }),
    client.query<{ topics: Topic[] }>({
      query: topicsWithPosts,
      variables: { postsPerTopic: 4 },
    }),
    client.query<{ homepagePicks: HomepagePick[] }>({
      query: homepagePicksForCarousel,
    }),
    client.query<{ infoGraphs: InfoGraph[] }>({
      query: latestInfoGraph,
    }),
    client.query<{ ads: Ad[] }>({
      query: homepageAds,
    }),
    client.query<{ ads: Ad[] }>({
      query: homepageDeepTopicAds,
    }),
  ])

  return {
    sections: sectionsResult.data?.sections || [],
    highlightPicks: highlightResult.data?.homepagePicks || [],
    carouselPicks: carouselResult.data?.homepagePicks || [],
    topics: topicsResult.data?.topics || [],
    infoGraph: infoGraphResult.data?.infoGraphs?.[0] || null,
    ads: adsResult.data?.ads || [],
    deepTopicAds: deepTopicAdsResult.data?.ads || [],
  }
}

/**
 * 將 API Response 轉換為前端使用的資料格式
 */
function transformApiResponse(response: HomepageApiResponse): HomepageData {
  let newsCategories: SectionCategory[] = []
  let columnCategories: SectionCategory[] = []
  let supplementCategories: SectionCategory[] = []
  let greenCategories: SectionCategory[] = []

  // 根據 section id 分配資料
  for (const section of response.sections) {
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

  return {
    newsCategories,
    columnCategories,
    supplementCategories,
    greenCategories,
    highlightPicks: response.highlightPicks,
    carouselPicks: response.carouselPicks,
    topics: response.topics,
    infoGraph: response.infoGraph,
    ads: response.ads,
    deepTopicAds: response.deepTopicAds,
  }
}

/**
 * 獲取首頁資料
 * 優先使用 JSON API，失敗時 fallback 到 GraphQL
 *
 * @param client - Apollo Client instance (用於 fallback)
 * @returns 首頁資料
 */
export async function fetchHomepageData(
  client: ApolloClient<NormalizedCacheObject>
): Promise<HomepageData> {
  let response: HomepageApiResponse
  let usedFallback = false

  try {
    // 優先嘗試 JSON API
    response = await fetchFromJsonApi()
    // eslint-disable-next-line no-console
    console.log('[Homepage] Successfully fetched data from JSON API')
  } catch (jsonApiError) {
    // JSON API 失敗，fallback 到 GraphQL
    // eslint-disable-next-line no-console
    console.warn(
      '[Homepage] JSON API failed, falling back to GraphQL:',
      jsonApiError instanceof Error ? jsonApiError.message : 'Unknown error'
    )

    try {
      response = await fetchFromGraphQL(client)
      usedFallback = true
      // eslint-disable-next-line no-console
      console.log(
        '[Homepage] Successfully fetched data from GraphQL (fallback)'
      )
    } catch (graphqlError) {
      // 兩個都失敗，拋出錯誤
      // eslint-disable-next-line no-console
      console.error('[Homepage] Both JSON API and GraphQL failed')
      throw graphqlError
    }
  }

  // 記錄使用的資料來源（用於監控）
  if (usedFallback) {
    // eslint-disable-next-line no-console
    console.log('[Homepage] Data source: GraphQL (fallback)')
  } else {
    // eslint-disable-next-line no-console
    console.log('[Homepage] Data source: JSON API')
  }

  return transformApiResponse(response)
}

/**
 * 檢查 JSON API 是否可用
 * 可用於健康檢查或監控
 */
export async function checkHomepageApiHealth(): Promise<boolean> {
  try {
    const endpoint = getHomepageApiEndpoint()
    const controller = createTimeoutController(5000) // 5 秒 timeout
    const response = await fetch(endpoint, {
      method: 'HEAD',
      signal: controller.signal,
    })
    return response.ok
  } catch {
    return false
  }
}
