import SharedImage from '@readr-media/react-image'
import Link from 'next/link'
import React, { useState } from 'react'
import styled from 'styled-components'

import { DEFAULT_POST_IMAGE_PATH } from '~/constants/constant'
import type { SectionCategory } from '~/graphql/query/section'
import { mergePostsWithFeatured } from '~/utils/post'

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

const TitleLink = styled(Link)`
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[100]};
  margin: 0;
  text-decoration: none;

  &:hover {
    color: #f7c34c;
    text-decoration: underline;
  }

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

const ArticleCard = styled.a`
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 200px;
  text-decoration: none;

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

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  margin-bottom: 12px;
  aspect-ratio: 288 / 190;
  background-color: #2d7a4f;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    margin-bottom: 12px;
  }
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
    color: #f7c34c;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 18px;
  }
`

const EmptyMessage = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.primary[100]};
  padding: 2rem;
  grid-column: 1 / -1;
`

type GreenConsumptionSectionProps = {
  categories?: SectionCategory[]
}

const GreenConsumptionSection = ({
  categories = [],
}: GreenConsumptionSectionProps) => {
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
    3 // max 3 posts for this section
  )

  return (
    <SectionContainer>
      <Container>
        {/* Header */}
        <Header>
          <AccentBar />
          <TitleLink href="/section/green">綠色消費</TitleLink>
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

        {/* Articles Grid */}
        <ArticlesGrid>
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => {
              const image = post.heroImage?.resized
              const imageWebp = post.heroImage?.resizedWebp

              return (
                <Link
                  key={post.id}
                  href={`/node/${post.id}`}
                  passHref
                  legacyBehavior
                >
                  <ArticleCard>
                    <ImageWrapper>
                      <SharedImage
                        key={`green-${activeCategory}-${post.id}`}
                        images={image || {}}
                        imagesWebP={imageWebp || {}}
                        defaultImage={DEFAULT_POST_IMAGE_PATH}
                        alt={post.title}
                        priority={false}
                        rwd={{
                          mobile: '200px',
                          tablet: '33vw',
                          desktop: '350px',
                          default: '350px',
                        }}
                      />
                    </ImageWrapper>
                    <ArticleTitle>{post.title}</ArticleTitle>
                  </ArticleCard>
                </Link>
              )
            })
          ) : (
            <EmptyMessage>目前沒有文章</EmptyMessage>
          )}
        </ArticlesGrid>
      </Container>
    </SectionContainer>
  )
}

export default GreenConsumptionSection
