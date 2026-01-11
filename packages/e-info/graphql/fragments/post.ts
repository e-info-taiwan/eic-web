import gql from 'graphql-tag'

import type {
  GenericPost,
  GenericTag,
  Override,
  PhotoWithResizedOnly,
} from '~/types/common'

import {
  resizeImagesFragment,
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
