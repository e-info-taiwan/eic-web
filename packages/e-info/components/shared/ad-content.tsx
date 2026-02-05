import SharedImage from '@readr-media/react-image'
import React from 'react'
import styled from 'styled-components'

import type { Ad } from '~/graphql/query/section'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    flex-direction: row;
    padding: 0 18px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 66px 52px 0;
  }
`

const AdLink = styled.a`
  display: block;
  flex: 1;
  text-decoration: none;
  cursor: pointer;
`

const AdImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

type AdContentProps = {
  ads?: Ad[]
}

const AdContent: React.FC<AdContentProps> = ({ ads = [] }) => {
  // If no ads, hide the section completely
  if (ads.length === 0) {
    return null
  }

  // Show up to 2 ads
  const displayAds = ads.slice(0, 2)

  return (
    <Container>
      {displayAds.map((ad) => {
        const image = ad.image?.resized
        const imageWebp = ad.image?.resizedWebp

        // If ad has imageUrl, use it as click-through link
        const linkUrl = ad.imageUrl || '#'

        return (
          <AdLink
            key={ad.id}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <AdImageWrapper>
              <SharedImage
                images={image || {}}
                imagesWebP={imageWebp || {}}
                alt={ad.name || '廣告'}
                priority={false}
                rwd={{
                  mobile: '100vw',
                  tablet: '50vw',
                  desktop: '400px',
                  default: '400px',
                }}
              />
            </AdImageWrapper>
          </AdLink>
        )
      })}
    </Container>
  )
}

export default AdContent
