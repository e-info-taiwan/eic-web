import { faker } from '@faker-js/faker'

export const Topic = () => ({
  id: faker.datatype.uuid(),
  title: faker.lorem.sentence(),
  status: 'published',
  content: {
    blocks: [
      {
        key: faker.random.alphaNumeric(5),
        text: faker.lorem.paragraph(),
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  },
  posts: [...new Array(10)],
  postsCount: 10,
  tags: [...new Array(3)],
  tagsCount: 3,
  isPinned: faker.datatype.boolean(),
  sortOrder: faker.datatype.number({ min: 1, max: 100 }),
})
