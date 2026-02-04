import type { IMocks } from '@graphql-tools/mock'

import { Author } from './Author'
import { Category } from './Category'
import { DateTime } from './DateTime'
import { Donation } from './Donation'
import { HomepagePick } from './HomepagePick'
import { Photo } from './Photo'
import { Post } from './Post'
import { Query } from './Query'
import { ResizedImages } from './ResizedImage'
import { Section } from './Section'
import { Tag } from './Tag'
import { Topic } from './Topic'

export const mocks: IMocks = {
  DateTime,
  ResizedImages,
  Author,
  Category,
  Donation,
  HomepagePick,
  Photo,
  Post,
  Query,
  Section,
  Tag,
  Topic,
}
