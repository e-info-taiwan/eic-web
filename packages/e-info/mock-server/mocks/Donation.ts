import { faker } from '@faker-js/faker'

export const Donation = () => ({
  id: faker.datatype.uuid(),
  name: faker.lorem.words(2),
  donationType: faker.helpers.arrayElement(['monthly', 'single']),
  title: faker.lorem.sentence(),
  subtitle: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  state: 'published',
  donationUrl: faker.internet.url(),
})
