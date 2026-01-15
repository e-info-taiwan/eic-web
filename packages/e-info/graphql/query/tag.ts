import gql from 'graphql-tag'

import { POST_STYLES } from '~/constants/constant'
import type { PostCard } from '~/graphql/fragments/post'
import { postCardFragment } from '~/graphql/fragments/post'
import type { GenericTag, Override } from '~/types/common'
import { convertToStringList } from '~/utils/common'

export type Tag = Override<
  Pick<GenericTag, 'id' | 'name' | 'posts'>,
  {
    posts?: PostCard[]
  }
>

const tags = gql`
  query (
    $tagName: String
    $postSkip: Int = 0
    $relatedPostFirst: Int = 12
    $relatedPostTypes: [String!] = [${convertToStringList(POST_STYLES)}]
  ) {
    tags ( where: {
      name: { equals: $tagName  }
    } ) {
      id
      name
      posts (
        take: $relatedPostFirst
        skip: $postSkip
        where: {
          state: { equals: "published" }
          style: { in: $relatedPostTypes }
        }
        orderBy: { publishTime: desc }
      ) {
        ...PostFieldsCard
      }
    }
  }
  ${postCardFragment}
`

export { tags }
