import gql from 'graphql-tag'

import { POST_STYLES, REPORT_STYLES } from '~/constants/constant'
import { Author, authorFragment } from '~/graphql/fragments/author'
import {
  Post,
  postCardFragment,
  PostCard,
  postFragment,
} from '~/graphql/fragments/post'
import {
  resizeImagesFragment,
  resizeWebpImagesFragment,
} from '~/graphql/fragments/resized-images'
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

export type Location = {
  id: string
  name: string
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

export type PostAd = {
  id: string
  name: string | null
  state: string | null
  imageUrl: string | null
  image: PhotoWithResizedOnly | null
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
    reporters: Author[] // 記者
    translators: Author[] // 編譯
    reviewers: Author[] // 審校
    writers: Author[] // 文
    sources: Author[] // 稿源
    section: Section | null
    category: Category | null
    topic: Topic | null
    locations: Location[]
    relatedPosts: Post[]
    tags: Tag[]
    brief: any // JSON type for draft-js content
    briefApiData: any // JSON type for API format
    contentApiData: any // JSON type for API format
    citations: string | null
    attachments: Attachment[]
    poll: Poll | null
    ad1: PostAd | null
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

      locations {
        id
        name
      }

      reporters {
        ...AuthorFields
      }
      translators {
        ...AuthorFields
      }
      reviewers {
        ...AuthorFields
      }
      writers {
        ...AuthorFields
      }
      sources {
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

      ad1 {
        id
        name
        state
        imageUrl
        image {
          resized {
            ...ResizedImagesField
          }
          resizedWebp {
            ...ResizedWebPImagesField
          }
        }
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
  ${resizeWebpImagesFragment}
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
      ...PostFieldsCard
    }
  }
  ${postCardFragment}
`

const authorPosts = gql`
  query ($authorId: ID, $first: Int! = 12, $skip: Int! = 0) {
    authorPosts: posts(
      take: $first
      skip: $skip
      where: {
        OR: [
          { reporters: { some: { id: { equals: $authorId } } } }
          { translators: { some: { id: { equals: $authorId } } } }
          { reviewers: { some: { id: { equals: $authorId } } } }
          { writers: { some: { id: { equals: $authorId } } } }
          { sources: { some: { id: { equals: $authorId } } } }
        ]
        state: { equals: "published" }
        style: {
          in: [${convertToStringList(postStyles)}]
        }
      }
      orderBy: { publishTime: desc }
    ) {
      ...PostFieldsCard
    }
  }
  ${postCardFragment}
`

export { authorPosts, latestPosts, post }
export type { PostCard }
