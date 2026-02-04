import { faker } from '@faker-js/faker'

export const Topic = () => ({
  id: faker.datatype.uuid(),
  title: faker.lorem.sentence(),
  status: 'published',
  content: faker.lorem.paragraph(),
  posts: [...new Array(10)],
  postsCount: 10,
  tags: [...new Array(3)],
  tagsCount: 3,
  isPinned: faker.datatype.boolean(),
  sortOrder: faker.datatype.number({ min: 1, max: 100 }),
})
