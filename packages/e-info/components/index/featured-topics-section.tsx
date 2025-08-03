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
  background-color: #388a48;
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
    color: #388a48;
  }

  &.active {
    color: #388a48;
  }
`

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const HeroArticle = styled.div`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
`

const HeroImage = styled.img`
  width: 100%;
  height: 507px;
  object-fit: cover;
`

const HeroOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    transparent 100%
  );
  padding: 2rem 1.5rem 1.5rem;
  color: white;
`

const HeroTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`

const ArticlesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const ArticleItem = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  cursor: pointer;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 200px;
  }

  @media (min-width: 768px) {
    grid-template-columns: 1fr 250px;
  }
`

const ArticleContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const ArticleTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #232333;
  margin: 0 0 0.75rem 0;
  line-height: 28px;
  transition: color 0.3s ease;

  ${ArticleItem}:hover & {
    color: #059669;
  }

  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`

const ArticleExcerpt = styled.p`
  color: #373740;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
`

const ArticleImage = styled.img`
  width: 400px;
  height: auto;
  object-fit: cover;
`

const Sidebar = styled.div`
  order: -1;
  border-left: 1px solid #000;
  @media (min-width: 1024px) {
    order: 1;
  }
`

const RankingSection = styled.div`
  border-radius: 8px;
  padding: 1.5rem;
`

const RankingHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`

const RankingAccentBar = styled.div`
  background-color: #388a48;
  width: 80px;
  height: 32px;
  margin-right: 0.75rem;
  border-bottom-right-radius: 12px;
`

const RankingTitle = styled.h3`
  font-size: 28px;
  font-weight: 700;
  line-height: 32px;
  color: #232333;
  margin: 0;
`

const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  color: #388a48;
  min-width: 2rem;
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
    color: #388a48;
  }
`

// Sample data
const heroArticle = {
  title: '在理想中擱淺的鯨豚觀察員',
  image:
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
  alt: 'Whale watching illustration',
}

const articles = [
  {
    id: 1,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    excerpt:
      '核三將於本周六（17日）停機，立法院在野黨立委掀人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照限定，在「屆期前」都可提出申請，核電廠運轉年限最多再延長20年、已停機',
    image:
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=300&h=200&fit=crop',
  },
  {
    id: 2,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    excerpt:
      '核三將於本周六（17日）停機，立法院在野黨立委掀人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照限定，在「屆期前」都可提出申請，核電廠運轉年限最多再延長20年、已停機',
    image:
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=300&h=200&fit=crop',
  },
  {
    id: 3,
    title: '「核電延役免環評」影啟明也覺奇怪 立委呼籲環境部修法',
    excerpt:
      '核三將於本周六（17日）停機，立法院在野黨立委掀人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照限定，在「屆期前」都可提出申請，核電廠運轉年限最多再延長20年、已停機',
    image:
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=300&h=200&fit=crop',
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
          <CategoryTab className="active">次分類範例文字1</CategoryTab>
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
