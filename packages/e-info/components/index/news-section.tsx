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
  gap: 1rem;
`

const AccentBar = styled.div`
  background-color: #059669;
  width: 1rem;
  height: 2rem;
  margin-right: 0.75rem;
`

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
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
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0;
  transition: color 0.3s ease;

  &:hover {
    color: #059669;
  }

  &.active {
    color: #059669;
    font-weight: 500;
  }
`

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 2fr;
  }
`

const Sidebar = styled.div`
  order: 2;

  @media (min-width: 768px) {
    order: 1;
  }
`

const NewsItem = styled.div`
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
  }

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`

const NewsDate = styled.div`
  color: #059669;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`

const NewsTitle = styled.h3`
  color: #1f2937;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;

  ${NewsItem}:hover & {
    color: #059669;
  }
`

const NewsExcerpt = styled.p`
  color: #6b7280;
  font-size: 0.75rem;
  line-height: 1.4;
  margin: 0;
`

const FeaturedSection = styled.div`
  order: 1;

  @media (min-width: 768px) {
    order: 2;
  }
`

const FeaturedImage = styled.div`
  position: relative;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
`

const MainImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;

  @media (min-width: 768px) {
    height: 400px;
  }
`

const FeaturedContent = styled.div`
  margin-bottom: 2rem;
`

const FeaturedDate = styled.div`
  color: #059669;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
`

const FeaturedTitle = styled.h2`
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.3;
  margin: 0;
  margin-bottom: 0.75rem;

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
`

const FeaturedExcerpt = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
`

const RelatedArticles = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const RelatedArticle = styled.div`
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`

const RelatedImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 0.5rem;
`

const RelatedDate = styled.div`
  color: #059669;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`

const RelatedTitle = styled.h4`
  color: #1f2937;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
  transition: color 0.3s ease;

  ${RelatedArticle}:hover & {
    color: #059669;
  }
`

// Sample data
const sidebarNews = [
  {
    id: 1,
    date: '2023/03/28',
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    excerpt:
      '核三將於本周六（17日）停機，立法院在野黨立委掀人數優勢，於今（13）日院會表決通過《核管...',
  },
  {
    id: 2,
    date: '2023/03/28',
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    excerpt: '',
  },
  {
    id: 3,
    date: '2023/03/28',
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    excerpt: '',
  },
  {
    id: 4,
    date: '2023/03/28',
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    excerpt: '',
  },
  {
    id: 5,
    date: '2023/03/28',
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    excerpt: '',
  },
]

const relatedArticles = [
  {
    id: 1,
    date: '2023/03/28',
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
  },
  {
    id: 2,
    date: '2023/03/28',
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    image:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop',
  },
]

const NewsSection = () => {
  return (
    <Container>
      {/* Header */}
      <Header>
        <AccentBar />
        <Title>時事新聞</Title>
        <CategoryTabs>
          <CategoryTab className="active">次分類範例文字1</CategoryTab>
          <CategoryTab>次分類範例文字2</CategoryTab>
          <CategoryTab>次分類範例文字3</CategoryTab>
          <CategoryTab>次分類範例文字4</CategoryTab>
        </CategoryTabs>
      </Header>

      {/* Main Content */}
      <MainContent>
        {/* Sidebar */}
        <Sidebar>
          {sidebarNews.map((news) => (
            <NewsItem key={news.id}>
              <NewsDate>{news.date}</NewsDate>
              <NewsTitle>{news.title}</NewsTitle>
              {news.excerpt && <NewsExcerpt>{news.excerpt}</NewsExcerpt>}
            </NewsItem>
          ))}
        </Sidebar>

        {/* Featured Section */}
        <FeaturedSection>
          <FeaturedImage>
            <MainImage
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop"
              alt="Featured news image"
            />
          </FeaturedImage>

          <FeaturedContent>
            <FeaturedDate>2023/03/28</FeaturedDate>
            <FeaturedTitle>
              「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法
            </FeaturedTitle>
            <FeaturedExcerpt>
              核三將於本周六（17日）停機，立法院在野黨立委掀人數優勢，於今（13）日院會表決通過《核管...
            </FeaturedExcerpt>
          </FeaturedContent>

          <RelatedArticles>
            {relatedArticles.map((article) => (
              <RelatedArticle key={article.id}>
                <RelatedImage src={article.image} alt="Related article" />
                <RelatedDate>{article.date}</RelatedDate>
                <RelatedTitle>{article.title}</RelatedTitle>
              </RelatedArticle>
            ))}
          </RelatedArticles>
        </FeaturedSection>
      </MainContent>
    </Container>
  )
}

export default NewsSection
