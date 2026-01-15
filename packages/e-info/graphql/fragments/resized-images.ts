import gql from 'graphql-tag'

// Full image sizes - use for post detail pages, hero images, etc.
export const resizeImagesFragment = gql`
  fragment ResizedImagesField on ResizedImages {
    original
    w480
    w800
    w1200
    w1600
    w2400
  }
`

export const resizeWebpImagesFragment = gql`
  fragment ResizedWebPImagesField on ResizedWebPImages {
    original
    w480
    w800
    w1200
    w1600
    w2400
  }
`

// Card image sizes - use for post cards, thumbnails, listings
// Only includes sizes needed for cards (max ~400px display width)
export const resizeImagesCardFragment = gql`
  fragment ResizedImagesCardField on ResizedImages {
    original
    w480
    w800
  }
`

export const resizeWebpImagesCardFragment = gql`
  fragment ResizedWebPImagesCardField on ResizedWebPImages {
    original
    w480
    w800
  }
`
