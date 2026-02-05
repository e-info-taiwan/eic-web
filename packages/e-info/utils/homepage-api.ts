/**
 * Homepage API utility
 * 提供 JSON API 優先、GraphQL fallback 的資料獲取機制
 */

import type { ApolloClient } from '@apollo/client/core'

import type {
  Ad,
  HomepagePick,
  HomepagePickCarousel,
  InfoGraph,
  PopularSearchKeyword,
  PopularSearchResponse,
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

// In-memory cache for homepage data
let cachedHomepageData: HomepageData | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 60 * 1000 // 60 seconds

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
  carouselPicks: HomepagePickCarousel[]
  topics: Topic[]
  infoGraph: InfoGraph | null
  ads: Ad[]
  deepTopicAds: Ad[]
}

/**
 * Section 資訊型別（包含 slug 用於動態 URL）
 */
export interface SectionInfo {
  id: string
  slug: string
  name: string
  categories: SectionCategory[]
}

/**
 * 處理後的首頁資料型別
 */
export interface HomepageData {
  newsSection: SectionInfo
  columnSection: SectionInfo
  supplementSection: SectionInfo
  greenSection: SectionInfo
  highlightPicks: HomepagePick[]
  carouselPicks: HomepagePickCarousel[]
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
  client: ApolloClient
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
        sectionIds: ['1', '2', '3', '5'],
        postsPerCategory: 8,
      },
    }),
    client.query<{ homepagePicks: HomepagePick[] }>({
      query: homepagePicksByCategory,
      variables: { categorySlug: 'breakingnews' },
    }),
    client.query<{ topics: Topic[] }>({
      query: topicsWithPosts,
      variables: { postsPerTopic: 4 },
    }),
    client.query<{ homepagePicks: HomepagePickCarousel[] }>({
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
 * 排序 Topics 並取前 N 筆
 * 排序邏輯：
 *   1. isPinned = true 的 topics 優先，依 sortOrder 升冪排序
 *   2. isPinned = false 的 topics，依 sortOrder 升冪排序
 *   3. 取前 maxTopics 筆
 */
function sortAndLimitTopics(topics: Topic[], maxTopics: number = 4): Topic[] {
  const sorted = [...topics].sort((a, b) => {
    // isPinned = true 優先
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1

    // 相同 isPinned 狀態下，依 sortOrder 升冪排序
    const sortOrderA = a.sortOrder ?? Infinity
    const sortOrderB = b.sortOrder ?? Infinity
    return sortOrderA - sortOrderB
  })

  return sorted.slice(0, maxTopics)
}

/**
 * 將 API Response 轉換為前端使用的資料格式
 */
function transformApiResponse(response: HomepageApiResponse): HomepageData {
  // 預設的 section 資訊
  let newsSection: SectionInfo = {
    id: '1',
    slug: 'news',
    name: '時事新聞',
    categories: [],
  }
  let columnSection: SectionInfo = {
    id: '2',
    slug: 'column',
    name: '專欄',
    categories: [],
  }
  let supplementSection: SectionInfo = {
    id: '3',
    slug: 'supplement',
    name: '副刊',
    categories: [],
  }
  let greenSection: SectionInfo = {
    id: '5',
    slug: 'greenconsumption',
    name: '綠色消費',
    categories: [],
  }

  // 根據 section id 分配資料，並提取 slug
  for (const section of response.sections) {
    switch (section.id) {
      case '1': // 時事新聞 (news)
        newsSection = {
          id: section.id,
          slug: section.slug || 'news',
          name: section.name || '時事新聞',
          categories: section.categories,
        }
        break
      case '2': // 專欄 (column)
        columnSection = {
          id: section.id,
          slug: section.slug || 'column',
          name: section.name || '專欄',
          categories: section.categories,
        }
        break
      case '3': // 副刊 (supplement)
        supplementSection = {
          id: section.id,
          slug: section.slug || 'supplement',
          name: section.name || '副刊',
          categories: section.categories,
        }
        break
      case '5': // 綠色消費 (greenconsumption)
        greenSection = {
          id: section.id,
          slug: section.slug || 'greenconsumption',
          name: section.name || '綠色消費',
          categories: section.categories,
        }
        break
    }
  }

  // 排序 topics: isPinned 優先，再依 sortOrder 排序，取前 4 筆
  const sortedTopics = sortAndLimitTopics(response.topics, 4)

  return {
    newsSection,
    columnSection,
    supplementSection,
    greenSection,
    highlightPicks: response.highlightPicks,
    carouselPicks: response.carouselPicks,
    topics: sortedTopics,
    infoGraph: response.infoGraph,
    ads: response.ads,
    deepTopicAds: response.deepTopicAds,
  }
}

/**
 * 獲取首頁資料
 * 優先使用 JSON API，失敗時 fallback 到 GraphQL
 *
 * Includes in-memory caching with 60-second TTL to reduce API calls
 * for SSR pages within the same Node.js process
 *
 * @param client - Apollo Client instance (用於 fallback)
 * @returns 首頁資料
 */
export async function fetchHomepageData(
  client: ApolloClient
): Promise<HomepageData> {
  const now = Date.now()

  // Return cached data if still valid
  if (cachedHomepageData && now - cacheTimestamp < CACHE_TTL_MS) {
    // eslint-disable-next-line no-console
    console.log('[Homepage] Returning cached data')
    return cachedHomepageData
  }

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
      // 兩個都失敗
      // eslint-disable-next-line no-console
      console.error('[Homepage] Both JSON API and GraphQL failed')

      // If we have stale cache, return it instead of throwing
      if (cachedHomepageData) {
        // eslint-disable-next-line no-console
        console.warn(
          '[Homepage] Returning stale cached data due to fetch error'
        )
        return cachedHomepageData
      }

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

  const data = transformApiResponse(response)

  // Update cache
  cachedHomepageData = data
  cacheTimestamp = now

  return data
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

/**
 * 獲取熱搜關鍵字資料
 * 從 GCS 上的 GA4 分析資料 JSON 檔案取得
 */
function getPopularSearchEndpoint(): string {
  switch (ENV) {
    case 'prod':
      // TODO: Update to production endpoint when available
      return 'https://storage.googleapis.com/statics-e-info-dev/ga/popular_search.json'
    case 'staging':
      return 'https://storage.googleapis.com/statics-e-info-dev/ga/popular_search.json'
    case 'dev':
    default:
      return 'https://storage.googleapis.com/statics-e-info-dev/ga/popular_search.json'
  }
}

export async function fetchPopularSearchKeywords(): Promise<
  PopularSearchKeyword[]
> {
  try {
    const endpoint = getPopularSearchEndpoint()
    const controller = createTimeoutController(10000) // 10 秒 timeout

    const response = await fetch(endpoint, {
      method: 'GET',
      signal: controller.signal,
    })

    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.warn(
        `[PopularSearch] Failed to fetch: ${response.status} ${response.statusText}`
      )
      return []
    }

    const data: PopularSearchResponse = await response.json()
    return data.top_search_keywords || []
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      '[PopularSearch] Error fetching popular search keywords:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    return []
  }
}
