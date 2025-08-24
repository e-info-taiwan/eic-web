import React from 'react'
import styled from 'styled-components'

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 0;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 0 0;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 0 0;
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
  font-weight: 700;
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
  gap: 20px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 0 45px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    grid-template-columns: 2fr 1fr;
    padding: 0 78px;
  }
`

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  order: 0;
`

const HeroArticle = styled.div`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
`

const HeroImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  aspect-ratio: 1;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    aspect-ratio: attr(width) / attr(height);
  }
  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    aspect-ratio: attr(width) / attr(height);
  }
`

const HeroOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.grayscale[0]};
  padding: 12px 0;
  color: white;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 10px 0;
  }
`

const HeroTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  line-height: 28px;
  text-align: center;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    font-size: 28px;
    line-height: 32px;
  }
`

const ArticlesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const ArticleItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 130px;
  gap: 12px;
  padding: 0 23px;
  cursor: pointer;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    grid-template-columns: 1fr 289px;
    gap: 16px;
    padding: 0;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    grid-template-columns: 1fr 400px;
    gap: 30px;
    padding: 0;
  }
`

const ArticleContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    justify-content: space-between;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    justify-content: space-between;
  }
`

const ArticleTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  margin: 0;
  line-height: 1.5;
  transition: color 0.3s ease;

  ${ArticleItem}:hover & {
    color: #059669;
  }

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    font-size: 18px;
    line-height: 1.5;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 20px;
    line-height: 28px;
  }
`

const ArticleExcerpt = styled.p`
  color: #373740;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  display: none;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    display: block;
  }
`

const ArticleImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  aspect-ratio: attr(width) / attr(height);

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    width: 289px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    width: 400px;
  }
`

const Sidebar = styled.div`
  order: 1;
  border-left: none;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    border-left: none;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    border-left: 1px solid #000;
  }
`

const RankingSection = styled.div`
  padding: 40px 48px 48px 48px;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 0 0 48px 32px;
  }
`

const RankingHeader = styled.div`
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
    padding-left: 0;
    justify-content: normal;
  }
`

const RankingAccentBar = styled.div`
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

const RankingTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  margin: 0;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 28px;
    line-height: 32px;
  }
`

const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    flex-direction: row;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    flex-direction: column;
  }
`

const RankingItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
`

const RankingNumber = styled.div`
  font-size: 48px;
  line-height: 1.25;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary[20]};
  min-width: 2rem;
  text-align: center;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    text-align: left;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    text-align: left;
  }
`

const RankingContent = styled.div`
  flex: 1;
`

const RankingItemTitle = styled.h4`
  font-size: 20px;
  font-weight: 700;
  color: #232333;
  margin: 0;
  line-height: 28px;

  ${RankingItem}:hover & {
    color: ${({ theme }) => theme.colors.primary[20]};
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #000;
  margin: 20px 28px 16px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    margin-left: 44px;
    margin-right: 44px;
  }
  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    display: none;
  }
`

// Sample data
const heroArticle = {
  title: '在理想中擱淺的鯨豚觀察員',
  image:
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=760&h=507&fit=crop',
  alt: 'Whale watching illustration',
}

const articles = [
  {
    id: 1,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    excerpt:
      '核三將於本周六（17日）停機，立法院在野黨立委掀人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照限定，在「屆期前」都可提出申請，核電廠運轉年限最多再延長20年、已停機',
    image:
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&h=267&fit=crop',
  },
  {
    id: 2,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    excerpt:
      '核三將於本周六（17日）停機，立法院在野黨立委掀人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照限定，在「屆期前」都可提出申請，核電廠運轉年限最多再延長20年、已停機',
    image:
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&h=267&fit=crop',
  },
  {
    id: 3,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    excerpt:
      '核三將於本周六（17日）停機，立法院在野黨立委掀人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照限定，在「屆期前」都可提出申請，核電廠運轉年限最多再延長20年、已停機',
    image:
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&h=267&fit=crop',
  },
]

const rankings = [
  {
    rank: 1,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
  },
  {
    rank: 2,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
  },
  {
    rank: 3,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
  },
]

const FeaturedTopicsSection = () => {
  return (
    <Container>
      {/* Header */}
      <Header>
        <AccentBar />
        <Title>深度專題</Title>
        <CategoryTabs>
          <CategoryTab>次分類範例文字1</CategoryTab>
          <CategoryTab>次分類範例文字2</CategoryTab>
          <CategoryTab>次分類範例文字3</CategoryTab>
          <CategoryTab>次分類範例文字4</CategoryTab>
        </CategoryTabs>
      </Header>

      {/* Main Content */}
      <MainContent>
        <LeftSection>
          {/* Hero Article */}
          <HeroArticle>
            <HeroImage src={heroArticle.image} alt={heroArticle.alt} />
            <HeroOverlay>
              <HeroTitle>{heroArticle.title}</HeroTitle>
            </HeroOverlay>
          </HeroArticle>

          {/* Articles List */}
          <ArticlesList>
            {articles.map((article) => (
              <ArticleItem key={article.id}>
                <ArticleContent>
                  <ArticleTitle>{article.title}</ArticleTitle>
                  <ArticleExcerpt>{article.excerpt}</ArticleExcerpt>
                </ArticleContent>
                <ArticleImage src={article.image} alt={article.title} />
              </ArticleItem>
            ))}
          </ArticlesList>
        </LeftSection>

        {/* Sidebar */}
        <Sidebar>
          <Divider />
          <RankingSection>
            <RankingHeader>
              <RankingAccentBar />
              <RankingTitle>閱讀排名</RankingTitle>
            </RankingHeader>
            <RankingList>
              {rankings.map((item) => (
                <RankingItem key={item.rank}>
                  <RankingNumber>{item.rank}</RankingNumber>
                  <RankingContent>
                    <RankingItemTitle>{item.title}</RankingItemTitle>
                  </RankingContent>
                </RankingItem>
              ))}
            </RankingList>
          </RankingSection>
        </Sidebar>
      </MainContent>
    </Container>
  )
}

export default FeaturedTopicsSection
