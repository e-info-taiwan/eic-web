import gql from 'graphql-tag'

import { resizeImagesFragment } from '~/graphql/fragments/resized-images'

// Newsletter type definition
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

// Query to get the year range of available newsletters
export const newsletterYearRange = gql`
  query GetNewsletterYearRange {
    oldest: newsletters(orderBy: { sendDate: asc }, take: 1) {
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
