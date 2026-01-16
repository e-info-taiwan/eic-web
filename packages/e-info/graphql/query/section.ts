import gql from 'graphql-tag'

import type { ResizedImagesCard } from '~/graphql/fragments/post'
import {
  resizeImagesCardFragment,
  resizeImagesFragment,
  resizeWebpImagesCardFragment,
  resizeWebpImagesFragment,
} from '~/graphql/fragments/resized-images'
import type { ResizedImages } from '~/types/common'

export type ContentApiDataBlock = {
  id: string
  type: string
  content?: string[]
  styles?: Record<string, unknown>
  alignment?: string
}

export type SectionPost = {
  id: string
  title: string
  publishTime: string
  brief: string | Record<string, unknown> | null
  contentApiData: ContentApiDataBlock[] | null
  heroImage: {
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
  } | null
}

export type SectionCategory = {
  id: string
  slug: string
  name: string
  sortOrder: number | null
  postsCount: number
  posts: SectionPost[]
  featuredPostsInInputOrder: SectionPost[]
}

export type Section = {
  id: string
  slug: string
  name: string
  categories: SectionCategory[]
}

export type CategoryPost = {
  id: string
  title: string
  publishTime: string
  heroImage: {
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
  } | null
}

export type CategoryWithPosts = {
  id: string
  slug: string
  name: string
  postsCount: number
  posts: CategoryPost[]
}

export type TopicPost = {
  id: string
  title: string
  publishTime: string
  brief: string | Record<string, unknown> | null
  heroImage: {
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
  } | null
}

export type TopicTag = {
  id: string
  name: string
}

export type Topic = {
  id: string
  title: string
  status: string
  content: string | null
  heroImage: {
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
  } | null
  postsCount: number
  posts: TopicPost[]
  tags?: TopicTag[]
  isPinned: boolean
  updatedAt?: string
}

// HomepagePick for highlight section (uses card sizes)
export type HomepagePickPost = {
  id: string
  title: string
  publishTime: string
  heroImage: {
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
  } | null
}

export type HomepagePick = {
  id: string
  sortOrder: number
  customUrl: string | null
  customTitle: string | null
  customDescription: string | null
  customImage: {
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
  } | null
  posts: HomepagePickPost | null
  category: {
    id: string
    slug: string
    name: string
  } | null
}

// HomepagePickCarousel for main carousel (uses full sizes for large hero images)
export type HomepagePickCarouselPost = {
  id: string
  title: string
  publishTime: string
  heroImage: {
    resized: ResizedImages | null
    resizedWebp: ResizedImages | null
  } | null
}

export type HomepagePickCarousel = {
  id: string
  sortOrder: number
  customUrl: string | null
  customTitle: string | null
  customDescription: string | null
  customImage: {
    resized: ResizedImages | null
    resizedWebp: ResizedImages | null
  } | null
  posts: HomepagePickCarouselPost | null
  category: {
    id: string
    slug: string
    name: string
  } | null
}

export const topicsWithPosts = gql`
  query ($postsPerTopic: Int = 4) {
    topics(
      where: { status: { equals: "published" }, isPinned: { equals: true } }
      orderBy: { sortOrder: asc }
    ) {
      id
      title
      status
      content
      heroImage {
        resized {
          ...ResizedImagesCardField
        }
        resizedWebp {
          ...ResizedWebPImagesCardField
        }
      }
      postsCount
      posts(take: $postsPerTopic, orderBy: { publishTime: desc }) {
        id
        title
        publishTime
        brief
        heroImage {
          resized {
            ...ResizedImagesCardField
          }
          resizedWebp {
            ...ResizedWebPImagesCardField
          }
        }
      }
      isPinned
    }
  }
  ${resizeImagesCardFragment}
  ${resizeWebpImagesCardFragment}
`

/**
 * Query for all published topics (for featured-topics listing page)
 * Returns all topics with basic info and updatedAt for sorting
 */
