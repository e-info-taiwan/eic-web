import SharedImage from '@readr-media/react-image'
import Link from 'next/link'
import React, { useState } from 'react'
import styled from 'styled-components'

import {
  DEFAULT_NEWS_IMAGE_PATH,
  DEFAULT_POST_IMAGE_PATH,
} from '~/constants/constant'
import type { SectionCategory } from '~/graphql/query/section'
import { getBriefText, mergePostsWithFeatured } from '~/utils/post'

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

const NewsItem = styled.a`
  display: block;
  text-decoration: none;
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
  color: ${({ theme }) => theme.colors.grayscale[0]};
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
  transition: color 0.3s ease;

  ${NewsItem}:hover & {
    color: #388a48;
  }
`

const NewsBrief = styled.p`
  color: ${({ theme }) => theme.colors.grayscale[20]};
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  margin: 24px 0 36px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

const FeaturedImageWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
  overflow: hidden;
  aspect-ratio: 740 / 431;
  background-color: #d1d5db;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    width: 740px;
    height: 431px;
  }
`

const FeaturedArticle = styled.a`
  display: block;
  text-decoration: none;
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

const FeaturedBrief = styled.p`
  color: ${({ theme }) => theme.colors.grayscale[40]};
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    font-size: 18px;
  }
`

const RelatedArticles = styled.div`
  order: 3;
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

const RelatedArticle = styled.a`
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.3s ease;

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

const RelatedImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 3 / 2;
  background-color: #d1d5db;
  overflow: hidden;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    width: 160px;
    height: 107px;
    flex-shrink: 0;
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

const EmptyMessage = styled.p`
  text-align: center;
  color: #666;
  padding: 2rem;
  grid-column: 1 / -1;
`

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

type NewsSectionProps = {
  categories?: SectionCategory[]
}

const NewsSection = ({ categories = [] }: NewsSectionProps) => {
  // Filter categories that have posts (either featured or regular)
  const categoriesWithPosts = categories.filter(
    (cat) =>
      (cat.featuredPostsInInputOrder &&
        cat.featuredPostsInInputOrder.length > 0) ||
      (cat.posts && cat.posts.length > 0)
  )

  const [activeCategory, setActiveCategory] = useState<string>(
    categoriesWithPosts[0]?.id || ''
  )

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId)
  }

  // If no categories with posts, don't render the section
  if (categoriesWithPosts.length === 0) {
    return null
  }

  const currentCategory = categoriesWithPosts.find(
    (cat) => cat.id === activeCategory
  )

  // Merge featured posts (in input order) with regular posts
  const currentPosts = mergePostsWithFeatured(
    currentCategory?.featuredPostsInInputOrder || [],
    currentCategory?.posts || [],
    8 // max 8 posts for this section
  )

  // Featured post is the first one, related gets posts 2-3, sidebar gets posts 4+
  const featuredPost = currentPosts[0]
  const relatedPosts = currentPosts.slice(1, 3)
  const sidebarPosts = currentPosts.slice(3, 8)

  // Use different default image for "編輯直送" category
  const isEditorCategory = currentCategory?.slug === 'editor'
  const defaultImage = isEditorCategory
    ? DEFAULT_NEWS_IMAGE_PATH
    : DEFAULT_POST_IMAGE_PATH

  return (
    <Container>
      {/* Header */}
      <Header>
        <AccentBar />
        <Title>時事新聞</Title>
        <CategoryTabs>
          {categoriesWithPosts.map((category) => (
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
        {/* A - Sidebar */}
        <Sidebar>
          {sidebarPosts.length > 0 ? (
            sidebarPosts.map((post, index) => {
              // Only show brief for the first sidebar post
              const briefText =
                index === 0
                  ? getBriefText(post.brief, post.contentApiData, 40)
                  : ''
              return (
                <Link
                  key={post.id}
                  href={`/node/${post.id}`}
                  passHref
                  legacyBehavior
                >
                  <NewsItem>
                    <NewsDate>{formatDate(post.publishTime)}</NewsDate>
                    <NewsTitle>{post.title}</NewsTitle>
                    {briefText && <NewsBrief>{briefText}</NewsBrief>}
                  </NewsItem>
                </Link>
              )
            })
          ) : (
            <EmptyMessage>目前沒有文章</EmptyMessage>
          )}
        </Sidebar>

        {/* B - Featured Article */}
        {featuredPost && (
          <Link href={`/node/${featuredPost.id}`} passHref legacyBehavior>
            <FeaturedArticle>
              <FeaturedImageWrapper>
                <SharedImage
                  key={`featured-${activeCategory}-${featuredPost.id}`}
                  images={featuredPost.heroImage?.resized || {}}
                  imagesWebP={featuredPost.heroImage?.resizedWebp || {}}
                  defaultImage={defaultImage}
                  alt={featuredPost.title}
                  priority={true}
                  rwd={{
                    mobile: '100vw',
                    tablet: '66vw',
                    desktop: '740px',
                    default: '740px',
                  }}
                />
              </FeaturedImageWrapper>

              <FeaturedContent>
                <FeaturedDate>
                  {formatDate(featuredPost.publishTime)}
                </FeaturedDate>
                <FeaturedTitle>{featuredPost.title}</FeaturedTitle>
                {getBriefText(
                  featuredPost.brief,
                  featuredPost.contentApiData,
                  40
                ) && (
                  <FeaturedBrief>
                    {getBriefText(
                      featuredPost.brief,
                      featuredPost.contentApiData,
                      40
                    )}
                  </FeaturedBrief>
                )}
              </FeaturedContent>
            </FeaturedArticle>
          </Link>
        )}

        {/* C - Related Articles */}
        <RelatedArticles>
          {relatedPosts.length > 0 ? (
            relatedPosts.map((post) => {
              const image = post.heroImage?.resized
              const imageWebp = post.heroImage?.resizedWebp

              return (
                <Link
                  key={post.id}
                  href={`/node/${post.id}`}
                  passHref
                  legacyBehavior
                >
                  <RelatedArticle>
                    <RelatedImageWrapper>
                      <SharedImage
                        key={`related-${activeCategory}-${post.id}`}
                        images={image || {}}
                        imagesWebP={imageWebp || {}}
                        defaultImage={defaultImage}
                        alt={post.title}
                        priority={false}
                        rwd={{
                          mobile: '100vw',
                          tablet: '50vw',
                          desktop: '160px',
                          default: '160px',
                        }}
                      />
                    </RelatedImageWrapper>
                    <RelatedContent>
                      <RelatedDate>{formatDate(post.publishTime)}</RelatedDate>
                      <RelatedTitle>{post.title}</RelatedTitle>
                    </RelatedContent>
                  </RelatedArticle>
                </Link>
              )
            })
          ) : (
            <EmptyMessage>目前沒有相關文章</EmptyMessage>
          )}
        </RelatedArticles>
      </MainContent>
    </Container>
  )
}

export default NewsSection
