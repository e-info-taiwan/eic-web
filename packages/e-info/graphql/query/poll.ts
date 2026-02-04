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
