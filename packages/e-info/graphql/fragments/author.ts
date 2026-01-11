import gql from 'graphql-tag'

import type { GenericAuthor } from '~/types/common'

export type AuthorImage = {
  id: string
  resized: {
    original: string
    w480: string
    w800: string
  } | null
  resizedWebp: {
    original: string
    w480: string
    w800: string
  } | null
}

export type Author = Pick<GenericAuthor, 'id' | 'name'> & {
  bio?: string | null
  image?: AuthorImage | null
}

export const authorFragment = gql`
  fragment AuthorFields on Author {
    id
    name
    bio
    image {
      id
      resized {
        original
        w480
        w800
      }
      resizedWebp {
        original
        w480
        w800
      }
    }
  }
`
