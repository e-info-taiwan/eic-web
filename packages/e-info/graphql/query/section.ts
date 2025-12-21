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
