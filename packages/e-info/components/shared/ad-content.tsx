import SharedImage from '@readr-media/react-image'
import React from 'react'
import styled from 'styled-components'

import { MAX_CONTENT_WIDTH } from '~/constants/layout'
import type { Ad } from '~/graphql/query/section'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 0;
  width: 100%;
  max-width: ${MAX_CONTENT_WIDTH};
  margin: 0 auto;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    flex-direction: row;
    justify-content: center;
    padding: 0 18px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    gap: 48px;
    padding: 66px 52px 0;
  }
`

const AdLink = styled.a`
  display: block;
  text-decoration: none;
  cursor: pointer;
`

const AdImageWrapper = styled.div`
  width: 332px;
  max-width: 100%;
  height: 188px;
  overflow: hidden;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    width: 420px;
    height: 180px;
  }

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
                objectFit='contain'
                rwd={{
                  mobile: '332px',
                  tablet: '332px',
                  desktop: '420px',
                  default: '420px',
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
