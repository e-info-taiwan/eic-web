import gql from 'graphql-tag'

import { POST_STYLES, REPORT_STYLES } from '~/constants/constant'
import { Author, authorFragment } from '~/graphql/fragments/author'
import { Post, postFragment } from '~/graphql/fragments/post'
import { resizeImagesFragment } from '~/graphql/fragments/resized-images'
import type {
  GenericCategory,
  GenericPost,
  GenericTag,
  Override,
  PhotoWithResizedOnly,
} from '~/types/common'
import { convertToStringList } from '~/utils/common'

export type Category = {
  id: string
  name: string
  slug: string
}

export type Tag = Pick<GenericTag, 'id' | 'name'>

export type Section = {
  id: string
  name: string
  slug: string
}

export type Topic = {
  id: string
  title: string
}

export type Attachment = {
  id: string
  name: string
  description: string | null
  file: {
    filename: string
    filesize: number
    url: string
  } | null
  embedCode: string | null
}

export type PollOptionImage = {
  resized: {
    original: string
    w480: string
  } | null
}

export type Poll = {
  id: string
  name: string
  content: string | null
  option1: string | null
  option2: string | null
  option3: string | null
  option4: string | null
  option5: string | null
  option1Image: PollOptionImage | null
  option2Image: PollOptionImage | null
  option3Image: PollOptionImage | null
  option4Image: PollOptionImage | null
  option5Image: PollOptionImage | null
  status: string | null
}

export type PostDetail = Override<
  Post &
    Pick<
      GenericPost,
      'heroCaption' | 'content' | 'subtitle' | 'otherByline' | 'state'
    >,
  {
    heroImage: PhotoWithResizedOnly | null
    ogImage: PhotoWithResizedOnly | null
    author1: Author | null
    author2: Author | null
    author3: Author | null
    section: Section | null
    category: Category | null
    topic: Topic | null
    relatedPosts: Post[]
    tags: Tag[]
    brief: any // JSON type for draft-js content
    briefApiData: any // JSON type for API format
    contentApiData: any // JSON type for API format
    citations: string | null
    attachments: Attachment[]
    poll: Poll | null
  }
>

export const postStyles = [...POST_STYLES, ...REPORT_STYLES]

const post = gql`
  query ($id: ID!) {
    posts ( where: {
      state: { equals: "published" }
      id: { equals: $id }
      style: {
        in: [${convertToStringList(postStyles)}]
      }
      })  {
      ...PostFields

      state
      subtitle
      content
      contentApiData
      brief
      briefApiData
      heroCaption
      citations

      section {
        id
        name
        slug
      }
      category {
        id
        name
        slug
      }
      topic {
        id
        title
      }

      author1 {
        ...AuthorFields
      }
      author2 {
        ...AuthorFields
      }
      author3 {
        ...AuthorFields
      }

      otherByline

      tags {
        id
        name
      }

      attachments {
        id
        name
        description
        file {
          filename
          filesize
          url
        }
        embedCode
      }

      poll {
        id
        name
        content
        option1
        option2
        option3
        option4
        option5
        option1Image {
          resized {
            original
            w480
          }
        }
        option2Image {
          resized {
            original
            w480
          }
        }
        option3Image {
          resized {
            original
            w480
          }
        }
        option4Image {
          resized {
            original
            w480
          }
        }
        option5Image {
          resized {
            original
            w480
          }
        }
        status
      }

      relatedPosts (
        where: {
           state: { equals: "published" }
           style: {
             in: [${convertToStringList(postStyles)}]
           }
         },
        orderBy: { publishTime: desc }
      ) {
        ...PostFields
      }
    }
  }
  ${resizeImagesFragment}
  ${authorFragment}
  ${postFragment}
`

const latestPosts = gql`
  query  (
    $first: Int! = 3, 
    $skip: Int! = 0
    $skipId: ID
  ) {
    latestPosts: posts(
      take: $first
      skip: $skip
      where: {
        id: { not: { equals: $skipId } }
        state: { equals: "published" }
        style: {
          in: [${convertToStringList(postStyles)}]
        }
      }
      orderBy: { publishTime: desc }
    ) {
      ...PostFields
    }
  }
  ${postFragment}
`

const authorPosts = gql`
  query ($authorId: ID, $first: Int! = 12, $skip: Int! = 0) {
    authorPosts: posts(
      take: $first
      skip: $skip
      where: {
        OR: [
          { author1: { id: { equals: $authorId } } }
          { author2: { id: { equals: $authorId } } }
          { author3: { id: { equals: $authorId } } }
        ]
        state: { equals: "published" }
        style: {
          in: [${convertToStringList(postStyles)}]
        }
      }
      orderBy: { publishTime: desc }
    ) {
      ...PostFields
    }
  }
  ${postFragment}
`

export { authorPosts, latestPosts, post }
