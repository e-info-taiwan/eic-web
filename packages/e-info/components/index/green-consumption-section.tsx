import React from 'react'
import styled from 'styled-components'

// Styled Components
const SectionContainer = styled.section`
  background-color: #388a48;
  padding: 3rem 1rem;
  margin: 3rem 0 0;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`

const AccentBar = styled.div`
  background-color: white;
  width: 80px;
  height: 32px;
  margin-right: 0.75rem;
  border-bottom-right-radius: 12px;
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  line-height: 32px;
  color: #fff;
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

  &:hover {
    color: #fff;
  }

  &.active {
    color: #fff;
  }
`

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 90px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const ArticleCard = styled.div`
  cursor: pointer;
  overflow: hidden;
`

const ArticleImage = styled.img`
  width: 100%;
  height: 190px;
  object-fit: cover;
`

const ArticleContent = styled.div`
  padding-top: 12px;
`

const ArticleTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  margin: 0;
  color: white;

  ${ArticleCard}:hover & {
    color: #dd8346;
  }

  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`

// Sample data
const articlesData = [
  {
    id: 1,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    image:
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&h=400&fit=crop',
  },
  {
    id: 2,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    image:
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&h=400&fit=crop',
  },
  {
    id: 3,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    image:
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&h=400&fit=crop',
  },
]

const GreenConsumptionSection = () => {
  return (
    <SectionContainer>
      <Container>
        {/* Header */}
        <Header>
          <AccentBar />
          <Title>綠色消費</Title>
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
              <ArticleContent>
                <ArticleTitle>{article.title}</ArticleTitle>
              </ArticleContent>
            </ArticleCard>
          ))}
        </ArticlesGrid>
      </Container>
    </SectionContainer>
  )
}

export default GreenConsumptionSection
