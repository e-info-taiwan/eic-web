import { faker } from '@faker-js/faker'

import type { GenericPost } from '../../types/common'
import { ValidPostStyle } from '../../types/common'

export const Post: () => Partial<GenericPost> = () => ({
  id: faker.datatype.uuid(),
  title: faker.lorem.sentence(),
  subtitle: faker.lorem.sentence(),
  style: faker.helpers.arrayElement(Object.values(ValidPostStyle)),
  state: 'published',
  publishTime: faker.date.past().toISOString(),
  heroCaption: faker.lorem.sentence(),
  citations: faker.lorem.paragraph(),
  otherByline: faker.name.fullName(),
})
