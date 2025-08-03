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
  flex-wrap: wrap;
`

const AccentBar = styled.div`
  background-color: #388a48;
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
  margin-right: 2rem;
`

const CategoryTabs = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`

const CategoryTab = styled.button`
  background: none;
  border: none;
  color: #373740;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  cursor: pointer;
  padding: 0.25rem 0;
  transition: color 0.3s ease;

  &:hover {
    color: #388a48;
  }

  &.active {
    color: #388a48;
  }
`

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const ArticleCard = styled.div`
  position: relative;
  cursor: pointer;
  overflow: hidden;
`

const ArticleImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;

  @media (min-width: 768px) {
    height: 280px;
  }
`

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    transparent 100%
  );
  padding: 1.5rem 1rem 1rem;
  color: white;
`

const ArticleTitle = styled.h3`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`

// Sample data
const articlesData = [
  {
    id: 1,
    title: '再生能源承諾當前，菲律賓卻「燒瘋」難戒',
    image:
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=500&h=350&fit=crop',
  },
  {
    id: 2,
    title: '組筆電像拼樂高、熱水壺自己換零件 創新設計讓消費者變身修理達人',
    image:
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&h=350&fit=crop',
  },
  {
    id: 3,
    title: '再生能源承諾當前，菲律賓卻「燒瘋」難戒',
    image:
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=500&h=350&fit=crop',
  },
  {
    id: 4,
    title: '再生能源承諾當前，菲律賓卻「燒瘋」難戒',
    image:
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=500&h=350&fit=crop',
  },
  {
    id: 5,
    title: '組筆電像拼樂高、熱水壺自己換零件 創新設計讓消費者變身修理達人',
    image:
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&h=350&fit=crop',
  },
  {
    id: 6,
    title: '再生能源承諾當前，菲律賓卻「燒瘋」難戒',
    image:
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=500&h=350&fit=crop',
  },
]

const SpecialColumnSection = () => {
  return (
    <Container>
      {/* Header */}
      <Header>
        <AccentBar />
        <Title>專欄</Title>
        <CategoryTabs>
          <CategoryTab className="active">次分類範例文字1</CategoryTab>
          <CategoryTab>次分類範例文字2</CategoryTab>
          <CategoryTab>次分類範例文字3</CategoryTab>
          <CategoryTab>次分類範例文字4</CategoryTab>
        </CategoryTabs>
      </Header>

      {/* Articles Grid */}
      <ArticlesGrid>
        {articlesData.map((article) => (
          <ArticleCard key={article.id}>
            <ArticleImage src={article.image} alt={article.title} />
            <ImageOverlay>
              <ArticleTitle>{article.title}</ArticleTitle>
            </ImageOverlay>
          </ArticleCard>
        ))}
      </ArticlesGrid>
    </Container>
  )
}

export default SpecialColumnSection
