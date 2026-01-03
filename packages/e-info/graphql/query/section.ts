import gql from 'graphql-tag'

import {
  resizeImagesFragment,
  resizeWebpImagesFragment,
} from '~/graphql/fragments/resized-images'
import type { ResizedImages } from '~/types/common'

export type SectionPost = {
  id: string
  title: string
  publishTime: string
  heroImage: {
    resized: ResizedImages | null
    resizedWebp: ResizedImages | null
  } | null
}

export type SectionCategory = {
  id: string
  slug: string
  name: string
  postsCount: number
  posts: SectionPost[]
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
    resized: ResizedImages | null
    resizedWebp: ResizedImages | null
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
    resized: ResizedImages | null
    resizedWebp: ResizedImages | null
  } | null
}

export type Topic = {
  id: string
  title: string
  status: string
  content: string | null
  heroImage: {
    resized: ResizedImages | null
    resizedWebp: ResizedImages | null
  } | null
  postsCount: number
  posts: TopicPost[]
  isPinned: boolean
}

export type HomepagePickPost = {
  id: string
  title: string
  publishTime: string
  heroImage: {
    resized: ResizedImages | null
    resizedWebp: ResizedImages | null
  } | null
}

export type HomepagePick = {
  id: string
  sortOrder: number
  customUrl: string | null
  customTitle: string | null
  customDescription: string | null
  customImage: {
    resized: ResizedImages | null
    resizedWebp: ResizedImages | null
  } | null
  posts: HomepagePickPost | null
  category: {
    id: string
    slug: string
    name: string
  } | null
}

export const topicsWithPosts = gql`
  query ($postsPerTopic: Int = 4) {
    topics(where: { status: { equals: "published" } }) {
      id
      title
      status
      content
      heroImage {
        resized {
          ...ResizedImagesField
        }
        resizedWebp {
          ...ResizedWebPImagesField
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
            ...ResizedImagesField
          }
          resizedWebp {
            ...ResizedWebPImagesField
          }
        }
      }
      isPinned
    }
  }
  ${resizeImagesFragment}
  ${resizeWebpImagesFragment}
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
            ...ResizedImagesField
          }
          resizedWebp {
            ...ResizedWebPImagesField
          }
        }
      }
    }
  }
  ${resizeImagesFragment}
  ${resizeWebpImagesFragment}
`

export const sectionWithCategoriesAndPosts = gql`
  query ($sectionId: ID!, $postsPerCategory: Int = 3) {
    sections(where: { id: { equals: $sectionId } }) {
      id
      slug
      name
      categories {
        id
        slug
        name
        postsCount
        posts(take: $postsPerCategory, orderBy: { publishTime: desc }) {
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
      }
    }
  }
  ${resizeImagesFragment}
  ${resizeWebpImagesFragment}
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

// Query for homepage carousel picks
// Filter by category slug "homepepicks" (首頁輪播文章)
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
    resized: ResizedImages | null
    resizedWebp: ResizedImages | null
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
          ...ResizedImagesField
        }
        resizedWebp {
          ...ResizedWebPImagesField
        }
      }
    }
  }
  ${resizeImagesFragment}
  ${resizeWebpImagesFragment}
`