export const allTopics = gql`
  query {
    topics(
      where: { status: { equals: "published" } }
      orderBy: { updatedAt: desc }
    ) {
      id
      title
      status
      content
      heroImage {
        resized {
          ...ResizedImagesCardField
        }
        resizedWebp {
          ...ResizedWebPImagesCardField
        }
      }
      postsCount
      isPinned
      updatedAt
    }
  }
  ${resizeImagesCardFragment}
  ${resizeWebpImagesCardFragment}
`

/**
 * Query for a single topic by ID with all posts
 * Used for topic detail page (/topic/[id])
 */
export const topicById = gql`
  query ($topicId: ID!) {
    topics(
      where: { id: { equals: $topicId }, status: { equals: "published" } }
    ) {
      id
      title
      status
      content
      heroImage {
        resized {
          ...ResizedImagesCardField
        }
        resizedWebp {
          ...ResizedWebPImagesCardField
        }
      }
      postsCount
      posts(orderBy: { publishTime: desc }) {
        id
        title
        publishTime
        brief
        heroImage {
          resized {
            ...ResizedImagesCardField
          }
          resizedWebp {
            ...ResizedWebPImagesCardField
          }
        }
      }
      tags {
        id
        name
      }
      isPinned
      updatedAt
    }
  }
  ${resizeImagesCardFragment}
  ${resizeWebpImagesCardFragment}
`

export const categoryWithPosts = gql`
  query ($categoryId: ID!, $postsCount: Int = 3) {
    categories(where: { id: { equals: $categoryId } }) {
      id
      slug
      name
      postsCount
      posts(take: $postsCount, orderBy: { publishTime: desc }) {
        id
        title
        publishTime
        heroImage {
          resized {
            ...ResizedImagesCardField
          }
          resizedWebp {
            ...ResizedWebPImagesCardField
          }
        }
      }
    }
  }
  ${resizeImagesCardFragment}
  ${resizeWebpImagesCardFragment}
`

export const sectionWithCategoriesAndPosts = gql`
  query ($sectionId: ID!, $postsPerCategory: Int = 3) {
    sections(where: { id: { equals: $sectionId } }) {
      id
      slug
      name
      categories(orderBy: { sortOrder: asc }) {
        id
        slug
        name
        sortOrder
        postsCount
        posts(take: $postsPerCategory, orderBy: { publishTime: desc }) {
          id
          title
          publishTime
          brief
          contentApiData
          heroImage {
            resized {
              ...ResizedImagesCardField
            }
            resizedWebp {
              ...ResizedWebPImagesCardField
            }
          }
        }
      }
    }
  }
  ${resizeImagesCardFragment}
  ${resizeWebpImagesCardFragment}
`

/**
 * 合併多個 Section 的查詢
 * 用於首頁一次獲取多個大分類的資料，減少 API 請求次數
 *
 * Section IDs 對應:
 * - 3: 時事新聞 (latestnews) - 用於 NewsSection
 * - 4: 專欄 (column) - 用於 ColumnSection
 * - 5: 副刊 (sub) - 用於 SupplementSection
 * - 6: 綠色消費 (green) - 用於 GreenSection
 *
 * @param sectionIds - Section ID 陣列，例如 ['3', '4', '5', '6']
 * @param postsPerCategory - 每個分類要獲取的文章數量，預設 3 篇
 */
export const multipleSectionsWithCategoriesAndPosts = gql`
  query ($sectionIds: [ID!]!, $postsPerCategory: Int = 3) {
    sections(where: { id: { in: $sectionIds } }, orderBy: { id: asc }) {
      id
      slug
      name
      categories(orderBy: { sortOrder: asc }) {
        id
        slug
        name
        sortOrder
        postsCount
        featuredPostsInInputOrder {
          id
          title
          publishTime
          brief
          contentApiData
          heroImage {
            resized {
              ...ResizedImagesCardField
            }
            resizedWebp {
              ...ResizedWebPImagesCardField
            }
          }
        }
        posts(take: $postsPerCategory, orderBy: { publishTime: desc }) {
          id
          title
          publishTime
          brief
          contentApiData
          heroImage {
            resized {
              ...ResizedImagesCardField
            }
            resizedWebp {
              ...ResizedWebPImagesCardField
            }
          }
        }
      }
    }
  }
  ${resizeImagesCardFragment}
  ${resizeWebpImagesCardFragment}
`

