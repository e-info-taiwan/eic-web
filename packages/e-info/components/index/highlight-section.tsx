import SharedImage from '@readr-media/react-image'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'

import { DEFAULT_POST_IMAGE_PATH } from '~/constants/constant'
import type { CategoryPost } from '~/graphql/query/section'

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 0 28px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 34px 48px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 48px 0;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding-left: 0;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding-left: 78px;
    justify-content: normal;
  }
`

const AccentBar = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary[20]};
  width: 60px;
  height: 20px;
  margin-right: 0.75rem;
  border-bottom-right-radius: 12px;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    width: 80px;
    height: 32px;
  }
`

const Title = styled.h1`
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  margin: 0;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 28px;
    line-height: 32px;
  }
`

const ArticlesGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0 24px;

  &::-webkit-scrollbar {
    display: none;
  }

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 24px;
    padding: 0;
    overflow-x: visible;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 0 78px;
    grid-template-columns: repeat(3, 1fr);
  }
`

const ArticleCard = styled.a`
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 200px;
  text-decoration: none;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    width: auto;
    min-width: auto;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    flex-direction: row;
    flex-shrink: 1;
    width: auto;
    min-wdith: 280px;
  }
`

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  margin-bottom: 12px;
  aspect-ratio: 160 / 107;
  background-color: #d1d5db;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    margin-bottom: 0;
    margin-right: 12px;
    width: 160px;
    height: 107px;
    flex-shrink: 0;
  }
`

const ArticleTitle = styled.h3`
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary[20]};
  line-height: 1.5;
  margin: 0;
  transition: color 0.3s ease;

  ${ArticleCard}:hover & {
    color: ${({ theme }) => theme.colors.primary[40]};
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 18px;
  }
`

const EmptyMessage = styled.p`
  text-align: center;
  color: #666;
  padding: 2rem;
  grid-column: 1 / -1;
`

type HighlightSectionProps = {
  posts?: CategoryPost[]
}

const HighlightSection = ({ posts = [] }: HighlightSectionProps) => {
  // If no posts, don't render the section
  if (posts.length === 0) {
    return null
  }

  return (
    <Container>
      {/* Header */}
      <Header>
        <AccentBar />
        <Title>焦點話題</Title>
      </Header>

      {/* Articles Grid */}
      <ArticlesGrid>
        {posts.length > 0 ? (
          posts.map((post) => {
            const image = post.heroImage?.resized
            const imageWebp = post.heroImage?.resizedWebp

            return (
              <Link
                key={post.id}
                href={`/node/${post.id}`}
                passHref
                legacyBehavior
              >
                <ArticleCard>
                  <ImageContainer>
                    <SharedImage
                      images={image || {}}
                      imagesWebP={imageWebp || {}}
                      defaultImage={DEFAULT_POST_IMAGE_PATH}
                      alt={post.title}
                      priority={false}
                      rwd={{
                        mobile: '200px',
                        tablet: '33vw',
                        desktop: '160px',
                        default: '160px',
                      }}
                    />
                  </ImageContainer>
                  <ArticleTitle>{post.title}</ArticleTitle>
                </ArticleCard>
              </Link>
            )
          })
        ) : (
          <EmptyMessage>目前沒有文章</EmptyMessage>
        )}
      </ArticlesGrid>
    </Container>
  )
}

export default HighlightSection
