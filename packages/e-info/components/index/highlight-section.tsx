import React from 'react'
import styled from 'styled-components'

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`

const AccentBar = styled.div`
  background-color: #f97316;
  width: 80px;
  height: 32px;
  margin-right: 0.75rem;
  border-bottom-right-radius: 12px;
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  line-height: 32px;
  color: #232333;
  margin: 0;
`

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const ArticleCard = styled.div`
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: row;
`

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  margin-bottom: 0.75rem;
  margin-right: 12px;
`

const ArticleImage = styled.img`
  width: 160px;
  height: 106px;
  object-fit: cover;
  transition: transform 0.3s ease;
`

const ArticleTitle = styled.h3`
  flex: 1;
  font-size: 18px;
  font-weight: 700;
  color: #dd8346;
  line-height: 1.5;
  margin: 0;
  transition: color 0.3s ease;

  ${ArticleCard}:hover & {
    color: #5b9d68;
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
