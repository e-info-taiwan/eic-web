// 作者頁
import errors from '@twreporter/errors'
import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { getGqlClient } from '~/apollo-client'
import Adsense from '~/components/ad/google-adsense/adsense-ad'
import LayoutGeneral from '~/components/layout/layout-general'
import ArticleLists from '~/components/shared/article-lists'
import SectionHeading from '~/components/shared/section-heading'
import { DEFAULT_POST_IMAGE_PATH } from '~/constants/constant'
import type { HeaderContextData } from '~/contexts/header-context'
import type { Author, AuthorImage } from '~/graphql/fragments/author'
import type { Post } from '~/graphql/fragments/post'
import { author as authorQuery } from '~/graphql/query/author'
import { authorPosts as authorPostsQuery } from '~/graphql/query/post'
import useInfiniteScroll from '~/hooks/useInfiniteScroll'
import type { NextPageWithLayout } from '~/pages/_app'
import { ArticleCard } from '~/types/component'
import { setCacheControl } from '~/utils/common'
import { fetchHeaderData } from '~/utils/header-data'
import { postConvertFunc } from '~/utils/post'

const AuthorWrapper = styled.div`
  padding: 20px 20px 24px;

  ${({ theme }) => theme.breakpoint.sm} {
    padding: 20px 20px 48px;
  }
  ${({ theme }) => theme.breakpoint.md} {
    padding: 20px 48px 48px;
  }

  ${({ theme }) => theme.breakpoint.lg} {
    padding: 20px 72px 60px;
    max-width: 1240px;
    margin: auto;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 40px 72px 60px;
  }
`

const StyledAdsense_HD = styled(Adsense)`
  margin-bottom: 20px;

  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: 60px;
  }
`

// 作者資訊區塊（頭像 + 自介）
const AuthorInfoSection = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 24px;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale[0]};

  ${({ theme }) => theme.breakpoint.md} {
    gap: 32px;
    margin-bottom: 48px;
    padding-bottom: 48px;
  }
`

const AuthorAvatar = styled.div`
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  overflow: hidden;

  ${({ theme }) => theme.breakpoint.md} {
    width: 180px;
    height: 180px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const AuthorBio = styled.div`
  flex: 1;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.grayscale[20]};

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
  }
`

// Helper function to get author image URL
const getAuthorImageUrl = (image: AuthorImage | null | undefined): string => {
  if (!image) return DEFAULT_POST_IMAGE_PATH
  const resized = image.resized
  const resizedWebp = image.resizedWebp
  return (
    resizedWebp?.w480 ||
    resizedWebp?.original ||
    resized?.w480 ||
    resized?.original ||
    DEFAULT_POST_IMAGE_PATH
  )
}

type PageProps = {
  headerData: HeaderContextData
  authorPosts?: ArticleCard[]
  authorName: string
  authorBio?: string | null
  authorImage?: AuthorImage | null
}

const Author: NextPageWithLayout<PageProps> = ({
  authorPosts,
  authorName,
  authorBio,
  authorImage,
}) => {
  const client = getGqlClient()
  const router = useRouter()

  const [displayPosts, setDisplayPosts] = useState(authorPosts)

  //infinite scroll: check amount of posts yet to be displayed.
  //if amount = 0, means all posts are displayed, observer.unobserve.
  const [dataAmount, setDataAmount] = useState(displayPosts?.length)

  //fetch more related 12 posts
  const fetchMoreAuthorPosts = async (
    displayPosts: ArticleCard[] | undefined
  ) => {
    try {
      {
        // fetch author related 12 posts
        const { data, error: gqlErrors } = await client.query<{
          authorPosts: Post[]
        }>({
          query: authorPostsQuery,
          variables: {
            authorId: router?.query?.id,
            first: 12,
            skip: displayPosts?.length,
          },
        })

        if (gqlErrors) {
          const annotatingError = errors.helpers.wrap(
            new Error('Errors returned in `author` query'),
            'GraphQLError',
            'failed to complete `author`',
            { errors: gqlErrors }
          )

          throw annotatingError
        }

        const newPosts = data?.authorPosts?.map(postConvertFunc) || []

        setDataAmount(newPosts.length) //amount of posts yet to be displayed.

        setDisplayPosts([...(displayPosts || []), ...newPosts])
      }
    } catch (err) {
      console.log(err)
    }
  }

  // infinite scroll
  const [ref, isAtBottom] = useInfiniteScroll({
    amount: dataAmount,
  })

  useEffect(() => {
    if (isAtBottom) {
      fetchMoreAuthorPosts(displayPosts)
    }
  }, [isAtBottom])

  const sectionTitle = `${authorName}`
  const hasAuthorInfo = authorImage || authorBio

  return (
    <AuthorWrapper aria-label={sectionTitle}>
      {/* <StyledAdsense_HD pageKey="author" adKey="HD" /> */}
      <SectionHeading
        title={sectionTitle}
        highlightColor="#eee500"
        headingLevel={2}
        showBorder={false}
      />
      {hasAuthorInfo && (
        <AuthorInfoSection>
          {authorImage && (
            <AuthorAvatar>
              <img src={getAuthorImageUrl(authorImage)} alt={authorName} />
            </AuthorAvatar>
          )}
          {authorBio && <AuthorBio>{authorBio}</AuthorBio>}
        </AuthorInfoSection>
      )}

      <ArticleLists posts={displayPosts} AdPageKey="author" />
      <span ref={ref} id="scroll-to-bottom-anchor" />
    </AuthorWrapper>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  params,
  res,
}) => {
  setCacheControl(res)

  const client = getGqlClient()
  const id = params?.id

  try {
    // fetch header data, author data, and author posts in parallel
    const [headerData, authorResult, postsResult] = await Promise.all([
      fetchHeaderData(),
      client.query<{ author: Author }>({
        query: authorQuery,
        variables: { id },
      }),
      client.query<{ authorPosts: Post[] }>({
        query: authorPostsQuery,
        variables: { authorId: id, first: 12 },
      }),
    ])

    const { data: authorData, error: authorError } = authorResult
    const { data: postsData, error: postsError } = postsResult
    const author = authorData?.author

    if (authorError) {
      const annotatingError = errors.helpers.wrap(
        new Error('Errors returned in `author` query'),
        'GraphQLError',
        'failed to complete `author`',
        { errors: authorError }
      )
      throw annotatingError
    }

    if (postsError) {
      const annotatingError = errors.helpers.wrap(
        new Error('Errors returned in `authorPosts` query'),
        'GraphQLError',
        'failed to complete `authorPosts`',
        { errors: postsError }
      )
      throw annotatingError
    }

    //if author id not exist, return 404
    if (!author) {
      return { notFound: true }
    }

    const authorPosts = postsData?.authorPosts?.map(postConvertFunc) ?? []

    return {
      props: {
        headerData,
        authorPosts,
        authorName: author.name,
        authorBio: author.bio || null,
        authorImage: author.image || null,
      },
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching data at Author page'
    )

    // All exceptions that include a stack trace will be
    // integrated with Error Reporting.
    // See https://cloud.google.com/run/docs/error-reporting
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

Author.getLayout = function getLayout(page: ReactElement<PageProps>) {
  const { props } = page
  const ogTitle = `搜尋：${props.authorName}`

  return <LayoutGeneral title={ogTitle}>{page}</LayoutGeneral>
}

export default Author
