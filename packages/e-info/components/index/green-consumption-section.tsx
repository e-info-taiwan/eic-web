import React from 'react'
import styled from 'styled-components'

// Styled Components
const SectionContainer = styled.section`
  background-color: #388a48;
  padding: 24px 0 20px;
  margin: 32px 0 0;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 40px 0px;
    margin: 60px 0;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 100px 12px;
  }
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
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
  background-color: ${({ theme }) => theme.colors.primary[100]};
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
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[100]};
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
  color: ${({ theme }) => theme.colors.grayscale[20]};
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  cursor: pointer;
  padding: 0.25rem 0;
  transition: color 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[100]};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary[100]};
  }
`

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
    padding: 0 18px;
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
    flex-direction: column;
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
    margin-bottom: 12px;
  }
`

const ArticleImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;
`

const ArticleTitle = styled.h3`
  flex: 1;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[100]};
  line-height: 1.5;
  margin: 0;
  transition: color 0.3s ease;

  ${ArticleCard}:hover & {
    color: ${({ theme }) => theme.colors.secondary[20]};
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 18px;
  }
`

// Sample data
const articlesData = [
  {
    id: 1,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    alt: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    image:
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&h=400&fit=crop',
  },
  {
    id: 2,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    alt: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    image:
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&h=400&fit=crop',
  },
  {
    id: 3,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    alt: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
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
            <CategoryTab>次分類範例文字1</CategoryTab>
            <CategoryTab>次分類範例文字2</CategoryTab>
            <CategoryTab>次分類範例文字3</CategoryTab>
            <CategoryTab>次分類範例文字4</CategoryTab>
          </CategoryTabs>
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
    </SectionContainer>
  )
}

export default GreenConsumptionSection
