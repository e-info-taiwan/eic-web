import SharedImage from '@readr-media/react-image'
import React from 'react'
import styled from 'styled-components'

import type { PostAd } from '~/graphql/query/post'

import Placeholder from '../shared/placeholder'

const Container = styled.div`
  width: 100%;
  margin: 32px 0;

  ${({ theme }) => theme.breakpoint.md} {
    margin: 48px 0;
  }
`

const AdLink = styled.a`
  display: block;
  width: 100%;
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

const PlaceholderText = styled.span`
  font-weight: 400;
  font-size: 48px;
  color: #fff;
`

type PostAdContentProps = {
  ad: PostAd | null | undefined
}

const PostAdContent: React.FC<PostAdContentProps> = ({ ad }) => {
  // If no ad or ad is not active, show placeholder
  if (!ad || ad.state !== 'active') {
    return (
      <Container>
        <Placeholder height={200}>
          <PlaceholderText>廣告 680x200</PlaceholderText>
        </Placeholder>
      </Container>
    )
  }

  const image = ad.image?.resized
  const imageWebp = ad.image?.resizedWebp
  const linkUrl = ad.imageUrl || '#'

  return (
    <Container>
      <AdLink href={linkUrl} target="_blank" rel="noopener noreferrer">
        <AdImageWrapper>
          <SharedImage
            images={image || {}}
            imagesWebP={imageWebp || {}}
            alt={ad.name || '廣告'}
            priority={false}
            rwd={{
              mobile: '100vw',
              tablet: '680px',
              desktop: '680px',
              default: '680px',
            }}
          />
        </AdImageWrapper>
      </AdLink>
    </Container>
  )
}

export default PostAdContent
