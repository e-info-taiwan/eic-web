// Section page - new design with hero, category tags, and category article sections
import SharedImage from '@readr-media/react-image'
import errors from '@twreporter/errors'
import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'
import styled from 'styled-components'

import { getGqlClient } from '~/apollo-client'
import LayoutGeneral from '~/components/layout/layout-general'
import { DEFAULT_POST_IMAGE_PATH } from '~/constants/constant'
import type {
  SectionPageCategory,
  SectionPageData,
  SectionPost,
} from '~/graphql/query/section'
import { sectionPageBySlug } from '~/graphql/query/section'
import type { NextPageWithLayout } from '~/pages/_app'
import { setCacheControl } from '~/utils/common'
import { mergePostsWithFeatured } from '~/utils/post'

const POSTS_PER_CATEGORY = 3

// ========== Styled Components ==========

const PageWrapper = styled.div`
  width: 100%;
`

// Hero Section - maintains 1200:420 (20:7) aspect ratio
const HeroSection = styled.div<{ $hasImage: boolean }>`
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  aspect-ratio: 1200 / 420;
  background-color: ${({ $hasImage }) => ($hasImage ? '#333' : '#f5f5f5')};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const HeroImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.4) 100%
    );
  }
`

const HeroTitleWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
`

const AccentBar = styled.div<{ $hasImage: boolean }>`
  background-color: ${({ theme }) => theme.colors.primary[80]};
  width: 20px;
  height: 32px;
  margin-right: 0.75rem;
  border-bottom-right-radius: 12px;

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    width: 20px;
    height: 32px;
  }
`

const HeroTitle = styled.h1<{ $hasImage: boolean }>`
  font-size: 28px;
  font-weight: 500;
  color: ${({ theme, $hasImage }) =>
    $hasImage ? theme.colors.primary[80] : '#000'};
  margin: 0;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    font-size: 32px;
  }
`

// Category Tags Section
const CategoryTagsWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(
    180deg,
    rgba(207, 237, 209, 0.6) 61.06%,
    rgba(139, 200, 144, 0.6) 100%
  );
  padding: 16px 20px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 20px 40px;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 24px 60px;
  }
`

const CategoryTagsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    gap: 12px 16px;
  }
`

const CategoryTag = styled(Link)`
  display: inline-block;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.grayscale[40]};
  border-radius: 12px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[20]};
    border-color: ${({ theme }) => theme.colors.primary[20]};
    color: #fff;
  }
`

// Description Section (placeholder for future CMS field)
const DescriptionSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  color: #000;
  min-height: 80px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 24px 58px 40px 58px;
  }
`

// Categories Grid Container (2 columns on desktop)
const CategoriesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 0 40px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 32px;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 0 60px;
    gap: 0 48px;
  }
`

// Category Article Section
const CategorySection = styled.section`
  padding-bottom: 32px;

  border-bottom: 1px solid ${({ theme }) => theme.colors.primary[20]};
  margin-bottom: 32px;
`

const CategoryHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    justify-content: space-between;
    padding-bottom: 16px;
  }
`

const CategoryName = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[20]};
  margin: 0;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    font-size: 20px;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 24px;
  }
`

const ReadMoreLink = styled(Link)`
  display: none;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary[20]};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    display: block;
    font-size: 16px;
  }
`

// Article List Layout (vertical stack within each category)
const ArticleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    gap: 20px;
  }
`

// Large Card (First article)
const LargeCard = styled.a`
  display: block;
  text-decoration: none;
  cursor: pointer;
`

const LargeCardImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-color: #e5e5e5;
  margin-bottom: 12px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    aspect-ratio: 4 / 3;
    margin-bottom: 16px;
  }
`

const LargeCardDate = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[20]};
  margin-bottom: 8px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    font-size: 16px;
  }
`

const LargeCardTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;

  ${LargeCard}:hover & {
    color: ${({ theme }) => theme.colors.primary[20]};
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    font-size: 20px;
  }
`

// Small Card (Secondary articles)
const SmallCard = styled.a`
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-decoration: none;
  cursor: pointer;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    flex-direction: row;
    gap: 16px;
  }
`

const SmallCardImageWrapper = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    display: block;
    width: 160px;
    height: 107px;
    flex-shrink: 0;
    overflow: hidden;
    background-color: #e5e5e5;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    width: 180px;
    height: 120px;
  }
`

const SmallCardContent = styled.div`
  flex: 1;
`

const SmallCardDate = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[20]};
  margin-bottom: 4px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    font-size: 14px;
  }
`

const SmallCardTitle = styled.h4`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;

  ${SmallCard}:hover & {
    color: ${({ theme }) => theme.colors.primary[20]};
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    font-size: 18px;
  }
`

const MobileReadMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    display: none;
  }
`

const MobileReadMoreLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary[20]};
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  font-size: 16px;
`

// ========== Helper Functions ==========

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}/${month}/${day} ${hours}:${minutes}`
}

// ========== Components ==========

type CategoryArticleSectionProps = {
  category: SectionPageCategory
}

