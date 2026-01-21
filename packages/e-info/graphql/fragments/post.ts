import gql from 'graphql-tag'

import type {
  GenericPost,
  GenericTag,
  Override,
  PhotoWithResizedOnly,
} from '~/types/common'

import {
  resizeImagesCardFragment,
  resizeImagesFragment,
  resizeWebpImagesCardFragment,
  resizeWebpImagesFragment,
} from './resized-images'

export type PostTag = Pick<GenericTag, 'id' | 'name'>

export type ContentApiDataBlock = {
  id: string
  type: string
  content?: string[]
  styles?: Record<string, unknown>
  alignment?: string
}

// Type for card images (limited sizes: original, w480, w800)
export type ResizedImagesCard = {
  original: string
  w480: string
  w800: string
}

export type PhotoWithResizedCard = {
  resized: ResizedImagesCard | null
  resizedWebp: ResizedImagesCard | null
}

// Post type with full image sizes (for detail pages)
export type Post = Override<
  Pick<
    GenericPost,
    'id' | 'style' | 'title' | 'publishTime' | 'heroImage' | 'ogImage' | 'tags'
  >,
  {
    heroImage: PhotoWithResizedOnly | null
    ogImage: PhotoWithResizedOnly | null
    tags: PostTag[]
    brief?: string | Record<string, unknown> | null
    contentApiData?: ContentApiDataBlock[] | null
  }
>

// Post type with card image sizes (for listings, cards)
export type PostCard = Override<
  Pick<
    GenericPost,
    'id' | 'style' | 'title' | 'publishTime' | 'heroImage' | 'ogImage' | 'tags'
  >,
  {
    heroImage: PhotoWithResizedCard | null
    ogImage: PhotoWithResizedCard | null
    tags: PostTag[]
    brief?: string | Record<string, unknown> | null
    contentApiData?: ContentApiDataBlock[] | null
  }
>

// Full fragment - use for post detail pages, related posts on detail page
export const postFragment = gql`
  fragment PostFields on Post {
    id
    style
    title
    heroImage {
      resized {
        ...ResizedImagesField
      }
      resizedWebp {
        ...ResizedWebPImagesField
      }
    }
    ogImage {
      resized {
        ...ResizedImagesField
      }
      resizedWebp {
        ...ResizedWebPImagesField
      }
    }
    publishTime
    tags {
      id
      name
    }
    brief
    contentApiData
  }
  ${resizeImagesFragment}
  ${resizeWebpImagesFragment}
`

// Card fragment - use for post cards, thumbnails, listings
// Includes contentApiData for summary fallback when brief is empty
export const postCardFragment = gql`
  fragment PostFieldsCard on Post {
    id
    style
    title
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
    publishTime
    tags {
      id
      name
    }
    brief
    contentApiData
  }
  ${resizeImagesCardFragment}
  ${resizeWebpImagesCardFragment}
`
