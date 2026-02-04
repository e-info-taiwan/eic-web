import { faker } from '@faker-js/faker'

import type { GenericCategory } from '../../types/common'

export const Category: () => Partial<GenericCategory> = () => ({
  id: faker.datatype.uuid(),
  slug: faker.lorem.slug(),
  name: faker.random.word(),
  posts: [...new Array(12)],
  postsCount: 12,
  sortOrder: faker.datatype.number({ min: 1, max: 100 }),
})
