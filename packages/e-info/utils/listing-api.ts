/**
 * Listing API utility
 * 提供 JSON API 優先、GraphQL fallback 的列表頁資料獲取機制
 * JSON 檔案預先產生前 5 頁，第 6 頁起或取得失敗時 fallback 至 GraphQL
 */

import { LISTING_API_ENDPOINT } from '~/constants/config'
import { API_TIMEOUT_MS } from '~/constants/layout'
import type {
  CategoryPostForListing,
  SectionForListing,
  SectionListingCategory,
  SectionPageCategory,
  SectionPageData,
} from '~/graphql/query/section'

import { createTimeoutController } from './homepage-api'

// JSON 僅預先產生前 5 頁
const MAX_JSON_PAGES = 5

// ========== Category Listing Types ==========

type CategoryListingSection = {
  id: string
  slug: string
  name: string
  style: string | null
  heroImage: {
    resized: Record<string, string> | null
    resizedWebp: Record<string, string> | null
  } | null
  categories: SectionListingCategory[]
}

export type CategoryListingResponse = {
  category: {
    id: string
    slug: string
    name: string
    postsCount: number
  }
  section: CategoryListingSection
  categories: SectionListingCategory[]
  posts: CategoryPostForListing[]
  totalPosts: number
  currentPage: number
  totalPages: number
}

// ========== Section Listing Types ==========

export type SectionDefaultListingResponse = {
  section: SectionForListing & {
    style: 'default'
  }
  categories: SectionListingCategory[]
  posts: CategoryPostForListing[]
  totalPosts: number
  currentPage: number
  totalPages: number
}

export type SectionColumnListingResponse = {
  section: SectionPageData
  categories: SectionPageCategory[]
}

// ========== Fetch Functions ==========

/**
 * 從 JSON API 取得分類列表頁資料
 * @param categoryId - 分類 ID
 * @param page - 頁碼 (1-based)
 * @returns 解析後的 JSON 資料，或 null 表示需要 fallback
 */
export async function fetchCategoryListing(
  categoryId: string,
  page: number
): Promise<CategoryListingResponse | null> {
  if (page > MAX_JSON_PAGES) {
    return null
  }

  try {
    const controller = createTimeoutController(API_TIMEOUT_MS)
    const url = `${LISTING_API_ENDPOINT}/category/${categoryId}/page-${page}.json`

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    })

    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.warn(
        `[ListingAPI] Category ${categoryId} page ${page} fetch failed: ${response.status}`
      )
      return null
    }

    const data: CategoryListingResponse = await response.json()
    // eslint-disable-next-line no-console
    console.log(
      `[ListingAPI] Category ${categoryId} page ${page} fetched from JSON API`
    )
    return data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      '[ListingAPI] Category listing fetch error:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    return null
  }
}

/**
 * 從 JSON API 取得 section 列表頁資料
 * @param slug - Section slug
 * @param page - 頁碼 (1-based)
 * @returns 解析後的 JSON 資料，或 null 表示需要 fallback
 */
export async function fetchSectionListing(
  slug: string,
  page: number
): Promise<
  SectionDefaultListingResponse | SectionColumnListingResponse | null
> {
  if (page > MAX_JSON_PAGES) {
    return null
  }

  try {
    const controller = createTimeoutController(API_TIMEOUT_MS)
    const url = `${LISTING_API_ENDPOINT}/section/${slug}/page-${page}.json`

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    })

    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.warn(
        `[ListingAPI] Section ${slug} page ${page} fetch failed: ${response.status}`
      )
      return null
    }

    const data = await response.json()
    // eslint-disable-next-line no-console
    console.log(
      `[ListingAPI] Section ${slug} page ${page} fetched from JSON API`
    )
    return data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      '[ListingAPI] Section listing fetch error:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    return null
  }
}

/**
 * 判斷 section listing response 是否為 default style
 */
export function isSectionDefaultListing(
  data: SectionDefaultListingResponse | SectionColumnListingResponse
): data is SectionDefaultListingResponse {
  return 'totalPosts' in data
}
