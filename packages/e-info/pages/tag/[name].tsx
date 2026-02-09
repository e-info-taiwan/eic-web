// 標籤頁
import errors from '@twreporter/errors'
import type { GetServerSideProps } from 'next'
import type { ReactElement } from 'react'
import styled from 'styled-components'

import { getGqlClient } from '~/apollo-client'
import LayoutGeneral from '~/components/layout/layout-general'
import ArticleLists from '~/components/shared/article-lists'
import Pagination from '~/components/shared/pagination'
import SectionHeading from '~/components/shared/section-heading'
import { POSTS_PER_PAGE } from '~/constants/layout'
import type { HeaderContextData } from '~/contexts/header-context'
import type { TagWithPostsCount } from '~/graphql/query/tag'
import { tagPostsForListing } from '~/graphql/query/tag'
import type { NextPageWithLayout } from '~/pages/_app'
import type { ArticleCard } from '~/types/component'
import { setCacheControl } from '~/utils/common'
import { fetchHeaderData } from '~/utils/header-data'
import { postConvertFunc } from '~/utils/post'

const TagWrapper = styled.div`
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

type PageProps = {
  headerData: HeaderContextData
  posts: ArticleCard[]
  tagName: string
  currentPage: number
  totalPages: number
}

const Tag: NextPageWithLayout<PageProps> = ({
  posts,
  tagName,
  currentPage,
  totalPages,
}) => {
  const sectionTitle = tagName

  const buildPageUrl = (page: number) => {
    if (page === 1) {
      return `/tag/${encodeURIComponent(tagName)}`
    }
    return `/tag/${encodeURIComponent(tagName)}?page=${page}`
  }

  return (
    <TagWrapper aria-label={sectionTitle}>
      <SectionHeading title={sectionTitle} />

      <ArticleLists posts={posts} AdPageKey="tag" />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildPageUrl={buildPageUrl}
      />
    </TagWrapper>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  params,
  query,
  res,
}) => {
  setCacheControl(res)

  const client = getGqlClient()
  const name = params?.name as string
  const page = Math.max(1, parseInt(query.page as string, 10) || 1)
  const skip = (page - 1) * POSTS_PER_PAGE

  try {
    // fetch header data and tag posts in parallel
    const [headerData, { data, error: gqlError }] = await Promise.all([
      fetchHeaderData(),
      client.query<{
        tags: TagWithPostsCount[]
      }>({
        query: tagPostsForListing,
        variables: {
          tagName: name,
          take: POSTS_PER_PAGE,
          skip,
        },
      }),
    ])

    const tags = data?.tags ?? []

    if (gqlError) {
      const annotatingError = errors.helpers.wrap(
        new Error('Errors returned in `tags` query'),
        'GraphQLError',
        'failed to complete `tags`',
        { errors: gqlError }
      )

      throw annotatingError
    }

    // if this tag not exist, return 404
    if (!tags[0]) {
      return { notFound: true }
    }

    const totalPosts = tags[0].postsCount
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)
    const posts = tags[0].posts?.map(postConvertFunc) || []

    return {
      props: {
        headerData,
        posts,
        tagName: name,
        currentPage: page,
        totalPages,
      },
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching data at Tag page'
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

Tag.getLayout = function getLayout(page: ReactElement<PageProps>) {
  const { props } = page
  const ogTitle = `${props.tagName}`

  return <LayoutGeneral title={ogTitle}>{page}</LayoutGeneral>
}

export default Tag
