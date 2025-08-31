import React, { useState } from 'react'
import styled from 'styled-components'

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 8px 0;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 0 0;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 0;
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
  background-color: ${({ theme }) => theme.colors.secondary[60]};
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

const CategoryTab = styled.button<{ $isActive?: boolean }>`
  background: none;
  border: none;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.secondary[20] : '#373740'};
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  cursor: pointer;
  padding: 0.25rem 0;
  transition: color 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary[20]};
  }
`

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    overflow-x: visible;
    padding: 0 78px;
  }
`

const ArticleCard = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  padding: 0 16px;
  gap: 16px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    flex-direction: row;
    gap: 24px;
    padding: 0;
    flex-shrink: 0;
    width: 330px;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    flex-direction: row;
    padding: 0;
    gap: 24px;
    width: auto;
    min-width: auto;
    flex-shrink: 1;
  }
`

const ImagePlaceholder = styled.div`
  width: 100%;
  height: auto;
  object-fit: cover;
  aspect-ratio: attr(width) / attr(height);
  background-color: #d1d5db;
  flex-shrink: 0;
  max-width: 130px;
  min-height: 87px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    flex: 1;
    max-width: auto;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    flex: 1;
  }
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
  flex: 1;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  line-height: 1.5;
  margin: 0;
  transition: color 0.3s ease;

  ${ArticleCard}:hover & {
    color: ${({ theme }) => theme.colors.secondary[20]};
  }

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    font-size: 18px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 18px;
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #000;
  margin: 52px 28px 48px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    margin: 40px 44px;
  }
  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    margin-left: 78px;
    margin-right: 78px;
  }
`

// Categories and Sample data
const categories = [
  { id: 'supplement1', name: '次分類範例文字1' },
  { id: 'supplement2', name: '次分類範例文字2' },
  { id: 'supplement3', name: '次分類範例文字3' },
  { id: 'supplement4', name: '次分類範例文字4' },
]

const articlesData = {
  supplement1: [
    {
      id: 1,
      title: '文學與生活的黃金交集 現代詩歌中的情感表達',
      image:
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=130&h=87&fit=crop',
    },
    {
      id: 2,
      title: '留留那些美好的時光 散文中的温柔力量',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=130&h=87&fit=crop',
    },
    {
      id: 3,
      title: '小說中的人物塑造 當代作家的羅生劃像',
      image:
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=130&h=87&fit=crop',
    },
  ],
  supplement2: [
    {
      id: 1,
      title: '艾藝進化史 從古典美學到當代藝術',
      image:
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=130&h=87&fit=crop',
    },
    {
      id: 2,
      title: '色彩的魔法 繪畫中的情感語言',
      image:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=130&h=87&fit=crop',
    },
    {
      id: 3,
      title: '雕塑的立體詩意 空間藝術的哲學思考',
      image:
        'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=130&h=87&fit=crop',
    },
  ],
  supplement3: [
    {
      id: 1,
      title: '都市中的慢生活 咖啡香裡的哲學思考',
      image:
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=130&h=87&fit=crop',
    },
    {
      id: 2,
      title: '旅行的意義 在路上發現自己的可能',
      image:
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=130&h=87&fit=crop',
    },
    {
      id: 3,
      title: '美食與記憶 味覺裡的情感連結',
      image:
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=130&h=87&fit=crop',
    },
  ],
  supplement4: [
    {
      id: 1,
      title: '音樂的治療力量 聲音裡的情感釋放',
      image:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=130&h=87&fit=crop',
    },
    {
      id: 2,
      title: '舞台上的詩意 舞蹈表演中的身體美學',
      image:
        'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=130&h=87&fit=crop',
    },
    {
      id: 3,
      title: '燈光與影像 電影中的視覺詩學',
      image:
        'https://images.unsplash.com/photo-1489599808821-1871c5ad5af6?w=130&h=87&fit=crop',
    },
  ],
}

const SupplementSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>('supplement1')

  const currentArticles =
    articlesData[activeCategory as keyof typeof articlesData]

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId)
  }

  return (
    <Container>
      <Divider />
      <Header>
        <AccentBar />
        <Title>副刊</Title>
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
            <ImagePlaceholder
              style={{
                backgroundImage: `url(${article.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <ArticleContent>
              <ArticleTitle>{article.title}</ArticleTitle>
            </ArticleContent>
          </ArticleCard>
        ))}
      </ArticlesGrid>
      <Divider />
    </Container>
  )
}

export default SupplementSection
