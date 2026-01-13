import gql from 'graphql-tag'

export type PollResult = {
  id: string
  result: number
  member: {
    id: string
  } | null
}

// Query poll results for a specific poll and post
export const pollResults = gql`
  query ($pollId: ID!, $postId: ID!) {
    pollResults(
      where: { poll: { id: { equals: $pollId } }, post: { id: { equals: $postId } } }
    ) {
      id
      result
      member {
        id
      }
    }
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
