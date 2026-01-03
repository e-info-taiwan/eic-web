import React from 'react'
import styled from 'styled-components'

import type { InfoGraph } from '~/graphql/query/section'

type InforgraphicProps = {
  infoGraph: InfoGraph | null
}

// Helper function to convert YouTube URL to embed URL
const getYoutubeEmbedUrl = (url: string | null): string | null => {
  if (!url) return null

  // Handle various YouTube URL formats
  // https://www.youtube.com/watch?v=VIDEO_ID
  // https://youtu.be/VIDEO_ID
  // https://www.youtube.com/embed/VIDEO_ID
  let videoId: string | null = null

  if (url.includes('youtube.com/watch')) {
    const urlParams = new URL(url).searchParams
    videoId = urlParams.get('v')
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0]
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('youtube.com/embed/')[1]?.split('?')[0]
  }

  if (videoId) {
    return `https://www.youtube-nocookie.com/embed/${videoId}`
  }

  return url
}

// Styled Components
const BackgroundContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.primary['95']};
`

const Container = styled.div`
  margin: 0 auto;
  padding: 0;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px 0;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 48px 60px;
    max-width: 1200px;
  }
`

const Title = styled.h2`
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.primary['20']};
  margin: 0;
  text-align: center;
  padding: 0 40px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 0;
    font-size: 28px;
    line-height: 32px;
    max-width: 680px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 28px;
    line-height: 32px;
    max-width: 680px;
  }
`

const Excerpt = styled.p`
  color: ${({ theme }) => theme.colors.grayscale['20']};
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  padding: 0 40px;
  margin-top: 20px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 0;
    font-weight: 500;
    font-size: 18px;
    margin-top: 24px;
    max-width: 680px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 18px;
    margin-top: 52px;
  }
`

const VideoWrapper = styled.div`
  aspect-ratio: 16 / 9;
  width: 100%;
  position: relative;
  padding: 0 60px;
  margin-top: 14px;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    margin-top: 24px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    margin-top: 52px;
  }
`

const Inforgraphic = ({ infoGraph }: InforgraphicProps) => {
  // Don't render if no infoGraph data
  if (!infoGraph) {
    return null
  }

  const embedUrl = getYoutubeEmbedUrl(infoGraph.youtubeUrl)

  return (
    <BackgroundContainer>
      <Container>
        {infoGraph.title && <Title>{infoGraph.title}</Title>}
        {infoGraph.description && <Excerpt>{infoGraph.description}</Excerpt>}
        {embedUrl && (
          <VideoWrapper>
            <iframe
              src={embedUrl}
              title={infoGraph.title || 'YouTube video player'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </VideoWrapper>
        )}
      </Container>
    </BackgroundContainer>
  )
}

export default Inforgraphic
