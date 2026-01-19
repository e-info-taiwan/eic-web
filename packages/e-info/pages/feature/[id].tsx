// Featured Topic 單頁
// @ts-ignore: no definition
import errors from '@twreporter/errors'
import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'
import { useState } from 'react'
import styled from 'styled-components'

import { getGqlClient } from '~/apollo-client'
import LayoutGeneral from '~/components/layout/layout-general'
import { DEFAULT_POST_IMAGE_PATH } from '~/constants/constant'
import type { Topic, TopicPost } from '~/graphql/query/section'
import { topicById } from '~/graphql/query/section'
import type { NextPageWithLayout } from '~/pages/_app'
import IconBack from '~/public/icons/arrow_back.svg'
import IconForward from '~/public/icons/arrow_forward.svg'
import { setCacheControl } from '~/utils/common'
import * as gtag from '~/utils/gtag'
import { getBriefText } from '~/utils/post'

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const HeroSection = styled.section`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  margin-bottom: 32px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 40px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: 40px;
  }
`

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ContentWrapper = styled.div`
  padding: 0 20px 60px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 0 48px 80px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 0 78px 100px;
  }
`

const TopicHeader = styled.div`
  max-width: 760px;
  margin: 0 auto 40px;
`

const TopicTitleSection = styled.div`
  text-align: center;
`

const TopicTitle = styled.h2`
  display: inline-block;
  font-size: 28px;
  font-weight: 500;
  line-height: 32px;
  color: ${({ theme }) => theme.colors.secondary[0]};
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.secondary[0]};

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 36px;
    line-height: 1.25;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 48px;
    line-height: 1.25;
  }
`

const TopicSummary = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.8;
  color: #333;
  margin: 0 0 16px;
  text-align: center;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
  }
`

const UpdateTime = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #000;
  margin-bottom: 20px;
  text-align: center;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }

  span {
    color: ${({ theme }) => theme.colors.secondary[20]};
  }
`

const TagSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 48px;
`

const TagRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: wrap;
  justify-content: center;
`

const TagLabel = styled.span`
  font-size: 16px;
  line-height: 1.5;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary[20]};
  white-space: nowrap;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
`

const TagList = styled.div`
  display: flex;
  gap: 0;
  flex-wrap: wrap;
  justify-content: center;
`

const Tag = styled.span`
  font-size: 16px;
  line-height: 1.5;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary[20]};
  white-space: nowrap;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
`

const ArticleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 760px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoint.md} {
    gap: 40px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    gap: 48px;
  }
`

const ArticleCard = styled.a`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  text-decoration: none;
  cursor: pointer;

  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: 283px 1fr;
    gap: 20px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    gap: 20px;
  }
`

const ArticleImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background-color: #f0f0f0;

  ${({ theme }) => theme.breakpoint.md} {
    width: 283px;
    height: 176px;
    flex-shrink: 0;
  }
`

const ArticleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ArticleContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const ArticleTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  color: #000;
  margin: 0 0 12px;
  transition: color 0.3s ease;

  ${ArticleCard}:hover & {
    color: #e07a3f;
  }

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 20px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 22px;
  }
`

const ArticleExcerpt = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  color: #666;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
`

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 13px;
  margin-top: 48px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 60px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    margin-top: 80px;
  }
`

const BackForwardButton = styled.button<{ $isDisabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  background: none;
  border: none;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.3 : 1)};
  padding: 0;

  > svg {
    width: 25px;
    height: 25px;
  }

  ${({ theme }) => theme.breakpoint.md} {
    min-width: 40px;
    height: 40px;

    > svg {
      width: 40px;
      height: 40px;
    }
  }
`

const PaginationButton = styled.button<{
  $isActive?: boolean
  $isDisabled?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 1px solid #000;
  border-color: ${({ $isActive, $isDisabled, theme }) =>
    $isDisabled
      ? theme.colors.grayscale[60]
      : $isActive
      ? theme.colors.grayscale[0]
      : theme.colors.primary[20]};
  background: #fff;
  color: ${({ $isActive, $isDisabled, theme }) =>
    $isDisabled
      ? theme.colors.grayscale[60]
      : $isActive
      ? theme.colors.grayscale[0]
      : theme.colors.primary[20]};
  font-size: 10px;
  font-weight: 500;
  line-height: 1.5;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  border-radius: 11px;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[20]};
    border-color: ${({ theme }) => theme.colors.primary[20]};
    color: #fff;
  }

  ${({ theme }) => theme.breakpoint.md} {
    min-width: 36px;
    height: 36px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 18px;
  }

  &:disabled {
    opacity: 0.5;
  }
`

const PaginationEllipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  color: ${({ theme }) => theme.colors.primary[20]};
  font-size: 14px;

  ${({ theme }) => theme.breakpoint.xl} {
    min-width: 48px;
    height: 48px;
    font-size: 16px;
  }
`

