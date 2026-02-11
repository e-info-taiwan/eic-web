import type { RawDraftContentState } from 'draft-js'

export type GenericImageFile = {
  url: string
}

export type ResizedImages = {
  original?: string
  w480?: string
  w800?: string
  w1200?: string
  w1600?: string
  w2400?: string
}

export type keyOfResizedImages = keyof ResizedImages

export type GenericPhoto = {
  id: string
  name: string
  urlOriginal: string
  resized: ResizedImages | null
  resizedWebp: ResizedImages | null
  imageFile: GenericImageFile | null
}

export type PhotoWithResizedOnly = Pick<GenericPhoto, 'resized' | 'resizedWebp'>

// ref: https://github.com/mirror-media/Lilith/blob/95bb4f8e9b43bd60515e1ba5b9b77d512f880bca/packages/readr/lists/Post.ts#L139
/* eslint-disable no-unused-vars */
export enum ValidPostStyle {
  DEFAULT = 'default',
  EDITOR = 'editor',
}

export enum ValidJobTitles {
  FRONT_END_ENGINEER = 'front-end engineer',
  APP_ENGINEER = 'App engineer',
  FULL_STACK_ENGINEER = 'full-stack engineer',
  BACK_END_ENGINEER = 'back-end engineer',
  EDITOR_IN_CHIEF = 'editor in chief',
  PRODUCT_DESIGNER = 'product designer',
  JOURNALIST = 'journalist',
  SOCIAL_MEDIA_EDITOR = 'social media editor',
  FEATURE_PRODUCER = 'Feature Producer',
  PRODUCT_MANAGER = 'product manager',
}

export enum ValidPostContentType {
  NORMAL = 'normal',
  SUMMARY = 'summary',
  ACTIONLIST = 'actionlist',
  CITATION = 'citation',
}

/* eslint-enable no-unused-vars */

export type GenericAuthor = {
  id: string | number
  name: string
  isMember: boolean
  name_en: string
  title: string
  special_number: string
  number_desc: string
  number_desc_en: string
  postsCount: number
  posts: GenericPost[]
}

export type GenericProject = {
  id: string
  name: string
}

export type GenericPost = {
  id: string
  style: ValidPostStyle
  title: string
  subtitle: string
  heroImage: GenericPhoto | null
  ogImage: GenericPhoto | null
  heroCaption: string
  content: RawDraftContentState // draft-renderer JSON
  brief: RawDraftContentState // draft-renderer JSON (similar to summary)
  contentApiData: RawDraftContentState // draft-renderer JSON
  briefApiData: RawDraftContentState // draft-renderer JSON
  citations: string // 引用來源
  reporters: GenericAuthor[] // 記者
  translators: GenericAuthor[] // 編譯
  reviewers: GenericAuthor[] // 審校
  writers: GenericAuthor[] // 文
  sources: GenericAuthor[] // 稿源
  otherByline: string // 作者（其他）
  section: { id: string; name: string; slug: string } | null
  category: { id: string; name: string; slug: string } | null
  topic: { id: string; title: string } | null
  relatedPosts: GenericPost[]
  publishTime: string
  tags: GenericTag[]
  state: string
}

export type GenericCategory = {
  id: string
  slug: string
  title: string
  posts: GenericPost[]
  reports: GenericPost[]
  ogImage: GenericPhoto | null
  ogDescription: string | null
  updatedAt: string | null
  createdAt: string | null
  sortOrder: number | null
}

export type GenericTag = {
  id: string
  name: string
  state: string
  posts: GenericPost[]
}

export type GenericEditorChoice = {
  id: string
  name: string
  link: string
  heroImage: GenericPhoto | null
  choices: GenericPost | null
}

export type GenericFeature = {
  description: string
  featurePost: GenericPost | null
}

export type GenericQuote = {
  id: string
  name: string
  title: string
  byline: string
}

export type GenericCollaboration = {
  id: string
  title: string
  name: string
  description: string
  progress: number
  achvLink: string
  collabLink: string
  requireTime: number
  endTime: string
  heroImage: GenericPhoto | null
  bannerDesktop: GenericPhoto | null
  bannerTablet: GenericPhoto | null
  bannerMobile: GenericPhoto | null
}

export type GenericGallery = {
  id: string
  link: string
  writer: GenericAuthor[]
  heroImage: GenericPhoto | null
}

export type GenericDataSet = {
  id: string
  name: string
  title: string
  link: string
  gallery: GenericGallery[]
}

// This utility is for overwriting type without extending it
// prettier-ignore
export type Override<T, U extends Partial<Record<keyof T, unknown>>> = Omit<T, keyof U> & U
