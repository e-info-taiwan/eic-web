import React from 'react'
import styled from 'styled-components'

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

const ArticleCard = styled.div`
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 200px;

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

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    margin-bottom: 0.75rem;
    margin-right: 12px;
  }
`

const ArticleImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  aspect-ratio: attr(width) / attr(height);

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    width: 160px;
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

// Articles data
const articlesData = [
  {
    id: 1,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
    alt: 'Speaker at podium',
  },
  {
    id: 2,
    title: '走進彼桑拉返，看見傳統現代交融的布農豆豆班',
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
    alt: 'Traditional market scene',
  },
  {
    id: 3,
    title: '走進彼桑拉返，看見傳統現代交融的布農豆豆班',
    image:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop',
    alt: 'Modern building complex',
  },
]

const HighlightSection = () => {
  return (
    <Container>
      {/* Header */}
      <Header>
        <AccentBar />
        <Title>焦點話題</Title>
      </Header>

      {/* Articles Grid */}
      <ArticlesGrid>
        {articlesData.map((article) => (
          <ArticleCard key={article.id}>
            <ImageContainer>
              <ArticleImage src={article.image} alt={article.alt} />
            </ImageContainer>
            <ArticleTitle>{article.title}</ArticleTitle>
          </ArticleCard>
        ))}
      </ArticlesGrid>
    </Container>
  )
}

export default HighlightSection
