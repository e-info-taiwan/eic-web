// 這裡管理固定數值

import { ValidPostStyle } from '~/types/common'
import type { NavigationCategory } from '~/types/component'

const SITE_TITLE = '環境資訊中心'
const DEFAULT_POST_IMAGE_PATH = '/post-default.png'
const DEFAULT_NEWS_IMAGE_PATH = '/news-default.jpg'
const DEFAULT_CATEGORY: NavigationCategory = {
  id: 'all',
  title: '不分類',
  slug: 'all',
}

const POST_STYLES: string[] = [
  // New API styles
  ValidPostStyle.DEFAULT,
  ValidPostStyle.EDITOR,
  // Legacy styles
  ValidPostStyle.NEWS,
  ValidPostStyle.FRAME,
  ValidPostStyle.BLANK,
  ValidPostStyle.SCROLLABLE_VIDEO,
]
const REPORT_STYLES: string[] = [
  ValidPostStyle.EMBEDDED,
  ValidPostStyle.PROJECT3,
  ValidPostStyle.REPORT,
]

const DEFAULT_HEADER_CATEGORY_LIST = [
  {
    id: '1',
    slug: 'breakingnews',
    title: '時事',
    posts: [],
    ogDescription: '',
    ogImage: null,
    sortOrder: null,
    updatedAt: null,
    createdAt: null,
  },
  {
    id: '2',
    slug: 'education',
    title: '教育',
    posts: [],
    ogDescription: '',
    ogImage: null,
    sortOrder: null,
    updatedAt: null,
    createdAt: null,
  },
  {
    id: '3',
    slug: 'politics',
    title: '政治',
    posts: [],
    ogDescription: '',
    ogImage: null,
    sortOrder: null,
    updatedAt: null,
    createdAt: null,
  },
  {
    id: '4',
    slug: 'humanrights',
    title: '人權',
    posts: [],
    ogDescription: '',
    ogImage: null,
    sortOrder: null,
    updatedAt: null,
    createdAt: null,
  },
  {
    id: '5',
    slug: 'environment',
    title: '環境',
    posts: [],
    ogDescription: '',
    ogImage: null,
    sortOrder: null,
    updatedAt: null,
    createdAt: null,
  },
  {
    id: '6',
    slug: 'omt',
    title: '新鮮事',
    posts: [],
    ogDescription: '',
    ogImage: null,
    sortOrder: null,
    updatedAt: null,
    createdAt: null,
  },
]

export {
  DEFAULT_CATEGORY,
  DEFAULT_HEADER_CATEGORY_LIST,
  DEFAULT_NEWS_IMAGE_PATH,
  DEFAULT_POST_IMAGE_PATH,
  POST_STYLES,
  REPORT_STYLES,
  SITE_TITLE,
}