// Query for homepage picks by category slug
export const homepagePicksByCategory = gql`
  query ($categorySlug: String!) {
    homepagePicks(
      where: { category: { slug: { equals: $categorySlug } } }
      orderBy: { sortOrder: asc }
    ) {
      id
      sortOrder
      customUrl
      customTitle
      customDescription
      customImage {
        resized {
          ...ResizedImagesCardField
        }
        resizedWebp {
          ...ResizedWebPImagesCardField
        }
      }
      posts {
        id
        title
        publishTime
        heroImage {
          resized {
            ...ResizedImagesCardField
          }
          resizedWebp {
            ...ResizedWebPImagesCardField
          }
        }
      }
      category {
        id
        slug
        name
      }
    }
  }
  ${resizeImagesCardFragment}
  ${resizeWebpImagesCardFragment}
`

// Lightweight type for NewsBar marquee (only title and URL needed)
export type NewsBarPick = {
  id: string
  customUrl: string | null
  customTitle: string | null
  posts: {
    id: string
    title: string
  } | null
  category: {
    id: string
    name: string
  } | null
}

// Query for NewsBar marquee - lightweight version with only title and URL
// Fetches all homepage picks from all categories
export const homepagePicksForNewsBar = gql`
  query {
    homepagePicks(orderBy: { sortOrder: asc }) {
      id
      customUrl
      customTitle
      posts {
        id
        title
      }
      category {
        id
        name
      }
    }
  }
`

// Query for homepage carousel picks
// Filter by category slug "homepepicks" (首頁輪播文章)
// Note: Carousel uses full image sizes for large hero display on desktop
export const homepagePicksForCarousel = gql`
  query {
    homepagePicks(
      where: { category: { slug: { equals: "homepepicks" } } }
      orderBy: { sortOrder: asc }
    ) {
      id
      sortOrder
      customUrl
      customTitle
      customDescription
      customImage {
        resized {
          ...ResizedImagesField
        }
        resizedWebp {
          ...ResizedWebPImagesField
        }
      }
      posts {
        id
        title
        publishTime
        heroImage {
          resized {
            ...ResizedImagesField
          }
          resizedWebp {
            ...ResizedWebPImagesField
          }
        }
      }
      category {
        id
        slug
        name
      }
    }
  }
  ${resizeImagesFragment}
  ${resizeWebpImagesFragment}
`

// InfoGraph type for homepage infographic section
export type InfoGraph = {
  id: string
  name: string | null
  title: string | null
  description: string | null
  youtubeUrl: string | null
  state: string
  image: {
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
  } | null
}

// Query for latest published InfoGraph
export const latestInfoGraph = gql`
  query {
    infoGraphs(
      where: { state: { equals: "published" } }
      orderBy: { createdAt: desc }
      take: 1
    ) {
      id
      name
      title
      description
      youtubeUrl
      state
      image {
        resized {
          ...ResizedImagesCardField
        }
        resizedWebp {
          ...ResizedWebPImagesCardField
        }
      }
    }
  }
  ${resizeImagesCardFragment}
  ${resizeWebpImagesCardFragment}
`

// Ad type for homepage ads
export type Ad = {
  id: string
  name: string | null
  showOnHomepage: boolean
  showOnHomepageDeepTopic: boolean
  state: string
  sortOrder: number | null
  imageUrl: string | null
  image: {
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
  } | null
}

// Query for homepage ads (showOnHomepage = true)
export const homepageAds = gql`
  query {
    ads(
      where: { showOnHomepage: { equals: true }, state: { equals: "active" } }
      orderBy: { sortOrder: asc }
    ) {
      id
      name
      showOnHomepage
      showOnHomepageDeepTopic
      state
      sortOrder
      imageUrl
      image {
        resized {
          ...ResizedImagesCardField
        }
        resizedWebp {
          ...ResizedWebPImagesCardField
        }
      }
    }
  }
  ${resizeImagesCardFragment}
  ${resizeWebpImagesCardFragment}
`

