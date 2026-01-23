import errors from '@twreporter/errors'
import type { RawDraftContentBlock } from 'draft-js'
import type { GetStaticPaths, GetStaticProps } from 'next'

import { getGqlClient } from '~/apollo-client'
import CustomHead from '~/components/layout/custom-head'
import Blank from '~/components/post/article-type/blank'
import Frame from '~/components/post/article-type/frame'
import News from '~/components/post/article-type/news'
import ScrollableVideo from '~/components/post/article-type/scrollable-video'
import MisoPageView from '~/components/shared/miso-pageview'
import { SITE_TITLE } from '~/constants/constant'
import type { HeaderContextData } from '~/contexts/header-context'
import type { PostDetail } from '~/graphql/query/post'
import { post as postQuery } from '~/graphql/query/post'
import { useReadingTracker } from '~/hooks/useReadingTracker'
import type { NextPageWithLayout } from '~/pages/_app'
import { ResizedImages, ValidPostStyle } from '~/types/common'
import { fetchHeaderData } from '~/utils/header-data'

type PageProps = {
  headerData: HeaderContextData
  postData: PostDetail
}

const Post: NextPageWithLayout<PageProps> = ({ postData }) => {
  // Track reading history for logged-in members
  useReadingTracker(postData?.id)

  let articleType: JSX.Element

  switch (postData.style) {
    // New API styles (render as News layout)
    case ValidPostStyle.DEFAULT:
    case ValidPostStyle.EDITOR:
    // Legacy styles
    case ValidPostStyle.NEWS:
    case ValidPostStyle.EMBEDDED:
      articleType = <News postData={postData} />
      break
    case ValidPostStyle.SCROLLABLE_VIDEO:
      articleType = <ScrollableVideo postData={postData} />
      break
    case ValidPostStyle.BLANK:
      articleType = <Blank postData={postData} />
      break
    case ValidPostStyle.FRAME:
      articleType = <Frame postData={postData} />
      break
    default:
      articleType = <News postData={postData} />
      break
  }

  // head info
  function convertDraftToText(blocks: RawDraftContentBlock[]) {
    if (blocks) {
      const text = blocks.map((block) => block.text).join('')
      const ogDescription =
        text && text.length > 160
          ? text.trim().slice(0, 160) + '...'
          : text.trim()
      return ogDescription
    }
  }

  // phase 1
  function getResizedUrl(
    resized: ResizedImages | undefined | null
  ): string | undefined {
    return resized?.original
  }

  // phase 2 - debug imageUrl onError
  // function getResizedUrl(
  //   resized: ResizedImages | undefined | null
  // ): string | undefined {
  //   return (
  //     resized?.w480 ||
  //     resized?.w800 ||
  //     resized?.w1200 ||
  //     resized?.w1600 ||
  //     resized?.w2400 ||
  //     resized?.original
  //   )
  // }

  const ogTitle = postData?.title
    ? `${postData?.title} - ${SITE_TITLE}`
    : SITE_TITLE

  const ogDescription =
    convertDraftToText(postData?.brief?.blocks) ||
    convertDraftToText(postData?.content?.blocks)

  const ogImageUrl =
    getResizedUrl(postData?.ogImage?.resized) ||
    getResizedUrl(postData?.heroImage?.resized)

  return (
    <>
      <CustomHead
        title={ogTitle}
        description={ogDescription}
        imageUrl={ogImageUrl}
      />
      <MisoPageView productIds={postData.id} />
      {articleType}
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // 使用 fallback: 'blocking' 按需生成頁面
  // 不預先生成任何頁面，所有頁面都在首次訪問時生成
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const client = getGqlClient()
  const postId = params?.id

  try {
    // fetch header data and post data in parallel
    const [headerData, { data, error: gqlError }] = await Promise.all([
      fetchHeaderData(),
      client.query<{
        posts: PostDetail[]
      }>({
        query: postQuery,
        variables: { id: postId },
      }),
    ])

    if (gqlError) {
      const annotatingError = errors.helpers.wrap(
        'GraphQLError',
        'failed to complete `postData`',
        { errors: gqlError }
      )

      throw annotatingError
    }

    if (!data?.posts?.[0]) {
      return { notFound: true }
    }

    const postStyle = data.posts[0].style

    if (postStyle === ValidPostStyle.EMBEDDED) {
      return { notFound: true }
    }

    // Note: New API doesn't have slug field
    // REPORT and PROJECT3 redirects are disabled until slug is available
    // if (postStyle === ValidPostStyle.REPORT) {
    //   return {
    //     redirect: {
    //       destination: `https://${SITE_URL}/project/${postSlug}/`,
    //       permanent: false,
    //     },
    //   }
    // } else if (postStyle === ValidPostStyle.PROJECT3) {
    //   return {
    //     redirect: {
    //       destination: `https://${SITE_URL}/project/3/${postSlug}/`,
    //       permanent: false,
    //     },
    //   }
    // }

    return {
      props: {
        headerData,
        postData: data.posts[0],
      },
      // ISR: 每 5 分鐘重新驗證一次
      // 可根據需求調整：60（1分鐘）、300（5分鐘）、3600（1小時）
      revalidate: 300,
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching data at Post page'
    )

    console.log(JSON.stringify(err, null, 2))

    // All exceptions that include a stack trace will be
    // integrated with Error Reporting.
    // See https://cloud.google.com/run/docs/error-reporting
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(annotatingError, {
          withStack: true,
          withPayload: true,
        }),
      })
    )

    throw new Error('Error occurs while fetching data.')
  }
}

export default Post
