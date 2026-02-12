import { Eic } from '@eic-web/draft-renderer'
import dayjs from 'dayjs'
import type { RawDraftContentState } from 'draft-js'

import type { Post } from '~/graphql/fragments/post'
import type {
  GenericPhoto,
  GenericPost,
  keyOfResizedImages,
  ResizedImages,
} from '~/types/common'
import type { ArticleCard } from '~/types/component'
const { removeEmptyContentBlock, hasContentInRawContentBlock } = Eic

export function getHref({
  id,
}: Partial<Pick<GenericPost, 'style' | 'id'> & { slug: string }>): string {
  return id ? `/node/${id}` : '/'
}

export function getUid({
  id,
}: Partial<Pick<GenericPost, 'style' | 'id'> & { slug: string }>): string {
  return `post-${id}`
}

export function getImageSrc(
  imageObject?: ResizedImages | null,
  beginSize: keyOfResizedImages = 'w480'
): string {
  const imageList: keyOfResizedImages[] = [
    'w480',
    'w800',
    'w1200',
    'w1600',
    'w2400',
    'original',
  ]

  if (!imageObject) {
    return ''
  }

  let imageSrc = ''
  for (
    let index = imageList.indexOf(beginSize);
    index < imageList.length;
    index += 1
  ) {
    const size = imageList[index]
    imageSrc = imageObject[size] || imageSrc
  }

  return imageSrc
}

export function formatPostDate(datetime: dayjs.ConfigType): string {
  return dayjs(datetime).format('YYYY年MM月DD日')
}

export function formatReadTime(readingTime = 0): string {
  return readingTime
    ? `閱讀時間 ${Number(readingTime)} 分鐘`
    : `閱讀時間 10 分鐘`
}

export function getImageOfArticle({
  images,
  beginSize,
}: {
  images: (GenericPhoto | null | undefined)[]
  beginSize?: keyOfResizedImages
}): string {
  return images.reduce((image, curr) => {
    if (image) return image
    else return getImageSrc(curr?.resized, beginSize)
  }, '')
}

export function convertPostToArticleCard(
  post: Post | null,
  images?: ResizedImages,
  imagesWebP?: ResizedImages
): ArticleCard {
  const {
    id = 'no-id',
    title = '',
    style,
    publishTime = '',
    tags = [],
    contentPreview,
  } = post ?? {}

  return {
    id: getUid({ style, id }),
    title,
    href: getHref({ style, id }),
    date: formatPostDate(publishTime),
    summary: contentPreview ?? '',
    isReport: false,
    images: images ?? {},
    imagesWebP: imagesWebP ?? {},
    tags: tags?.map((tag) => ({ id: tag.id, name: tag.name })) ?? [],
  }
}

export const postConvertFunc = (post: Post): ArticleCard => {
  const { heroImage, ogImage } = post
  const images = ogImage?.resized ?? heroImage?.resized ?? {}
  const imagesWebP = ogImage?.resizedWebp ?? heroImage?.resizedWebp ?? {}
  return convertPostToArticleCard(post, images, imagesWebP)
}

export const getResizedUrl = (
  resized: ResizedImages | undefined | null
): string | undefined => {
  return (
    resized?.w480 ||
    resized?.w800 ||
    resized?.w1200 ||
    resized?.w1600 ||
    resized?.w2400 ||
    resized?.original
  )
}

export const copyAndSliceDraftBlock = (
  content: RawDraftContentState,
  startIndex: number,
  endIndex?: number
): RawDraftContentState => {
  const shouldRenderDraft = hasContentInRawContentBlock(content)

  if (shouldRenderDraft) {
    const contentWithoutEmptyBlock = removeEmptyContentBlock(content)
    const newContent = JSON.parse(JSON.stringify(contentWithoutEmptyBlock))

    if (endIndex && newContent.blocks.length >= endIndex) {
      newContent.blocks = newContent.blocks.slice(startIndex, endIndex)
    } else if (newContent.blocks.length > startIndex) {
      newContent.blocks = newContent.blocks.slice(startIndex)
    }

    return newContent
  }

  return content
}

export const getBlocksCount = (content: RawDraftContentState): number => {
  if (hasContentInRawContentBlock(content)) {
    return removeEmptyContentBlock(content).blocks.length
  } else {
    return 0
  }
}

/**
 * 合併精選文章和一般文章
 * 精選文章優先顯示（依照 featuredPostsInInputOrder 的順序），
 * 剩餘位置由一般文章補充（排除已在精選中的文章）
 *
 * @param featuredPosts - 精選文章陣列（依照新增順序）
 * @param regularPosts - 一般文章陣列（依照發布時間排序）
 * @param maxCount - 最大文章數量（可選，預設不限制）
 * @returns 合併後的文章陣列
 */
export function mergePostsWithFeatured<T extends { id: string }>(
  featuredPosts: T[] = [],
  regularPosts: T[] = [],
  maxCount?: number
): T[] {
  // 建立精選文章 ID 集合，用於快速查詢
  const featuredIds = new Set(featuredPosts.map((post) => post.id))

  // 過濾掉已在精選中的一般文章
  const nonFeaturedPosts = regularPosts.filter(
    (post) => !featuredIds.has(post.id)
  )

  // 合併：精選文章在前，一般文章在後
  const mergedPosts = [...featuredPosts, ...nonFeaturedPosts]

  // 如果有指定最大數量，則截斷
  return maxCount !== undefined ? mergedPosts.slice(0, maxCount) : mergedPosts
}
