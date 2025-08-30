import React from 'react'
import styled from 'styled-components'

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 0;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 40px 18px 0;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 66px 12px 0;
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
  background-color: ${({ theme }) => theme.colors.primary[20]};
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

const CategoryTabs = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 12px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex-wrap: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    width: 100%;
    justify-content: center;
    overflow-x: visible;
    flex-wrap: nowrap;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    width: auto;
    margin-top: 0;
    margin-left: 28px;
  }
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
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[20]};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary[20]};
  }
`

const ArticlesGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    grid-template-columns: repeat(2, 1fr);
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 0 40px;
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
  height: auto;
  object-fit: cover;
  aspect-ratio: attr(width) / attr(height);
`

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(217, 217, 217, 0.2) 20%,
    rgba(50, 50, 50, 0.7) 100%
  );
  padding: 12px;
  color: white;
`

const ArticleTitle = styled.h3`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  margin: 0;
`

// Sample data
const articlesData = [
  {
    id: 1,
    title: '再生能源承諾當前，菲律賓卻「燒瘋」難戒',
    image:
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=360&h=240&fit=crop',
  },
  {
    id: 2,
    title: '組筆電像拼樂高、熱水壺自己換零件 創新設計讓消費者變身修理達人',
    image:
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=360&h=240&fit=crop',
  },
  {
    id: 3,
    title: '再生能源承諾當前，菲律賓卻「燒瘋」難戒',
    image:
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=360&h=240&fit=crop',
  },
  {
    id: 4,
    title: '再生能源承諾當前，菲律賓卻「燒瘋」難戒',
    image:
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=360&h=240&fit=crop',
  },
  {
    id: 5,
    title: '組筆電像拼樂高、熱水壺自己換零件 創新設計讓消費者變身修理達人',
    image:
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=360&h=240&fit=crop',
  },
  {
    id: 6,
    title: '再生能源承諾當前，菲律賓卻「燒瘋」難戒',
    image:
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=360&h=240&fit=crop',
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
