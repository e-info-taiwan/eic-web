import React from 'react'
import styled from 'styled-components'

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 1rem;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`

const AccentBar = styled.div`
  background-color: #f1d5c1;
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
    color: #dd8346;
  }

  &.active {
    color: #dd8346;
  }
`

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const ArticleCard = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;

  @media (min-width: 640px) {
    flex-direction: row;
    gap: 1rem;
  }

  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 0;
  }
`

const ImagePlaceholder = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: #d1d5db;
  margin-bottom: 1rem;
  margin-right: 24px;
  flex-shrink: 0;
`

const ArticleContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: 1024px) {
    justify-content: flex-start;
  }
`

const ArticleTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #232333;
  line-height: 1.5;
  margin: 0;
  transition: color 0.3s ease;

  ${ArticleCard}:hover & {
    color: #dd8346;
  }
`

// Sample data
const articlesData = [
  {
    id: 1,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
  },
  {
    id: 2,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
  },
  {
    id: 3,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
  },
]

const SupplementSection = () => {
  return (
    <Container>
      {/* Header */}
      <Header>
        <AccentBar />
        <Title>副刊</Title>
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
            <ImagePlaceholder />
            <ArticleContent>
              <ArticleTitle>{article.title}</ArticleTitle>
            </ArticleContent>
          </ArticleCard>
        ))}
      </ArticlesGrid>
    </Container>
  )
}

export default SupplementSection
