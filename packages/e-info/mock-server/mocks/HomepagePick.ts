import { faker } from '@faker-js/faker'

export const HomepagePick = () => ({
  id: faker.datatype.uuid(),
  customUrl: faker.internet.url(),
  customTitle: faker.lorem.sentence(),
  customDescription: faker.lorem.paragraph(),
  sortOrder: faker.datatype.number({ min: 1, max: 100 }),
  topics: [...new Array(2)],
})
