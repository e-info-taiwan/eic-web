import React from 'react'
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
  aspect-ratio: attr(width) / attr(height);

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    width: 160px;
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
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=107&fit=crop',
  },
  {
    id: 2,
    date: '2023/03/28',
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    image:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=160&h=107&fit=crop',
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
          <CategoryTab>次分類範例文字1</CategoryTab>
          <CategoryTab>次分類範例文字2</CategoryTab>
          <CategoryTab>次分類範例文字3</CategoryTab>
          <CategoryTab>次分類範例文字4</CategoryTab>
        </CategoryTabs>
      </Header>

      {/* Main Content */}
      <MainContent>
        {/* A */}
        <Sidebar>
          {sidebarNews.map((news) => (
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
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=740&h=431&fit=crop"
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
        </FeaturedArticle>

        {/* C */}
        <RelatedArticles>
          {relatedArticles.map((article) => (
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
