import React, { useState } from 'react'
import styled from 'styled-components'

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 0;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 40px 0;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 66px 0 0;
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

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;

  padding: 0 24px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    grid-template-columns: 1fr 2fr;
    // grid-template-rows: 1fr 1fr;
    grid-template-areas:
      'A B'
      'A C';
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 0 60px;
  }
`

const Sidebar = styled.div`
  order: 2;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    grid-area: A;
    border-right: 1px solid #000;
    padding-right: 30px;
  }
`

const NewsItem = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale[80]};
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    border-bottom: 1px solid #000;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    border-bottom: 1px solid #000;
  }
`

const NewsDate = styled.div`
  color: #388a48;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  margin-bottom: 8px;
`

const NewsTitle = styled.h3`
  color: #232333;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
  transition: color 0.3s ease;

  ${NewsItem}:hover & {
    color: #388a48;
  }
`

const NewsExcerpt = styled.p`
  color: #373740;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  margin-top: 24px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    margin: 12px 0 24px 0;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    margin: 24px 0 36px 0;
  }
`

const FeaturedImage = styled.div`
  position: relative;
  margin-bottom: 16px;
  overflow: hidden;
`

const MainImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  aspect-ratio: attr(width) / attr(height);

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    width: 740px;
    height: 431px;
  }
`

const FeaturedArticle = styled.div`
  order: 1;
  cursor: pointer;

  border-bottom: 1px solid #000;
  padding-bottom: 20px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    grid-area: B;
    border-bottom: none;
    padding-bottom: 0px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    grid-area: B;
    border-bottom: 1px solid #000;
    padding-bottom: 30px;
  }
`

const FeaturedContent = styled.div`
  margin-bottom: 0;
`

const FeaturedDate = styled.div`
  color: ${({ theme }) => theme.colors.primary[20]};
  font-size: 16;
  font-weight: 700;
  line-height: 1.5;
  margin-bottom: 0.75rem;
`

const FeaturedTitle = styled.h2`
  color: ${({ theme }) => theme.colors.grayscale[0]};
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  margin: 0;
  margin-bottom: 12px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    font-size: 20px;
    line-height: 28px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 28px;
    line-height: 32px;
  }

  ${FeaturedArticle}:hover & {
    color: ${({ theme }) => theme.colors.primary[20]};
  }
`

const FeaturedExcerpt = styled.p`
  color: ${({ theme }) => theme.colors.grayscale[20]};
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
`

const RelatedArticles = styled.div`
  order: 3;
  cursor: pointer;
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    grid-area: C;
    grid-template-columns: repeat(2, 1fr);
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    gap: 60px;
  }
`

const RelatedArticle = styled.div`
  cursor: pointer;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    width: auto;
    min-width: auto;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    flex-direction: row;
    flex-shrink: 1;
    width: auto;
    min-wdith: 280px;
  }
`

const RelatedImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    width: 160px;
    height: 107px;
    // aspect-ratio: 160 / 107;
  }
`

const RelatedContent = styled.div`
  display: flex;
  flex-direction: column;
`

const RelatedDate = styled.div`
  color: #388a48;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  margin-bottom: 4px;
`

const RelatedTitle = styled.h4`
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  line-height: 1.5;
  margin: 0;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  ${RelatedArticle}:hover & {
    color: ${({ theme }) => theme.colors.primary[20]};
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    font-size: 18px;
  }
`

// Categories and Sample data
const categories = [
  { id: 'category1', name: '次分類範例文字1' },
  { id: 'category2', name: '次分類範例文字2' },
  { id: 'category3', name: '次分類範例文字3' },
  { id: 'category4', name: '次分類範例文字4' },
]

