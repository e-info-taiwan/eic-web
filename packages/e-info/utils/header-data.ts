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

/**
 * Fetch all header navigation data from GraphQL API
 * Used in getServerSideProps/getStaticProps for server-side rendering
 */
export async function fetchHeaderData(): Promise<HeaderContextData> {
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

    return {
      sections: sectionsResult.data?.sections || [],
      featuredTags: tagsResult.data?.tags || [],
      topics: topicsResult.data?.topics || [],
      newsBarPicks: newsBarResult.data?.homepagePicks || [],
    }
  } catch (error) {
    console.error('Failed to fetch header data:', error)
    // Return empty data on error to avoid breaking the page
    return {
      sections: [],
      featuredTags: [],
      topics: [],
      newsBarPicks: [],
    }
  }
}