// Query for homepage deep topic ads (showOnHomepageDeepTopic = true)
export const homepageDeepTopicAds = gql`
  query {
    ads(
      where: {
        showOnHomepageDeepTopic: { equals: true }
        state: { equals: "active" }
      }
      orderBy: { sortOrder: asc }
    ) {
      id
      name
      showOnHomepage
      showOnHomepageDeepTopic
      state
      sortOrder
      imageUrl
      image {
        resized {
          ...ResizedImagesCardField
        }
        resizedWebp {
          ...ResizedWebPImagesCardField
        }
      }
    }
  }
  ${resizeImagesCardFragment}
  ${resizeWebpImagesCardFragment}
`

// Types for section listing page
export type SectionListingCategory = {
  id: string
  slug: string
  name: string
  sortOrder: number | null
  postsCount: number
}

export type SectionForListing = {
  id: string
  slug: string
  name: string
  postsCount: number
  categories: SectionListingCategory[]
}

export type CategoryPostForListing = {
  id: string
  title: string
  style: string
  publishTime: string
  brief: string | Record<string, unknown> | null
  contentApiData: ContentApiDataBlock[] | null
  heroImage: {
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
  } | null
  ogImage: {
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
  } | null
  tags: { id: string; name: string }[]
}

// Query section by slug with categories (no posts - just for tabs)
export const sectionBySlug = gql`
  query ($slug: String!) {
    sections(where: { slug: { equals: $slug } }) {
      id
      slug
      name
      postsCount
      categories(orderBy: { sortOrder: asc }) {
        id
        slug
        name
        sortOrder
        postsCount
      }
    }
  }
`

// Query all posts from all categories in a section with pagination
// Uses posts query with category.section filter to get aggregated posts
export const sectionPostsForListing = gql`
  query ($sectionSlug: String!, $take: Int = 12, $skip: Int = 0) {
    posts(
      where: { category: { section: { slug: { equals: $sectionSlug } } } }
      take: $take
      skip: $skip
      orderBy: { publishTime: desc }
    ) {
      id
      title
      style
      publishTime
      brief
      contentApiData
      heroImage {
        resized {
          ...ResizedImagesCardField
        }
        resizedWebp {
          ...ResizedWebPImagesCardField
        }
      }
      ogImage {
        resized {
          ...ResizedImagesCardField
        }
        resizedWebp {
          ...ResizedWebPImagesCardField
        }
      }
      tags {
        id
        name
      }
    }
    postsCount(
      where: { category: { section: { slug: { equals: $sectionSlug } } } }
    )
  }
  ${resizeImagesCardFragment}
  ${resizeWebpImagesCardFragment}
`

// Query category by ID with section info (for category page)
export const categoryByIdWithSection = gql`
  query ($categoryId: ID!) {
    categories(where: { id: { equals: $categoryId } }) {
      id
      slug
      name
      postsCount
      section {
        id
        slug
        name
        categories(orderBy: { sortOrder: asc }) {
          id
          slug
          name
          sortOrder
          postsCount
        }
      }
    }
  }
`

// Query posts for category page with pagination
export const categoryPostsForListing = gql`
  query ($categoryId: ID!, $take: Int = 12, $skip: Int = 0) {
    categories(where: { id: { equals: $categoryId } }) {
      id
      postsCount
      posts(take: $take, skip: $skip, orderBy: { publishTime: desc }) {
        id
        title
        style
        publishTime
        brief
        contentApiData
        heroImage {
          resized {
            ...ResizedImagesCardField
          }
          resizedWebp {
            ...ResizedWebPImagesCardField
          }
        }
        ogImage {
          resized {
            ...ResizedImagesCardField
          }
          resizedWebp {
            ...ResizedWebPImagesCardField
          }
        }
        tags {
          id
          name
        }
      }
    }
  }
  ${resizeImagesCardFragment}
  ${resizeWebpImagesCardFragment}
`
