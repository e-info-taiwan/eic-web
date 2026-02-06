// 作者頁
import errors from '@twreporter/errors'
import type { GetServerSideProps } from 'next'
import type { ReactElement } from 'react'
import styled from 'styled-components'

import { getGqlClient } from '~/apollo-client'
import LayoutGeneral from '~/components/layout/layout-general'
import ArticleLists from '~/components/shared/article-lists'
import Pagination from '~/components/shared/pagination'
import SectionHeading from '~/components/shared/section-heading'
import { DEFAULT_POST_IMAGE_PATH } from '~/constants/constant'
import type { HeaderContextData } from '~/contexts/header-context'
import type { Author, AuthorImage } from '~/graphql/fragments/author'
import type { Post } from '~/graphql/fragments/post'
import { author as authorQuery } from '~/graphql/query/author'
import { authorPostsWithCount } from '~/graphql/query/post'
import type { NextPageWithLayout } from '~/pages/_app'
import type { ArticleCard } from '~/types/component'
import { setCacheControl } from '~/utils/common'
import { fetchHeaderData } from '~/utils/header-data'
import { postConvertFunc } from '~/utils/post'

const POSTS_PER_PAGE = 12

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

// 作者資訊區塊（頭像 + 自介）
// 手機：垂直排列，平板/桌面：水平排列
const AuthorInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 24px;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale[0]};

  ${({ theme }) => theme.breakpoint.md} {
    flex-direction: row;
    gap: 32px;
    margin-bottom: 48px;
    padding-bottom: 48px;
  }
`

const AuthorAvatar = styled.div`
  flex-shrink: 0;
  width: 160px;
  overflow: hidden;

  ${({ theme }) => theme.breakpoint.md} {
    width: 180px;
    height: 180px;
  }

  img {
    width: 100%;
    height: auto;
    object-fit: cover;

    ${({ theme }) => theme.breakpoint.md} {
      height: 100%;
    }
  }
`

const AuthorBio = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.grayscale[20]};

  ${({ theme }) => theme.breakpoint.md} {
    flex: 1;
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
  posts: ArticleCard[]
  authorId: string
  authorName: string
  authorBio?: string | null
  authorImage?: AuthorImage | null
  currentPage: number
  totalPages: number
}

const AuthorPage: NextPageWithLayout<PageProps> = ({
  posts,
  authorId,
  authorName,
  authorBio,
  authorImage,
  currentPage,
  totalPages,
}) => {
  const sectionTitle = authorName
  const hasAuthorInfo = authorImage || authorBio

  const buildPageUrl = (page: number) => {
    if (page === 1) {
      return `/author/${authorId}`
    }
    return `/author/${authorId}?page=${page}`
  }

  return (
    <AuthorWrapper aria-label={sectionTitle}>
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

      <ArticleLists posts={posts} AdPageKey="author" />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildPageUrl={buildPageUrl}
      />
    </AuthorWrapper>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  params,
  query,
  res,
}) => {
  setCacheControl(res)

  const client = getGqlClient()
  const id = params?.id as string
  const page = Math.max(1, parseInt(query.page as string, 10) || 1)
  const skip = (page - 1) * POSTS_PER_PAGE

  try {
    // fetch header data, author data, and author posts in parallel
    const [headerData, authorResult, postsResult] = await Promise.all([
      fetchHeaderData(),
      client.query<{ author: Author }>({
        query: authorQuery,
        variables: { id },
      }),
      client.query<{ authorPosts: Post[]; authorPostsCount: number }>({
        query: authorPostsWithCount,
        variables: { authorId: id, first: POSTS_PER_PAGE, skip },
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

    // if author id not exist, return 404
    if (!author) {
      return { notFound: true }
    }

    const totalPosts = postsData?.authorPostsCount ?? 0
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)
    const posts = postsData?.authorPosts?.map(postConvertFunc) ?? []

    return {
      props: {
        headerData,
        posts,
        authorId: id,
        authorName: author.name,
        authorBio: author.bio || null,
        authorImage: author.image || null,
        currentPage: page,
        totalPages,
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

AuthorPage.getLayout = function getLayout(page: ReactElement<PageProps>) {
  const { props } = page
  const ogTitle = `${props.authorName}`

  return <LayoutGeneral title={ogTitle}>{page}</LayoutGeneral>
}

export default AuthorPage
