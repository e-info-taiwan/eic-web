import gql from 'graphql-tag'

export type PollResult = {
  id: string
  result: number
  member: {
    id: string
  } | null
}

export type PollResultCounts = {
  total: number
  option1: number
  option2: number
  option3: number
  option4: number
  option5: number
}

// Query poll results for checking member's vote
export const pollResults = gql`
  query ($pollId: ID!, $memberId: ID!) {
    pollResults(
      where: {
        poll: { id: { equals: $pollId } }
        member: { id: { equals: $memberId } }
      }
    ) {
      id
      result
      member {
        id
      }
    }
  }
`

// Query poll results count for each option
export const pollResultsCounts = gql`
  query ($pollId: ID!) {
    total: pollResultsCount(where: { poll: { id: { equals: $pollId } } })
    option1: pollResultsCount(
      where: { poll: { id: { equals: $pollId } }, result: { equals: 1 } }
    )
    option2: pollResultsCount(
      where: { poll: { id: { equals: $pollId } }, result: { equals: 2 } }
    )
    option3: pollResultsCount(
      where: { poll: { id: { equals: $pollId } }, result: { equals: 3 } }
    )
    option4: pollResultsCount(
      where: { poll: { id: { equals: $pollId } }, result: { equals: 4 } }
    )
    option5: pollResultsCount(
      where: { poll: { id: { equals: $pollId } }, result: { equals: 5 } }
    )
  }
`

// Create a new poll result (vote) for logged-in users
export const createPollResultWithMember = gql`
  mutation ($pollId: ID!, $postId: ID!, $memberId: ID!, $result: Int!) {
    createPollResult(
      data: {
        poll: { connect: { id: $pollId } }
        post: { connect: { id: $postId } }
        member: { connect: { id: $memberId } }
        result: $result
      }
    ) {
      id
      result
    }
  }
`

// Create a new poll result (vote) for anonymous users
export const createPollResultAnonymous = gql`
  mutation ($pollId: ID!, $postId: ID!, $result: Int!) {
    createPollResult(
      data: {
        poll: { connect: { id: $pollId } }
        post: { connect: { id: $postId } }
        result: $result
      }
    ) {
      id
      result
    }
  }
`

// Create a new poll result (vote) for newsletter - logged-in users
export const createNewsletterPollResultWithMember = gql`
  mutation ($pollId: ID!, $newsletterId: ID!, $memberId: ID!, $result: Int!) {
    createPollResult(
      data: {
        poll: { connect: { id: $pollId } }
        newsletter: { connect: { id: $newsletterId } }
        member: { connect: { id: $memberId } }
        result: $result
      }
    ) {
      id
      result
    }
  }
`

// Create a new poll result (vote) for newsletter - anonymous users
export const createNewsletterPollResultAnonymous = gql`
  mutation ($pollId: ID!, $newsletterId: ID!, $result: Int!) {
    createPollResult(
      data: {
        poll: { connect: { id: $pollId } }
        newsletter: { connect: { id: $newsletterId } }
        result: $result
      }
    ) {
      id
      result
    }
  }
`
