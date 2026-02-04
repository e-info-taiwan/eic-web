import { faker } from '@faker-js/faker'
import type { IMockStore, Ref } from '@graphql-tools/mock'
import type { IResolvers } from '@graphql-tools/utils'

/*eslint-disable-next-line no-unused-vars */
export const resolvers: (store: IMockStore) => Partial<IResolvers> = (
  store
) => ({
  // resolver for queries
  Query: {
    posts(_, { skip = 0, take }) {
      const list = store.get('Query', 'ROOT', 'posts') as Ref[]
      if (take) {
        return list.slice(skip, skip + take)
      }
      return list
    },
    categories(_, { skip = 0, take }) {
      const list = store.get('Query', 'ROOT', 'categories') as Ref[]
      if (take) {
        return list.slice(skip, skip + take)
      }
      return list
    },
    sections(_, { skip = 0, take }) {
      const list = store.get('Query', 'ROOT', 'sections') as Ref[]
      if (take) {
        return list.slice(skip, skip + take)
      }
      return list
    },
    topics(_, { skip = 0, take }) {
      const list = store.get('Query', 'ROOT', 'topics') as Ref[]
      if (take) {
        return list.slice(skip, skip + take)
      }
      return list
    },
    tags(_, { skip = 0, take }) {
      const list = store.get('Query', 'ROOT', 'tags') as Ref[]
      if (take) {
        return list.slice(skip, skip + take)
      }
      return list
    },
    homepagePicks(_, { skip = 0, take }) {
      const list = store.get('Query', 'ROOT', 'homepagePicks') as Ref[]
      if (take) {
        return list.slice(skip, skip + take)
      }
      return list
    },
    authors(_, { skip = 0, take }) {
      const list = store.get('Query', 'ROOT', 'authors') as Ref[]
      if (take) {
        return list.slice(skip, skip + take)
      }
      return list
    },
  },
  // resolver for nested queries
  Category: {
    posts(_, { take }) {
      if (take) {
        const list = store.get('Category', 'ROOT', 'posts') as Ref[]
        const length = Math.floor(faker.datatype.number({ min: 0, max: take }))
        return faker.helpers.arrayElements(list, length)
      }
      return store.get('Category', 'ROOT', 'posts')
    },
  },
  Section: {
    categories(_, { take }) {
      if (take) {
        const list = store.get('Section', 'ROOT', 'categories') as Ref[]
        const length = Math.floor(faker.datatype.number({ min: 0, max: take }))
        return faker.helpers.arrayElements(list, length)
      }
      return store.get('Section', 'ROOT', 'categories')
    },
  },
  Topic: {
    posts(_, { take }) {
      if (take) {
        const list = store.get('Topic', 'ROOT', 'posts') as Ref[]
        const length = Math.floor(faker.datatype.number({ min: 0, max: take }))
        return faker.helpers.arrayElements(list, length)
      }
      return store.get('Topic', 'ROOT', 'posts')
    },
  },
})