const CategoryArticleSection = ({ category }: CategoryArticleSectionProps) => {
  // Merge featured posts with regular posts
  const posts = mergePostsWithFeatured<SectionPost>(
    category.featuredPostsInInputOrder || [],
    category.posts || [],
    POSTS_PER_CATEGORY
  )

  if (posts.length === 0) {
    return null
  }

  const largePost = posts[0]
  const smallPosts = posts.slice(1, 3)

  return (
    <CategorySection>
      <CategoryHeader>
        <CategoryName>{category.name}</CategoryName>
        <ReadMoreLink href={`/category/${category.id}`}>閱讀更多</ReadMoreLink>
      </CategoryHeader>

      <ArticleList>
        {/* Large Card */}
        <Link href={`/node/${largePost.id}`} passHref legacyBehavior>
          <LargeCard>
            <LargeCardImageWrapper>
              <SharedImage
                images={largePost.heroImage?.resized || {}}
                imagesWebP={largePost.heroImage?.resizedWebp || {}}
                defaultImage={DEFAULT_POST_IMAGE_PATH}
                alt={largePost.title}
                priority={false}
                rwd={{
                  mobile: '100vw',
                  tablet: '50vw',
                  desktop: '540px',
                  default: '540px',
                }}
              />
            </LargeCardImageWrapper>
            <LargeCardDate>{formatDate(largePost.publishTime)}</LargeCardDate>
            <LargeCardTitle>{largePost.title}</LargeCardTitle>
          </LargeCard>
        </Link>

        {/* Small Cards */}
        {smallPosts.map((post) => (
          <Link key={post.id} href={`/node/${post.id}`} passHref legacyBehavior>
            <SmallCard>
              <SmallCardImageWrapper>
                <SharedImage
                  images={post.heroImage?.resized || {}}
                  imagesWebP={post.heroImage?.resizedWebp || {}}
                  defaultImage={DEFAULT_POST_IMAGE_PATH}
                  alt={post.title}
                  priority={false}
                  rwd={{
                    mobile: '160px',
                    tablet: '160px',
                    desktop: '180px',
                    default: '180px',
                  }}
                />
              </SmallCardImageWrapper>
              <SmallCardContent>
                <SmallCardDate>{formatDate(post.publishTime)}</SmallCardDate>
                <SmallCardTitle>{post.title}</SmallCardTitle>
              </SmallCardContent>
            </SmallCard>
          </Link>
        ))}
      </ArticleList>

      <MobileReadMoreWrapper>
        <MobileReadMoreLink href={`/category/${category.id}`}>
          閱讀更多
        </MobileReadMoreLink>
      </MobileReadMoreWrapper>
    </CategorySection>
  )
}

// ========== Page Component ==========

type PageProps = {
  section: SectionPageData
  categories: SectionPageCategory[]
}

const SectionPage: NextPageWithLayout<PageProps> = ({
  section,
  categories,
}) => {
  const hasHeroImage = !!section.heroImage?.resized
  const categoriesWithPosts = categories.filter(
    (cat) =>
      (cat.featuredPostsInInputOrder &&
        cat.featuredPostsInInputOrder.length > 0) ||
      (cat.posts && cat.posts.length > 0)
  )

  return (
    <PageWrapper>
      {/* Hero Section */}
      <HeroSection $hasImage={hasHeroImage}>
        {hasHeroImage && (
          <HeroImageWrapper>
            <SharedImage
              images={section.heroImage?.resized || {}}
              imagesWebP={section.heroImage?.resizedWebp || {}}
              alt={section.name}
              priority={true}
              rwd={{
                mobile: '100vw',
                tablet: '100vw',
                desktop: '100vw',
                default: '100vw',
              }}
            />
          </HeroImageWrapper>
        )}
        <HeroTitleWrapper>
          <AccentBar $hasImage={hasHeroImage} />
          <HeroTitle $hasImage={hasHeroImage}>{section.name}</HeroTitle>
        </HeroTitleWrapper>
      </HeroSection>

      {/* Category Tags */}
      <CategoryTagsWrapper>
        <CategoryTagsContainer>
          {categoriesWithPosts.map((category) => (
            <CategoryTag key={category.id} href={`/category/${category.id}`}>
              {category.name}
            </CategoryTag>
          ))}
        </CategoryTagsContainer>
      </CategoryTagsWrapper>

      {/* Description Section (placeholder for future CMS field) */}
      <DescriptionSection>
        {/* 當 CMS 新增描述欄位後，在此顯示 section 描述 */}
        {/* {section.description} */}
        當全球致力於減緩生物多樣性衰退，努力踩剎車延遲步入第六次大滅絕之際，行政院內政部國家公園署——一個完全以保護區為名的部門，最有立場提供保護區在生物多樣性目標扮演的角色，由國家公園署新挑保育的價值，約100字
      </DescriptionSection>

      {/* Category Article Sections - 2 columns on desktop */}
      {categoriesWithPosts.length > 0 ? (
        <CategoriesGrid>
          {categoriesWithPosts.map((category) => (
            <CategoryArticleSection key={category.id} category={category} />
          ))}
        </CategoriesGrid>
      ) : (
        <EmptyMessage>目前沒有文章</EmptyMessage>
      )}
    </PageWrapper>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  params,
  res,
}) => {
  setCacheControl(res)

  const slug = params?.slug as string
  const client = getGqlClient()

  try {
    const result = await client.query<{ sections: SectionPageData[] }>({
      query: sectionPageBySlug,
      variables: {
        slug,
        postsPerCategory: POSTS_PER_CATEGORY,
      },
    })

    if (result.error || !result.data?.sections?.length) {
      return { notFound: true }
    }

    const section = result.data.sections[0]
    const categories = section.categories || []

    return {
      props: {
        section,
        categories,
      },
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching data at Section page'
    )

    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(annotatingError, {
          withStack: false,
          withPayload: true,
        }),
      })
    )

    throw new Error('Error occurs while fetching data.')
  }
}

SectionPage.getLayout = function getLayout(page: ReactElement<PageProps>) {
  const { props } = page

  return <LayoutGeneral title={props.section.name}>{page}</LayoutGeneral>
}

export default SectionPage
