import { faker } from '@faker-js/faker'

import type { GenericTag } from '../../types/common'

export const Tag: () => Partial<GenericTag> = () => ({
  id: faker.datatype.uuid(),
  name: faker.lorem.word(),
  brief: faker.lorem.sentence(),
  isFeatured: faker.datatype.boolean(),
  sortOrder: faker.datatype.number({ min: 1, max: 100 }),
  posts: [...new Array(5)],
  topics: [...new Array(2)],
})
