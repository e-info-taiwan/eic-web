import React, { useState } from 'react'
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

const CategoryTab = styled.button<{ $isActive?: boolean }>`
  background: none;
  border: none;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary[20] : '#373740'};
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

// Categories and Sample data
const categories = [
  { id: 'column1', name: '次分類範例文字1' },
  { id: 'column2', name: '次分類範例文字2' },
  { id: 'column3', name: '次分類範例文字3' },
  { id: 'column4', name: '次分類範例文字4' },
]

const articlesData = {
  column1: [
    {
      id: 1,
      title: '永續發展新思維 循環經濟翻轉產業模式',
      image:
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=360&h=240&fit=crop',
    },
    {
      id: 2,
      title: '綠色金融崛起 ESG投資成為主流',
      image:
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=360&h=240&fit=crop',
    },
    {
      id: 3,
      title: '碳中和目標下的企業轉型之路',
      image:
        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=360&h=240&fit=crop',
    },
    {
      id: 4,
      title: '智慧農業科技 解決糧食安全挑戰',
      image:
        'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=360&h=240&fit=crop',
    },
    {
      id: 5,
      title: '都市森林計畫 打造宜居綠色城市',
      image:
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=360&h=240&fit=crop',
    },
    {
      id: 6,
      title: '海洋保護新策略 藍色經濟永續發展',
      image:
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=360&h=240&fit=crop',
    },
  ],
  column2: [
    {
      id: 1,
      title: 'AI革命來襲 人工智慧重塑未來工作',
      image:
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=360&h=240&fit=crop',
    },
    {
      id: 2,
      title: '量子計算突破 開啟科技新紀元',
      image:
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=360&h=240&fit=crop',
    },
    {
      id: 3,
      title: '區塊鏈技術應用 重新定義數位信任',
      image:
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=360&h=240&fit=crop',
    },
    {
      id: 4,
      title: '元宇宙時代來臨 虛實整合新體驗',
      image:
        'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=360&h=240&fit=crop',
    },
    {
      id: 5,
      title: '自動駕駛技術成熟 交通革命在即',
      image:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=360&h=240&fit=crop',
    },
    {
      id: 6,
      title: '生物科技突破 基因編輯治療新希望',
      image:
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=360&h=240&fit=crop',
    },
  ],
  column3: [
    {
      id: 1,
      title: '社會創新實踐 青年力量改變世界',
      image:
        'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=360&h=240&fit=crop',
    },
    {
      id: 2,
      title: '高齡社會來臨 銀髮經濟新商機',
      image:
        'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=360&h=240&fit=crop',
    },
    {
      id: 3,
      title: '多元文化融合 建構包容社會',
      image:
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=360&h=240&fit=crop',
    },
    {
      id: 4,
      title: '社區營造新模式 在地創生展活力',
      image:
        'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=360&h=240&fit=crop',
    },
    {
      id: 5,
      title: '數位落差問題 弱勢群體數位賦權',
      image:
        'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=360&h=240&fit=crop',
    },
    {
      id: 6,
      title: '志工服務精神 公民參與社會改革',
      image:
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=360&h=240&fit=crop',
    },
  ],
  column4: [
    {
      id: 1,
      title: '文化保存與創新 傳統工藝數位轉型',
      image:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=360&h=240&fit=crop',
    },
    {
      id: 2,
      title: '原住民族權益 文化復振新契機',
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=360&h=240&fit=crop',
    },
    {
      id: 3,
      title: '博物館數位典藏 文物活化新思維',
      image:
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=360&h=240&fit=crop',
    },
    {
      id: 4,
      title: '表演藝術創新 跨域合作開新局',
      image:
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=360&h=240&fit=crop',
    },
    {
      id: 5,
      title: '文學出版新風潮 獨立書店復興',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=360&h=240&fit=crop',
    },
    {
      id: 6,
      title: '電影產業國際化 台灣電影走向世界',
      image:
        'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=360&h=240&fit=crop',
    },
  ],
}

const SpecialColumnSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>('column1')

  const currentArticles =
    articlesData[activeCategory as keyof typeof articlesData]

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId)
  }

  return (
    <Container>
      {/* Header */}
      <Header>
        <AccentBar />
        <Title>專欄</Title>
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
