/**
 * Homepage API utility
 * 提供 JSON API 優先、GraphQL fallback 的資料獲取機制
 */

import type { ApolloClient } from '@apollo/client/core'

import {
  HOMEPAGE_API_ENDPOINT,
  POPULAR_SEARCH_ENDPOINT,
} from '~/constants/config'
import {
  API_TIMEOUT_MS,
  CACHE_TTL_MS,
  HEALTH_CHECK_TIMEOUT_MS,
} from '~/constants/layout'
import type {
  Ad,
  HomepagePick,
  HomepagePickCarousel,
  InfoGraph,
  PopularSearchKeyword,
  PopularSearchResponse,
  Section,
  SectionCategory,
  SectionPost,
  Topic,
} from '~/graphql/query/section'
import {
  homepageAds,
  homepageDeepTopicAds,
  homepageGreenConsumptionPosts,
  homepagePicksByCategory,
  homepagePicksForCarousel,
  homepageSectionPosts,
  latestInfoGraph,
  multipleSectionsWithCategoriesAndPosts,
  topicsWithPosts,
} from '~/graphql/query/section'

// In-memory cache for homepage data
let cachedHomepageData: HomepageData | null = null
let cacheTimestamp = 0

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
  // Section-level posts (aggregated across all categories)
  newsPosts?: SectionPost[]
  columnPosts?: SectionPost[]
  supplementPosts?: SectionPost[]
  // Green consumption tag posts
  greenMain?: SectionPost[]
  greenBuy?: SectionPost[]
  greenFood?: SectionPost[]
  greenClothing?: SectionPost[]
  greenLeisure?: SectionPost[]
}

/**
 * Section 資訊型別（包含 slug 用於動態 URL）
 */
export interface SectionInfo {
  id: string
  slug: string
  name: string
  categories: SectionCategory[]
  posts: SectionPost[] // Section-level posts（預設顯示用）
}

/**
 * 綠色消費區塊資料型別（以 tag 為資料來源）
 */
export interface GreenConsumptionTag {
  name: string
  posts: SectionPost[]
}

export interface GreenConsumptionData {
  posts: SectionPost[] // 主「綠色消費」tag 文章（預設顯示）
  subTags: GreenConsumptionTag[] // 子 tag（買前必讀、食材食品、衣著紡織、休閒娛樂）
}

/**
 * 處理後的首頁資料型別
 */
export interface HomepageData {
  newsSection: SectionInfo
  columnSection: SectionInfo
  supplementSection: SectionInfo
  greenSection: GreenConsumptionData
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
  const controller = createTimeoutController(API_TIMEOUT_MS)

  const response = await fetch(HOMEPAGE_API_ENDPOINT, {
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
    sectionPostsResult,
    greenResult,
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
        sectionIds: ['1', '2', '3'],
        postsPerCategory: 8,
      },
    }),
    client.query<{
      newsPosts: SectionPost[]
      columnPosts: SectionPost[]
      supplementPosts: SectionPost[]
    }>({
      query: homepageSectionPosts,
      variables: { postsPerSection: 8 },
    }),
    client.query<{
      greenMain: SectionPost[]
      greenBuy: SectionPost[]
      greenFood: SectionPost[]
      greenClothing: SectionPost[]
      greenLeisure: SectionPost[]
    }>({
      query: homepageGreenConsumptionPosts,
      variables: { postsPerTag: 3 },
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
    newsPosts: sectionPostsResult.data?.newsPosts || [],
    columnPosts: sectionPostsResult.data?.columnPosts || [],
    supplementPosts: sectionPostsResult.data?.supplementPosts || [],
    greenMain: greenResult.data?.greenMain || [],
    greenBuy: greenResult.data?.greenBuy || [],
    greenFood: greenResult.data?.greenFood || [],
    greenClothing: greenResult.data?.greenClothing || [],
    greenLeisure: greenResult.data?.greenLeisure || [],
  }
}

/**
 * 排序 Topics 並取前 N 筆
 * 排序邏輯：
 *   1. 先過濾有關聯文章的 topics (posts.length > 0)
 *   2. isPinned = true 的 topics 優先，依 sortOrder 升冪排序
 *   3. isPinned = false 的 topics，依 sortOrder 升冪排序
 *   4. 取前 maxTopics 筆
 */
function sortAndLimitTopics(topics: Topic[], maxTopics: number = 4): Topic[] {
  // Filter topics that have posts first
  const topicsWithPosts = topics.filter(
    (topic) => topic.posts && topic.posts.length > 0
  )

  const sorted = [...topicsWithPosts].sort((a, b) => {
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
    posts: response.newsPosts || [],
  }
  let columnSection: SectionInfo = {
    id: '2',
    slug: 'column',
    name: '專欄',
    categories: [],
    posts: response.columnPosts || [],
  }
  let supplementSection: SectionInfo = {
    id: '3',
    slug: 'supplement',
    name: '副刊',
    categories: [],
    posts: response.supplementPosts || [],
  }
  // 綠色消費區塊（tag-based）
  const greenSection: GreenConsumptionData = {
    posts: response.greenMain || [],
    subTags: [
      { name: '買前必讀', posts: response.greenBuy || [] },
      { name: '食材食品', posts: response.greenFood || [] },
      { name: '衣著紡織', posts: response.greenClothing || [] },
      { name: '休閒娛樂', posts: response.greenLeisure || [] },
    ],
  }

  // 根據 section id 分配資料，並提取 slug
  for (const section of response.sections) {
    switch (section.id) {
      case '1': // 時事新聞 (news)
        newsSection = {
          ...newsSection,
          slug: section.slug || 'news',
          name: section.name || '時事新聞',
          categories: section.categories,
        }
        break
      case '2': // 專欄 (column)
        columnSection = {
          ...columnSection,
          slug: section.slug || 'column',
          name: section.name || '專欄',
          categories: section.categories,
        }
        break
      case '3': // 副刊 (supplement)
        supplementSection = {
          ...supplementSection,
          slug: section.slug || 'supplement',
          name: section.name || '副刊',
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
    // 優先嘗試 JSON API（已包含綠色消費 tag 資料）
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
    const controller = createTimeoutController(HEALTH_CHECK_TIMEOUT_MS)
    const response = await fetch(HOMEPAGE_API_ENDPOINT, {
      method: 'HEAD',
      signal: controller.signal,
    })
    return response.ok
  } catch {
    return false
  }
}

export async function fetchPopularSearchKeywords(): Promise<
  PopularSearchKeyword[]
> {
  try {
    const controller = createTimeoutController(API_TIMEOUT_MS)

    const response = await fetch(POPULAR_SEARCH_ENDPOINT, {
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
