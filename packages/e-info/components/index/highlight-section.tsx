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
  width: 1rem;
  height: 2rem;
  margin-right: 0.75rem;
`

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
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

  &:hover {
    transform: translateY(-2px);
  }
`

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 0.75rem;
`

const ArticleImage = styled.img`
  width: 100%;
  height: 12rem;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ArticleCard}:hover & {
    transform: scale(1.05);
  }
`

const ArticleTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
  margin: 0;
  transition: color 0.3s ease;

  ${ArticleCard}:hover & {
    color: #f97316;
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
  {
    id: 4,
    title: '深度報導：台灣咖啡文化的興起與發展',
    image:
      'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c?w=400&h=250&fit=crop',
    alt: 'Coffee and reading',
  },
  {
    id: 5,
    title: '小店經濟復甦：疫情後的新商業模式',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop',
    alt: 'Store front',
  },
  {
    id: 6,
    title: '科技創新驅動：台灣數位轉型新趨勢',
    image:
      'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop',
    alt: 'Tech workspace',
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
