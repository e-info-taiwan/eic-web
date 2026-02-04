import { faker } from '@faker-js/faker'

export const Section = () => ({
  id: faker.datatype.uuid(),
  slug: faker.lorem.slug(),
  name: faker.lorem.words(2),
  style: faker.helpers.arrayElement(['default', 'special']),
  description: faker.lorem.paragraph(),
  showInHeader: faker.datatype.boolean(),
  sortOrder: faker.datatype.number({ min: 1, max: 100 }),
  categories: [...new Array(5)],
  posts: [...new Array(10)],
})
