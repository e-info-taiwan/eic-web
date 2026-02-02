/**
 * Header/Footer data utility
 * 提供 JSON API 優先、GraphQL fallback 的資料獲取機制
 */

import { getGqlClient } from '~/apollo-client'
import type { HeaderContextData } from '~/contexts/header-context'
import type {
  HeaderNavSection,
  HeaderNavTag,
  HeaderNavTopic,
  NewsBarPick,
  SiteConfig,
} from '~/graphql/query/section'
import {
  featuredTagsForHeader,
  homepagePicksForNewsBar,
  sectionsForHeader,
  siteConfigsForFooter,
  topicsForHeader,
} from '~/graphql/query/section'

// API Endpoints 設定
const ENV = process.env.NEXT_PUBLIC_ENV || 'local'

// In-memory cache for header data
let cachedHeaderData: HeaderContextData | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 60 * 1000 // 60 seconds

function getHeaderApiEndpoint(): string {
  switch (ENV) {
    case 'prod':
      // TODO: Update when prod endpoint is ready
      return 'https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/header'
    case 'staging':
      // TODO: Update when staging endpoint is ready
      return 'https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/header'
    case 'dev':
    default:
      // TODO: Update when dev endpoint is ready
      return 'https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/header'
  }
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
 * 從 JSON API 獲取 Header/Footer 資料
 */
async function fetchFromJsonApi(): Promise<HeaderContextData> {
  const endpoint = getHeaderApiEndpoint()
  const controller = createTimeoutController(10000) // 10 秒 timeout

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: controller.signal,
  })

  if (!response.ok) {
    throw new Error(`Header API returned status ${response.status}`)
  }

  const data = await response.json()
  return data as HeaderContextData
}

/**
 * 從 GraphQL API 獲取 Header/Footer 資料 (fallback)
 */
async function fetchFromGraphQL(): Promise<HeaderContextData> {
  const client = getGqlClient()

  const [
    sectionsResult,
    tagsResult,
    topicsResult,
    newsBarResult,
    configsResult,
  ] = await Promise.all([
    client.query<{ sections: HeaderNavSection[] }>({
      query: sectionsForHeader,
    }),
    client.query<{ tags: HeaderNavTag[] }>({
      query: featuredTagsForHeader,
    }),
    client.query<{ topics: HeaderNavTopic[] }>({
      query: topicsForHeader,
    }),
    client.query<{ homepagePicks: NewsBarPick[] }>({
      query: homepagePicksForNewsBar,
    }),
    client.query<{ configs: SiteConfig[] }>({
      query: siteConfigsForFooter,
    }),
  ])

  return {
    sections: sectionsResult.data?.sections || [],
    featuredTags: tagsResult.data?.tags || [],
    topics: topicsResult.data?.topics || [],
    newsBarPicks: newsBarResult.data?.homepagePicks || [],
    siteConfigs: configsResult.data?.configs || [],
  }
}

/**
 * 獲取 Header/Footer 資料
 * 優先使用 JSON API，失敗時 fallback 到 GraphQL
 *
 * Includes in-memory caching with 60-second TTL to reduce API calls
 * for SSR pages within the same Node.js process
 *
 * @returns Header/Footer 資料
 */
export async function fetchHeaderData(): Promise<HeaderContextData> {
  const now = Date.now()

  // Return cached data if still valid
  if (cachedHeaderData && now - cacheTimestamp < CACHE_TTL_MS) {
    // eslint-disable-next-line no-console
    console.log('[Header] Returning cached data')
    return cachedHeaderData
  }

  let data: HeaderContextData
  let usedFallback = false

  try {
    // 優先嘗試 JSON API
    data = await fetchFromJsonApi()
    // eslint-disable-next-line no-console
    console.log('[Header] Successfully fetched data from JSON API')
  } catch (jsonApiError) {
    // JSON API 失敗，fallback 到 GraphQL
    // eslint-disable-next-line no-console
    console.warn(
      '[Header] JSON API failed, falling back to GraphQL:',
      jsonApiError instanceof Error ? jsonApiError.message : 'Unknown error'
    )

    try {
      data = await fetchFromGraphQL()
      usedFallback = true
      // eslint-disable-next-line no-console
      console.log('[Header] Successfully fetched data from GraphQL (fallback)')
    } catch (graphqlError) {
      // 兩個都失敗
      // eslint-disable-next-line no-console
      console.error('[Header] Both JSON API and GraphQL failed')

      // If we have stale cache, return it instead of throwing
      if (cachedHeaderData) {
        // eslint-disable-next-line no-console
        console.warn('[Header] Returning stale cached data due to fetch error')
        return cachedHeaderData
      }

      // Return empty data on error to avoid breaking the page
      return {
        sections: [],
        featuredTags: [],
        topics: [],
        newsBarPicks: [],
        siteConfigs: [],
      }
    }
  }

  // 記錄使用的資料來源（用於監控）
  if (usedFallback) {
    // eslint-disable-next-line no-console
    console.log('[Header] Data source: GraphQL (fallback)')
  } else {
    // eslint-disable-next-line no-console
    console.log('[Header] Data source: JSON API')
  }

  // Update cache
  cachedHeaderData = data
  cacheTimestamp = now

  return data
}

/**
 * 檢查 JSON API 是否可用
 * 可用於健康檢查或監控
 */
export async function checkHeaderApiHealth(): Promise<boolean> {
  try {
    const endpoint = getHeaderApiEndpoint()
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
