import { faker } from '@faker-js/faker'

import type { GenericPhoto } from '../../types/common'

export const Photo: () => Partial<GenericPhoto> = () => ({
  id: faker.datatype.uuid(),
  name: faker.lorem.words(3),
  description: faker.lorem.sentence(),
})
