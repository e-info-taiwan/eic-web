import { gql } from '@apollo/client'

// Type for donation data
export type Donation = {
  id: string
  title: string | null
  subtitle: string | null
  description: string | null
  donationUrl: string | null
  image: {
    resized: {
      original: string | null
      w480: string | null
      w800: string | null
    } | null
  } | null
}

// Backwards compatibility alias
export type LightboxDonation = Donation

// Query to fetch the most recent active donation
// Ordered by createdAt descending, take 1
export const donationQuery = gql`
  query GetDonation {
    donations(
      where: {
        donationType: { equals: "lightbox" }
        state: { equals: "active" }
      }
      orderBy: { createdAt: desc }
      take: 1
    ) {
      id
      title
      subtitle
      description
      donationUrl
      image {
        resized {
          original
          w480
          w800
        }
      }
    }
  }
`

// Backwards compatibility alias
export const lightboxDonationQuery = donationQuery
