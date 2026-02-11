import gql from 'graphql-tag'

import { POST_STYLES } from '~/constants/constant'
import type { PhotoWithResizedCard, PostCard } from '~/graphql/fragments/post'
import { postCardFragment } from '~/graphql/fragments/post'
import { resizeImagesCardFragment } from '~/graphql/fragments/resized-images'
import type { GenericCategory, Override } from '~/types/common'
import { convertToStringList } from '~/utils/common'
import { publishedStateFilter } from '~/utils/preview'

export type Category = Override<
  Pick<
    GenericCategory,
    | 'id'
    | 'slug'
    | 'title'
    | 'posts'
    | 'ogImage'
    | 'ogDescription'
    | 'updatedAt'
    | 'createdAt'
    | 'sortOrder'
  >,
  {
    posts?: PostCard[]
    ogImage?: PhotoWithResizedCard | null
  }
>

export type CategoryWithoutPosts = Override<
  Pick<GenericCategory, 'id' | 'slug' | 'title' | 'ogImage' | 'ogDescription'>,
  {
    ogImage?: PhotoWithResizedCard | null
  }
>

const categories = gql`
  query (
    $first: Int
    $slug: String
    $relatedPostFirst: Int = 4
    $postSkip: Int
    $shouldQueryRelatedPost: Boolean = false
    $relatedPostTypes: [String!] = [${convertToStringList(POST_STYLES)}]
  ) {
    categories(
      take: $first
      where: {
        state: { equals: "true" }
        slug: { equals: $slug }
      }
      orderBy: { sortOrder: asc }
    ) {
      id
      slug
      title
      updatedAt
      createdAt
      sortOrder
      posts: relatedPost(
        take: $relatedPostFirst
        skip: $postSkip
        where: {
          ${publishedStateFilter}
          style: { in: $relatedPostTypes }
        }
        orderBy: { publishTime: desc }
      ) @include(if: $shouldQueryRelatedPost) {
        ...PostFieldsCard
      }
      ogDescription
      ogImage {
        resized {
          ...ResizedImagesCardField
        }
      }

    }
  }
  ${postCardFragment}
  ${resizeImagesCardFragment}
`

export { categories }
