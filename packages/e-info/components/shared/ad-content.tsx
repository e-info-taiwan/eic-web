import SharedImage from '@readr-media/react-image'
import React from 'react'
import styled from 'styled-components'

import type { Ad } from '~/graphql/query/section'

import Placeholder from './placeholder'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0;
  width: 100%;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    flex-direction: row;
    padding: 0 40px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 76px 156px 0 156px;
  }
`

const StyledPlaceholder = styled(Placeholder)`
  flex: 1;
  min-width: 0;
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
  // If no ads, show placeholder
  if (ads.length === 0) {
    return (
      <Container>
        <StyledPlaceholder height={200} />
        <StyledPlaceholder height={200} />
      </Container>
    )
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
      {/* If only 1 ad, show placeholder for second slot */}
      {displayAds.length === 1 && <StyledPlaceholder height={200} />}
    </Container>
  )
}

export default AdContent
