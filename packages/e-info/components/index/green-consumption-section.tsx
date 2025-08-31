import React, { useState } from 'react'
import styled from 'styled-components'

// Styled Components
const SectionContainer = styled.section`
  background-color: #388a48;
  padding: 24px 0 20px;
  margin: 32px 0 0;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 40px 0px;
    margin: 60px 0 0 0;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 100px 0;
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
  font-weight: 500;
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

const CategoryTab = styled.button<{ $isActive?: boolean }>`
  background: none;
  border: none;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary[100] : theme.colors.grayscale[20]};
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
  aspect-ratio: attr(width) / attr(height);
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

// Categories and Sample data
const categories = [
  { id: 'green1', name: '次分類範例文字1' },
  { id: 'green2', name: '次分類範例文字2' },
  { id: 'green3', name: '次分類範例文字3' },
  { id: 'green4', name: '次分類範例文字4' },
]

const articlesData = {
  green1: [
    {
      id: 1,
      title: '減塑新生活 環保餐具選擇指南',
      alt: '減塑新生活 環保餐具選擇指南',
      image:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=288&h=190&fit=crop',
    },
    {
      id: 2,
      title: '線上購物綠色選擇 包裝簡化愛地球',
      alt: '線上購物綠色選擇',
      image:
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=288&h=190&fit=crop',
    },
    {
      id: 3,
      title: '線色消費指南 在地食材的環保選擇',
      alt: '線色消費指南',
      image:
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=288&h=190&fit=crop',
    },
  ],
  green2: [
    {
      id: 1,
      title: '太陽能在家庭 綠能生活新選擇',
      alt: '太陽能在家庭',
      image:
        'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=288&h=190&fit=crop',
    },
    {
      id: 2,
      title: '節能家電新指南 智慧用電省錢省能',
      alt: '節能家電新指南',
      image:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=288&h=190&fit=crop',
    },
    {
      id: 3,
      title: '電動車時代來臨 充電設施完善規劃',
      alt: '電動車時代來臨',
      image:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=288&h=190&fit=crop',
    },
  ],
  green3: [
    {
      id: 1,
      title: '循環時尚新風尚 二手衣物的美學重生',
      alt: '循環時尚新風尚',
      image:
        'https://images.unsplash.com/photo-1445205170230-053b83016050?w=288&h=190&fit=crop',
    },
    {
      id: 2,
      title: '網路交換平台 物品共享經濟的實踐',
      alt: '網路交換平台',
      image:
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=288&h=190&fit=crop',
    },
    {
      id: 3,
      title: 'DIY維修文化 讓物品延續生命力',
      alt: 'DIY維修文化',
      image:
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=288&h=190&fit=crop',
    },
  ],
  green4: [
    {
      id: 1,
      title: '都市農園興起 陰台種菜的綠色生活',
      alt: '都市農園興起',
      image:
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=288&h=190&fit=crop',
    },
    {
      id: 2,
      title: '零廢棄物生活 延續物品使用壽命',
      alt: '零廢棄物生活',
      image:
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=288&h=190&fit=crop',
    },
    {
      id: 3,
      title: '水資源保育 日常節水小技巧',
      alt: '水資源保育',
      image:
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=288&h=190&fit=crop',
    },
  ],
}

const GreenConsumptionSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>('green1')

  const currentArticles =
    articlesData[activeCategory as keyof typeof articlesData]

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId)
  }

  return (
    <SectionContainer>
      <Container>
        {/* Header */}
        <Header>
          <AccentBar />
          <Title>綠色消費</Title>
          <CategoryTabs>
            {categories.map((category) => (
              <CategoryTab
                key={category.id}
                $isActive={activeCategory === category.id}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </CategoryTab>
            ))}
          </CategoryTabs>
        </Header>

        {/* Articles Grid */}
        <ArticlesGrid>
          {currentArticles.map((article) => (
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