// Helper function to format date
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}/${month}/${day} ${hours}:${minutes}`
  } catch {
    return ''
  }
}

// Helper function to get image URL from post (with fallback to default image)
const getImageUrl = (post: TopicPost): string => {
  const resized = post.heroImage?.resized
  const resizedWebp = post.heroImage?.resizedWebp
  return (
    resizedWebp?.w800 ||
    resizedWebp?.w480 ||
    resized?.w800 ||
    resized?.w480 ||
    resized?.original ||
    DEFAULT_POST_IMAGE_PATH
  )
}

// Helper function to get hero image URL from topic
// Note: Using card sizes (w800 max) to reduce payload. If larger sizes are needed,
// create a separate query with full image fragments.
const getHeroImageUrl = (topic: Topic): string => {
  const resized = topic.heroImage?.resized
  const resizedWebp = topic.heroImage?.resizedWebp
  return (
    resizedWebp?.w800 ||
    resizedWebp?.w480 ||
    resized?.w800 ||
    resized?.w480 ||
    resized?.original ||
    ''
  )
}

type PageProps = {
  topic: Topic
}

const TopicPage: NextPageWithLayout<PageProps> = ({ topic }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const posts = topic.posts || []
  const totalPages = Math.ceil(posts.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    gtag.sendEvent('topic', 'click', `page-${page}`)
  }

  // Paginate posts
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPosts = posts.slice(startIndex, endIndex)

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)

    if (currentPage > 3) {
      pages.push('...')
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push('...')
    }

    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  // Get hero image URL
  const heroImageUrl = getHeroImageUrl(topic)

  // Get tags as array of names
  const tagNames = topic.tags?.map((tag) => tag.name) || []

  return (
    <PageWrapper>
      {/* Hero Section */}
      <HeroSection>
        {heroImageUrl && (
          <HeroImage src={heroImageUrl} alt={topic.title || ''} />
        )}
      </HeroSection>

      {/* Content */}
      <ContentWrapper>
        <TopicHeader>
          {/* Topic Title */}
          <TopicTitleSection>
            <TopicTitle>{topic.title}</TopicTitle>
          </TopicTitleSection>

          {/* Summary (content field from API) */}
          {topic.content && <TopicSummary>{topic.content}</TopicSummary>}

          {/* Update Time */}
          {topic.updatedAt && (
            <UpdateTime>
              最新更新時間 <span>{formatDate(topic.updatedAt)}</span>
            </UpdateTime>
          )}

          {/* Tags */}
          {tagNames.length > 0 && (
            <TagSection>
              <TagRow>
                <TagLabel>標籤：</TagLabel>
                <TagList>
                  {tagNames.map((tagName, index) => (
                    <Tag key={index}>
                      {tagName}
                      {index < tagNames.length - 1 && '、'}
                    </Tag>
                  ))}
                </TagList>
              </TagRow>
            </TagSection>
          )}
        </TopicHeader>

        {/* Article List */}
        <ArticleList>
          {currentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/node/${post.id}`}
              passHref
              legacyBehavior
            >
              <ArticleCard
                onClick={() =>
                  gtag.sendEvent('topic', 'click', `article-${post.title}`)
                }
              >
                <ArticleImageWrapper>
                  <ArticleImage
                    src={getImageUrl(post)}
                    alt={post.title || ''}
                  />
                </ArticleImageWrapper>
                <ArticleContent>
                  <ArticleTitle>{post.title}</ArticleTitle>
                  <ArticleExcerpt>
                    {getBriefText(post.brief, null, 150)}
                  </ArticleExcerpt>
                </ArticleContent>
              </ArticleCard>
            </Link>
          ))}
        </ArticleList>

        {/* Pagination */}
        {totalPages > 1 && (
          <PaginationWrapper>
            <BackForwardButton
              $isDisabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <IconBack />
            </BackForwardButton>

            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <PaginationEllipsis key={`ellipsis-${index}`}>
                    ...
                  </PaginationEllipsis>
                )
              }

              return (
                <PaginationButton
                  key={page}
                  $isActive={currentPage === page}
                  onClick={() => handlePageChange(page as number)}
                >
                  {String(page).padStart(2, '0')}
                </PaginationButton>
              )
            })}

            <BackForwardButton
              $isDisabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <IconForward />
            </BackForwardButton>
          </PaginationWrapper>
        )}
      </ContentWrapper>
    </PageWrapper>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  params,
  res,
}) => {
  setCacheControl(res)

  const topicId = params?.id as string

  if (!topicId) {
    return {
      notFound: true,
    }
  }

  const client = getGqlClient()

  try {
    const { data, error: gqlError } = await client.query<{ topics: Topic[] }>({
      query: topicById,
      variables: { topicId },
    })

    if (gqlError) {
      console.error(
        errors.helpers.wrap(
          new Error('Errors returned in `topicById` query'),
          'GraphQLError',
          'failed to complete `topicById`',
          { errors: gqlError }
        )
      )
    }

    const topic = data?.topics?.[0]

    if (!topic) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        topic,
      },
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching topic data'
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

    return {
      notFound: true,
    }
  }
}

TopicPage.getLayout = function getLayout(page: ReactElement<PageProps>) {
  const { props } = page
  const { topic } = props

  // Get hero image URL for og:image
  const heroImageUrl = getHeroImageUrl(topic)

  return (
    <LayoutGeneral
      title={topic.title || '專題'}
      description={topic.content || ''}
      imageUrl={heroImageUrl || undefined}
    >
      {page}
    </LayoutGeneral>
  )
}

export default TopicPage
