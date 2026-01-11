import { GenericCategory, GenericTag, ResizedImages } from './common'

export type ArticleCardTag = Pick<GenericTag, 'id' | 'name'>

export type ArticleCard = {
  id: string
  href: string
  title: string
  summary?: string
  images: ResizedImages
  imagesWebP: ResizedImages
  date: string
  isReport: boolean
  tags?: ArticleCardTag[]
}

export type FeaturedArticle = {
  id: string
  href: string
  title: string
  images: ResizedImages
  imagesWebP: ResizedImages
  subtitle: string
  description: string
}

export type CollaborationItem = {
  id: string
  title: string
  description: string
  achvLink: string
  collabLink: string
  images: ResizedImages
  imagesWebP: ResizedImages
  progress: number
  requireTime: number
  endTime: string
}

type Gallery = {
  id: string
  href: string
  images: ResizedImages
}

export type DataSetItem = {
  id: string
  href: string
  title: string
  writerName: string
  galleries: Gallery[]
}

export type NavigationCategory = Pick<GenericCategory, 'id' | 'title' | 'slug'>
