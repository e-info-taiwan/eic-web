import errors from '@twreporter/errors'
import type { RawDraftContentBlock } from 'draft-js'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { getGqlClient } from '~/apollo-client'
import CustomHead from '~/components/layout/custom-head'
import Blank from '~/components/post/article-type/blank'
import Frame from '~/components/post/article-type/frame'
import News from '~/components/post/article-type/news'
import ScrollableVideo from '~/components/post/article-type/scrollable-video'
import { IS_PREVIEW_MODE } from '~/constants/config'
import { SITE_TITLE } from '~/constants/constant'
import type { HeaderContextData } from '~/contexts/header-context'
import { type Donation, footerDonationQuery } from '~/graphql/query/donation'
import { newsletterByOriginalUrl } from '~/graphql/query/newsletter'
import type { PostDetail } from '~/graphql/query/post'
import { post as postQuery } from '~/graphql/query/post'
import { useReadingTracker } from '~/hooks/useReadingTracker'
import type { NextPageWithLayout } from '~/pages/_app'
import { ResizedImages, ValidPostStyle } from '~/types/common'
import * as gtag from '~/utils/gtag'
import { fetchHeaderData } from '~/utils/header-data'

type PageProps = {
  headerData: HeaderContextData
  postData: PostDetail
  donation: Donation | null
}

const Post: NextPageWithLayout<PageProps> = ({ postData, donation }) => {
  const router = useRouter()

  // Track reading history for logged-in members
  useReadingTracker(postData?.id)

  // Track article pageview with category/section dimensions
  // Only track once per article load (when id or path changes)
  useEffect(() => {
    if (postData?.id) {
      const tags = [...(postData.tags || []).map((tag) => tag.name)].filter(
        Boolean
      )

      gtag.sendArticlePageview(router.asPath, {
        articleId: postData.id,
        articleTitle: postData.title,
        articleCategory: postData.category?.name,
        articleSection: postData.section?.name,
        articleTags: tags,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postData?.id, router.asPath])

  let articleType: JSX.Element

  switch (postData.style) {
    // New API styles (render as News layout)
    case ValidPostStyle.DEFAULT:
    case ValidPostStyle.EDITOR:
    // Legacy styles
    case ValidPostStyle.NEWS:
    case ValidPostStyle.EMBEDDED:
      articleType = <News postData={postData} donation={donation} />
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
      articleType = <News postData={postData} donation={donation} />
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
    // fetch header data, post data, and donation data in parallel
    const [headerData, { data, error: gqlError }, donationResult] =
      await Promise.all([
        fetchHeaderData(),
        client.query<{
          posts: PostDetail[]
        }>({
          query: postQuery,
          variables: { id: postId },
        }),
        client.query<{ donations: Donation[] }>({
          query: footerDonationQuery,
        }),
      ])

    // Get the first (most recent) active footer donation for article page
    const donation = donationResult.data?.donations?.[0] || null

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

    const postData = data.posts[0]
    const postStyle = postData.style

    if (postStyle === ValidPostStyle.EMBEDDED) {
      return { notFound: true }
    }

    // Redirect newsletter posts to /newsletter/[id]
    if (postData.isNewsletter) {
      const { data: newsletterData } = await client.query<{
        newsletters: { id: string }[]
      }>({
        query: newsletterByOriginalUrl,
        variables: { url: `/node/${postId}` },
      })

      if (newsletterData?.newsletters?.[0]) {
        return {
          redirect: {
            destination: `/newsletter/${newsletterData.newsletters[0].id}`,
            permanent: true,
          },
        }
      }
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
        postData,
        donation,
      },
      // ISR: Preview mode 10 秒，正式站 5 分鐘
      revalidate: IS_PREVIEW_MODE ? 10 : 300,
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
