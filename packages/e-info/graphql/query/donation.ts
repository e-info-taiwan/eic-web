import { gql } from '@apollo/client'

// Type for lightbox donation data
export type LightboxDonation = {
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

// Query to fetch the most recent active lightbox donation
// Ordered by createdAt descending, take 1
export const lightboxDonationQuery = gql`
  query GetLightboxDonation {
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