const newsData = {
  category1: {
    sidebar: [
      {
        id: 1,
        date: '2024/01/15',
        title: '環保政策新突破 台灣推動綠色能源轉型',
        excerpt:
          '政府宣布新的環保政策，將大力推動再生能源發展，預計在2030年達到50%綠能比例...',
      },
      {
        id: 2,
        date: '2024/01/14',
        title: '氣候變遷對台灣農業的衝擊與因應策略',
      },
      {
        id: 3,
        date: '2024/01/13',
        title: '海洋塑膠污染問題嚴重 環團呼籲減塑行動',
      },
      {
        id: 4,
        date: '2024/01/12',
        title: '都市熱島效應加劇 綠建築成為解決方案',
      },
      {
        id: 5,
        date: '2024/01/11',
        title: '生物多樣性保育 台灣濕地復育有成',
      },
    ],
    featured: {
      date: '2024/01/15',
      title: '環保政策新突破 台灣推動綠色能源轉型',
      excerpt:
        '政府宣布新的環保政策，將大力推動再生能源發展，預計在2030年達到50%綠能比例，這項政策將帶動相關產業發展...',
      image:
        'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=740&h=431&fit=crop',
    },
    related: [
      {
        id: 1,
        date: '2024/01/14',
        title: '太陽能發電技術新突破 效率提升30%',
        image:
          'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=160&h=107&fit=crop',
      },
      {
        id: 2,
        date: '2024/01/13',
        title: '風力發電離岸計畫啟動 預計年底完工',
        image:
          'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=160&h=107&fit=crop',
      },
    ],
  },
  category2: {
    sidebar: [
      {
        id: 1,
        date: '2024/01/20',
        title: '科技創新驅動產業轉型 AI應用遍地開花',
        excerpt:
          '人工智慧技術在各產業的應用日益普及，帶動台灣科技業新一波成長...',
      },
      {
        id: 2,
        date: '2024/01/19',
        title: '5G網路建設加速 智慧城市願景成真',
      },
      {
        id: 3,
        date: '2024/01/18',
        title: '半導體產業持續領先 新製程技術突破',
      },
      {
        id: 4,
        date: '2024/01/17',
        title: '電動車產業鏈完整 台灣成為關鍵供應商',
      },
      {
        id: 5,
        date: '2024/01/16',
        title: '雲端服務需求激增 資料中心建設熱潮',
      },
    ],
    featured: {
      date: '2024/01/20',
      title: '科技創新驅動產業轉型 AI應用遍地開花',
      excerpt:
        '人工智慧技術在各產業的應用日益普及，從製造業的智慧工廠到服務業的客服機器人，AI正在改變我們的工作和生活方式...',
      image:
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=740&h=431&fit=crop',
    },
    related: [
      {
        id: 1,
        date: '2024/01/19',
        title: 'ChatGPT掀起AI熱潮 台灣科技業積極布局',
        image:
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=160&h=107&fit=crop',
      },
      {
        id: 2,
        date: '2024/01/18',
        title: '自駕車技術突破 台灣測試場域正式啟用',
        image:
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=160&h=107&fit=crop',
      },
    ],
  },
  category3: {
    sidebar: [
      {
        id: 1,
        date: '2024/01/25',
        title: '教育改革新方向 108課綱實施成果檢討',
        excerpt: '教育部公布108課綱實施兩年成果，學生學習成效顯著提升...',
      },
      {
        id: 2,
        date: '2024/01/24',
        title: '數位學習平台普及 偏鄉教育資源平衡',
      },
      {
        id: 3,
        date: '2024/01/23',
        title: '技職教育受重視 產學合作培育人才',
      },
      {
        id: 4,
        date: '2024/01/22',
        title: '雙語教育政策推動 提升學生國際競爭力',
      },
      {
        id: 5,
        date: '2024/01/21',
        title: '終身學習風氣興起 成人教育需求增長',
      },
    ],
    featured: {
      date: '2024/01/25',
      title: '教育改革新方向 108課綱實施成果檢討',
      excerpt:
        '教育部公布108課綱實施兩年來的成果報告，顯示學生在核心素養培養方面有顯著進步，批判思考和問題解決能力明顯提升...',
      image:
        'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=740&h=431&fit=crop',
    },
    related: [
      {
        id: 1,
        date: '2024/01/24',
        title: 'STEAM教育夯 培養跨領域人才',
        image:
          'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=160&h=107&fit=crop',
      },
      {
        id: 2,
        date: '2024/01/23',
        title: '線上教學常態化 教師數位能力待提升',
        image:
          'https://images.unsplash.com/photo-1588072432836-e10032774350?w=160&h=107&fit=crop',
      },
    ],
  },
  category4: {
    sidebar: [
      {
        id: 1,
        date: '2024/01/30',
        title: '健康醫療新突破 精準醫療時代來臨',
        excerpt: '基因檢測技術進步，個人化醫療成為趨勢，治療效果大幅提升...',
      },
      {
        id: 2,
        date: '2024/01/29',
        title: '長照政策持續優化 銀髮族生活品質提升',
      },
      {
        id: 3,
        date: '2024/01/28',
        title: '心理健康受關注 職場壓力管理成重點',
      },
      {
        id: 4,
        date: '2024/01/27',
        title: '預防醫學興起 健檢項目更加多元',
      },
      {
        id: 5,
        date: '2024/01/26',
        title: '遠距醫療普及 偏鄉醫療資源不足問題改善',
      },
    ],
    featured: {
      date: '2024/01/30',
      title: '健康醫療新突破 精準醫療時代來臨',
      excerpt:
        '隨著基因檢測技術的快速發展，精準醫療正在改變傳統的治療模式，醫師能根據患者的基因特徵制定個人化的治療方案...',
      image:
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=740&h=431&fit=crop',
    },
    related: [
      {
        id: 1,
        date: '2024/01/29',
        title: '免疫療法新突破 癌症治療新希望',
        image:
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=160&h=107&fit=crop',
      },
      {
        id: 2,
        date: '2024/01/28',
        title: 'AI輔助診斷系統 提高醫療準確性',
        image:
          'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=160&h=107&fit=crop',
      },
    ],
  },
}

const NewsSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>('category1')

  const currentData = newsData[activeCategory as keyof typeof newsData]

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId)
  }

  return (
    <Container>
      {/* Header */}
      <Header>
        <AccentBar />
        <Title>時事新聞</Title>
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

      {/* Main Content */}
      <MainContent>
        {/* A */}
        <Sidebar>
          {currentData.sidebar.map((news) => (
            <NewsItem key={news.id}>
              <NewsDate>{news.date}</NewsDate>
              <NewsTitle>{news.title}</NewsTitle>
              {news.excerpt && <NewsExcerpt>{news.excerpt}</NewsExcerpt>}
            </NewsItem>
          ))}
        </Sidebar>

        {/* B */}
        <FeaturedArticle>
          <FeaturedImage>
            <MainImage
              src={currentData.featured.image}
              alt="Featured news image"
            />
          </FeaturedImage>

          <FeaturedContent>
            <FeaturedDate>{currentData.featured.date}</FeaturedDate>
            <FeaturedTitle>{currentData.featured.title}</FeaturedTitle>
            <FeaturedExcerpt>{currentData.featured.excerpt}</FeaturedExcerpt>
          </FeaturedContent>
        </FeaturedArticle>

        {/* C */}
        <RelatedArticles>
          {currentData.related.map((article) => (
            <RelatedArticle key={article.id}>
              <RelatedImage src={article.image} alt="Related article" />
              <RelatedContent>
                <RelatedDate>{article.date}</RelatedDate>
                <RelatedTitle>{article.title}</RelatedTitle>
              </RelatedContent>
            </RelatedArticle>
          ))}
        </RelatedArticles>
      </MainContent>
    </Container>
  )
}

export default NewsSection
