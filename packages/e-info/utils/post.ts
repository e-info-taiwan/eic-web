import { Eic } from '@eic-web/draft-renderer'
import dayjs from 'dayjs'
import type { RawDraftContentState } from 'draft-js'

import { REPORT_STYLES } from '~/constants/constant'
import { SITE_URL } from '~/constants/environment-variables'
import type { ContentApiDataBlock, Post } from '~/graphql/fragments/post'
import type {
  GenericPhoto,
  GenericPost,
  keyOfResizedImages,
  ResizedImages,
} from '~/types/common'
import { ValidPostStyle } from '~/types/common'
import type { ArticleCard } from '~/types/component'
const { removeEmptyContentBlock, hasContentInRawContentBlock } = Eic

export function getHref({
  style,
  id,
  slug,
}: Partial<Pick<GenericPost, 'style' | 'id'> & { slug: string }>): string {
  switch (style) {
    case ValidPostStyle.DEFAULT:
    case ValidPostStyle.NEWS:
    case ValidPostStyle.EMBEDDED:
    case ValidPostStyle.FRAME:
    case ValidPostStyle.SCROLLABLE_VIDEO:
    case ValidPostStyle.BLANK:
      return `/node/${id}`
    case ValidPostStyle.REPORT:
      return `https://${SITE_URL}/project/${slug}/`
    case ValidPostStyle.PROJECT3:
      return `https://${SITE_URL}/project/3/${slug}/`
    default:
      // undefined value can't be serialized, so set default value to '/'
      return '/'
  }
}

export function getUid({
  style,
  id,
  slug,
}: Partial<Pick<GenericPost, 'style' | 'id'> & { slug: string }>): string {
  switch (style) {
    case ValidPostStyle.NEWS:
    case ValidPostStyle.EMBEDDED:
    case ValidPostStyle.FRAME:
    case ValidPostStyle.BLANK:
      return `post-${id}`
    case ValidPostStyle.REPORT:
      return `project-${slug}`
    case ValidPostStyle.PROJECT3:
      return `project-3-${slug}`
    default:
      return `default-uid-${style}-${slug}-${id}`
  }
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

export function isReport(style: string = ''): boolean {
  return REPORT_STYLES.includes(style)
}

export function formatPostDate(datetime: dayjs.ConfigType): string {
  return dayjs(datetime).format('YYYY-MM-DD-HH:mm')
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

// Helper function to check if text contains HTML tags (script, style, etc.)
const containsHtmlTags = (text: string): boolean => {
  return /<[^>]+>/.test(text)
}

// Helper function to extract text from contentApiData format
const getContentText = (
  contentApiData: ContentApiDataBlock[] | null | undefined,
  maxLength: number
): string => {
  if (!contentApiData || !Array.isArray(contentApiData)) return ''

  // Text block types that should be processed
  const textBlockTypes = [
    'unstyled',
    'header-one',
    'header-two',
    'header-three',
  ]

  // Find the first block with non-empty text content
  for (const block of contentApiData) {
    // Skip non-text blocks (image, video, etc.)
    if (!textBlockTypes.includes(block.type)) {
      continue
    }

    if (block.content && Array.isArray(block.content)) {
      // Only process string content (skip objects like image data)
      const stringContent = block.content.filter(
        (item): item is string => typeof item === 'string'
      )

      if (stringContent.length === 0) {
        continue
      }

      const text = stringContent.join('').trim()

      // Skip if empty or contains HTML tags (script, embedded code, etc.)
      if (!text || containsHtmlTags(text)) {
        continue
      }

      if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...'
      }
      return text
    }
  }

  return ''
}

// Helper function to extract brief text from Draft.js format
// Returns the first non-empty text block, truncated to maxLength characters
// Falls back to contentApiData if brief is empty
export const getBriefText = (
  brief: string | Record<string, unknown> | null | undefined,
  contentApiData: ContentApiDataBlock[] | null | undefined,
  maxLength: number = 100
): string => {
  // First try to extract from brief
  if (brief) {
    // If brief is a string, return it directly (truncated)
    if (typeof brief === 'string') {
      if (brief.length > maxLength) {
        return brief.slice(0, maxLength) + '...'
      }
      return brief
    }

    // If brief is Draft.js format with blocks array
    if (typeof brief === 'object' && 'blocks' in brief) {
      const blocks = brief.blocks as Array<{ text?: string }>
      if (Array.isArray(blocks)) {
        // Find the first non-empty text block
        for (const block of blocks) {
          if (block.text && block.text.trim()) {
            const text = block.text.trim()
            if (text.length > maxLength) {
              return text.slice(0, maxLength) + '...'
            }
            return text
          }
        }
      }
    }
  }

  // Fallback to contentApiData if brief is empty
  return getContentText(contentApiData, maxLength)
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
    brief,
    contentApiData,
  } = post ?? {}

  return {
    id: getUid({ style, id }),
    title,
    href: getHref({ style, id }),
    date: formatPostDate(publishTime),
    summary: getBriefText(brief, contentApiData, 100),
    isReport: isReport(style),
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
