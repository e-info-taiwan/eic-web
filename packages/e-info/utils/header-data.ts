import { getGqlClient } from '~/apollo-client'
import type { HeaderContextData } from '~/contexts/header-context'
import type {
  HeaderNavSection,
  HeaderNavTag,
  HeaderNavTopic,
  NewsBarPick,
} from '~/graphql/query/section'
import {
  featuredTagsForHeader,
  homepagePicksForNewsBar,
  sectionsForHeader,
  topicsForHeader,
} from '~/graphql/query/section'

// In-memory cache for header data
let cachedHeaderData: HeaderContextData | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 60 * 1000 // 60 seconds

/**
 * Fetch all header navigation data from GraphQL API
 * Used in getServerSideProps/getStaticProps for server-side rendering
 *
 * Includes in-memory caching with 60-second TTL to reduce API calls
 * for SSR pages within the same Node.js process
 */
export async function fetchHeaderData(): Promise<HeaderContextData> {
  const now = Date.now()

  // Return cached data if still valid
  if (cachedHeaderData && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedHeaderData
  }

  const client = getGqlClient()

  try {
    // Fetch all data in parallel for better performance
    const [sectionsResult, tagsResult, topicsResult, newsBarResult] =
      await Promise.all([
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
      ])

    const data: HeaderContextData = {
      sections: sectionsResult.data?.sections || [],
      featuredTags: tagsResult.data?.tags || [],
      topics: topicsResult.data?.topics || [],
      newsBarPicks: newsBarResult.data?.homepagePicks || [],
    }

    // Update cache
    cachedHeaderData = data
    cacheTimestamp = now

    return data
  } catch (error) {
    console.error('Failed to fetch header data:', error)

    // If we have stale cache, return it instead of empty data
    if (cachedHeaderData) {
      console.warn('Returning stale header data due to fetch error')
      return cachedHeaderData
    }

    // Return empty data on error to avoid breaking the page
    return {
      sections: [],
      featuredTags: [],
      topics: [],
      newsBarPicks: [],
    }
  }
}
