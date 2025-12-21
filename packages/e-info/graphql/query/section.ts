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
  brief: string | null
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
