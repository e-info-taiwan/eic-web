// 深度專題列表頁面
// @ts-ignore: no definition
import errors from '@twreporter/errors'
import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'
import styled from 'styled-components'

import { getGqlClient } from '~/apollo-client'
import LayoutGeneral from '~/components/layout/layout-general'
import { DEFAULT_POST_IMAGE_PATH } from '~/constants/constant'
import type { Topic } from '~/graphql/query/section'
import { allTopics } from '~/graphql/query/section'
import type { NextPageWithLayout } from '~/pages/_app'
import { setCacheControl } from '~/utils/common'
import * as gtag from '~/utils/gtag'

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 26px 27px 0;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 28px 98px 0;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 36px 58px 0;
  }
`

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 28px;
  gap: 12px;
  padding-bottom: 24px;
  border-bottom: 4px solid ${({ theme }) => theme.colors.secondary[20]};

  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: 28px;
  }
`

const AccentBar = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary[20]};
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
  color: ${({ theme }) => theme.colors.secondary[20]};
  margin: 0;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 28px;
    line-height: 32px;
  }
`

const FeaturedSection = styled.section`
  margin-bottom: 60px;

  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: 48px;
  }
`

const FeaturedArticle = styled.article`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 40px;

  ${({ theme }) => theme.breakpoint.md} {
    gap: 24px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    grid-template-columns: 680px 1fr;
  }
`

const FeaturedImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background-color: #f0f0f0;
`

const FeaturedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const FeaturedContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const FeaturedTextContent = styled.div``

const FeaturedTitle = styled.h2`
  font-size: 28px;
  font-weight: 500;
  line-height: 32px;
  color: ${({ theme }) => theme.colors.secondary[20]};
  margin: 0 0 12px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary[0]};
  }

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 28px;
    margin-bottom: 16px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 36px;
    line-height: 1.25;
    margin-bottom: 20px;
  }
`

const FeaturedDate = styled.time`
  display: block;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  margin-bottom: 24px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
`

const FeaturedExcerpt = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  margin: 0;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
`

const EnterButton = styled.a`
  display: none;
  align-self: flex-end;
  padding: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary[40]};
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.3s ease;
  margin-top: 20px;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary[0]};
  }

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    display: inline-block;
  }
`

const MobileEnterButton = styled.a`
  display: block;
  text-align: center;
  padding: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary[40]};
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.3s ease;
  margin: 32px auto 0;

  &:hover {
    color: #c96635;
  }

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  padding: 0 33px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 0;
    gap: 24px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
`

const ArticleCard = styled.a`
  display: block;
  text-decoration: none;
  cursor: pointer;

  ${({ theme }) => theme.breakpoint.md} {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 20px;
    align-items: start;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
  }
`

const ArticleImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background-color: #f0f0f0;
  margin-bottom: 12px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 0;
    width: 280px;
    flex-shrink: 0;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    width: 100%;
    margin-bottom: 12px;
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
`

const ArticleDate = styled.time`
  display: block;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #666;
  margin-bottom: 8px;
`

const ArticleTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  color: #000;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const Divider = styled.hr`
  border: none;
  border-top: 2px solid ${({ theme }) => theme.colors.secondary[20]};
  margin: 48px 0;

  ${({ theme }) => theme.breakpoint.xl} {
    margin: 48px 0;
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

// Helper function to get image URL from topic (with fallback to default image)
const getTopicImageUrl = (topic: Topic): string => {
  const resized = topic.heroImage?.resized
  const resizedWebp = topic.heroImage?.resizedWebp
  return (
    resizedWebp?.w800 ||
    resizedWebp?.w480 ||
    resized?.w800 ||
    resized?.w480 ||
    resized?.original ||
    DEFAULT_POST_IMAGE_PATH
  )
}

type PageProps = {
  topics: Topic[]
}

const FeaturedTopicsPage: NextPageWithLayout<PageProps> = ({ topics }) => {
  // Split topics into featured (isPinned) and regular
  const featuredTopics = topics.filter((topic) => topic.isPinned)
  const regularTopics = topics.filter((topic) => !topic.isPinned)

  const renderFeaturedArticle = (topic: Topic, index: number) => {
    const topicHref = `/feature/${topic.id}`
    const topicImage = getTopicImageUrl(topic)
    const topicDate = formatDate(topic.updatedAt)

    return (
      <FeaturedSection key={topic.id}>
        <FeaturedArticle>
          <FeaturedImageWrapper>
            <Link href={topicHref} passHref legacyBehavior>
              <a
                onClick={() =>
                  gtag.sendEvent(
                    'featured-topics',
                    'click',
                    `featured-${topic.title}`
                  )
                }
              >
                <FeaturedImage src={topicImage} alt={topic.title || ''} />
              </a>
            </Link>
          </FeaturedImageWrapper>

          <FeaturedContent>
            <FeaturedTextContent>
              <Link href={topicHref}>
                <FeaturedTitle>{topic.title}</FeaturedTitle>
              </Link>
              <FeaturedDate>{topicDate}</FeaturedDate>
              {topic.content && (
                <FeaturedExcerpt>{topic.content}</FeaturedExcerpt>
              )}
            </FeaturedTextContent>
            <Link href={topicHref} passHref legacyBehavior>
              <EnterButton
                onClick={() =>
                  gtag.sendEvent(
                    'featured-topics',
                    'click',
                    `enter-${topic.title}`
                  )
                }
              >
                進入專題
              </EnterButton>
            </Link>
          </FeaturedContent>
        </FeaturedArticle>

        {/* Show article grid after first featured topic */}
        {index === 0 && regularTopics.length > 0 && (
          <ArticleGrid>
            {regularTopics.map((regularTopic) => {
              const regularHref = `/feature/${regularTopic.id}`
              const regularImage = getTopicImageUrl(regularTopic)
              const regularDate = formatDate(regularTopic.updatedAt)

              return (
                <Link
                  key={regularTopic.id}
                  href={regularHref}
                  passHref
                  legacyBehavior
                >
                  <ArticleCard
                    onClick={() =>
                      gtag.sendEvent(
                        'featured-topics',
                        'click',
                        `article-${regularTopic.title}`
                      )
                    }
                  >
                    <ArticleImageWrapper>
                      <ArticleImage
                        src={regularImage}
                        alt={regularTopic.title || ''}
                      />
                    </ArticleImageWrapper>
                    <ArticleContent>
                      <ArticleDate>{regularDate}</ArticleDate>
                      <ArticleTitle>{regularTopic.title}</ArticleTitle>
                    </ArticleContent>
                  </ArticleCard>
                </Link>
              )
            })}
          </ArticleGrid>
        )}
        <Link href={topicHref} passHref legacyBehavior>
          <MobileEnterButton
            onClick={() =>
              gtag.sendEvent('featured-topics', 'click', `enter-${topic.title}`)
            }
          >
            進入專題
          </MobileEnterButton>
        </Link>
        <Divider />
      </FeaturedSection>
    )
  }

  return (
    <PageWrapper>
      <SectionTitle>
        <AccentBar />
        <Title>深度專題</Title>
      </SectionTitle>

      {featuredTopics.map((topic, index) =>
        renderFeaturedArticle(topic, index)
      )}
    </PageWrapper>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  res,
}) => {
  setCacheControl(res)

  const client = getGqlClient()

  try {
    const { data, error: gqlError } = await client.query<{ topics: Topic[] }>({
      query: allTopics,
    })

    if (gqlError) {
      console.error(
        errors.helpers.wrap(
          new Error('Errors returned in `allTopics` query'),
          'GraphQLError',
          'failed to complete `allTopics`',
          { errors: gqlError }
        )
      )
    }

    const topics = data?.topics || []

    return {
      props: {
        topics,
      },
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching topics data'
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
      props: {
        topics: [],
      },
    }
  }
}

FeaturedTopicsPage.getLayout = function getLayout(
  page: ReactElement<PageProps>
) {
  return (
    <LayoutGeneral
      title="深度專題"
      description="探討環境、能源、氣候等重要議題的深度報導"
    >
      {page}
    </LayoutGeneral>
  )
}

export default FeaturedTopicsPage
