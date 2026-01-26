import gql from 'graphql-tag'

import { resizeImagesFragment } from '~/graphql/fragments/resized-images'
import type { Poll } from '~/graphql/query/post'

// Newsletter type definition (for list view)
export type Newsletter = {
  id: string
  title: string
  sendDate: string
  heroImage: {
    resized: {
      original: string
      w480: string
      w800: string
    }
  } | null
}

// Newsletter detail type definition (for detail page)
export type NewsletterDetail = {
  id: string
  title: string
  sendDate: string
  heroImage: {
    resized: {
      original: string
      w480: string
      w800: string
      w1200: string
    }
  } | null
  standardHtml: string | null
  originalUrl: string | null
  readerResponseTitle: string | null
  readerResponseLink: string | null
  readerResponseText: string | null
  poll: Poll | null
}

// Query to get newsletters by date range
export const newslettersByDateRange = gql`
  query GetNewslettersByDateRange(
    $startDate: DateTime!
    $endDate: DateTime!
    $take: Int
    $skip: Int
  ) {
    newsletters(
      where: { sendDate: { gte: $startDate, lte: $endDate } }
      orderBy: { sendDate: desc }
      take: $take
      skip: $skip
    ) {
      id
      title
      sendDate
      heroImage {
        resized {
          ...ResizedImagesField
        }
      }
    }
    newslettersCount(where: { sendDate: { gte: $startDate, lte: $endDate } })
  }
  ${resizeImagesFragment}
`

// Query to get the year range of available newsletters (from 2000 onwards)
export const newsletterYearRange = gql`
  query GetNewsletterYearRange {
    oldest: newsletters(
      orderBy: { sendDate: asc }
      take: 1
      where: { sendDate: { gte: "2000-01-01T00:00:00.000Z" } }
    ) {
      sendDate
    }
    newest: newsletters(orderBy: { sendDate: desc }, take: 1) {
      sendDate
    }
  }
`

// Query to get newsletters for a specific month
export const newslettersByMonth = gql`
  query GetNewslettersByMonth($startDate: DateTime!, $endDate: DateTime!) {
    newsletters(
      where: { sendDate: { gte: $startDate, lte: $endDate } }
      orderBy: { sendDate: asc }
    ) {
      id
      title
      sendDate
      heroImage {
        resized {
          ...ResizedImagesField
        }
      }
    }
  }
  ${resizeImagesFragment}
`

// Query to get a single newsletter by ID
export const newsletterById = gql`
  query GetNewsletterById($id: ID!) {
    newsletter(where: { id: $id }) {
      id
      title
      sendDate
      heroImage {
        resized {
          ...ResizedImagesField
        }
      }
      standardHtml
      originalUrl
      readerResponseTitle
      readerResponseLink
      readerResponseText
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
    }
  }
  ${resizeImagesFragment}
`

// Query to find newsletter by originalUrl (for redirect from /node/[id])
export const newsletterByOriginalUrl = gql`
  query GetNewsletterByOriginalUrl($url: String!) {
    newsletters(where: { originalUrl: { contains: $url } }, take: 1) {
      id
    }
  }
`
