import { useMutation, useQuery } from '@apollo/client'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import AuthContext from '~/contexts/auth-context'
import {
  type PollResult,
  createPollResult,
  pollResults,
} from '~/graphql/query/poll'
import type { Poll } from '~/graphql/query/post'

const PollWrapper = styled.section`
  margin-bottom: 48px;
  border-top: 1px solid ${({ theme }) => theme.colors.grayscale[40]};
  padding-top: 36px;

  ${({ theme }) => theme.breakpoint.md} {
    padding-top: 52px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: 60px;
  }
`

const PollTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[20]};
  margin-bottom: 16px;
`

const PollContent = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  margin-bottom: 24px;
`

const OptionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

type OptionRowProps = {
  $hasVoted: boolean
  $disabled: boolean
}

const OptionRow = styled.li<OptionRowProps>`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: ${({ $hasVoted, $disabled }) =>
    $hasVoted || $disabled ? 'default' : 'pointer'};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`

type RadioProps = {
  $isSelected: boolean
}

const RadioCircle = styled.span<RadioProps>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.grayscale[40]};
  background-color: ${({ theme }) => theme.colors.grayscale[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.primary[40] : 'transparent'};
  }
`

const OptionBar = styled.div`
  position: relative;
  flex: 1;
  height: 25px;
  background-color: ${({ theme }) => theme.colors.grayscale[95]};
  border-radius: 4px;
  overflow: hidden;
`

type BarFillProps = {
  $percentage: number
}

const BarFill = styled.div<BarFillProps>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${(props) => props.$percentage}%;
  background-color: ${({ theme }) => theme.colors.primary[80]};
  transition: width 0.3s ease;
`

const OptionText = styled.span`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 9px;
  font-size: 16px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.grayscale[0]};
`

const LoginPrompt = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  margin-top: 12px;
`

type PollOption = {
  key: number
  text: string
}

type PostPollProps = {
  poll: Poll
  postId: string
}

export default function PostPoll({
  poll,
  postId,
}: PostPollProps): JSX.Element | null {
  const { member, loading: authLoading } = useContext(AuthContext)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [voteResults, setVoteResults] = useState<PollResult[]>([])

  // Query existing poll results
  const { data: resultsData, refetch: refetchResults } = useQuery<{
    pollResults: PollResult[]
  }>(pollResults, {
    variables: { pollId: poll?.id, postId },
    skip: !poll?.id || !postId,
    fetchPolicy: 'network-only',
  })

  // Check if current member has already voted
  useEffect(() => {
    if (resultsData?.pollResults && member) {
      const memberVote = resultsData.pollResults.find(
        (r) => r.member?.id === member.id
      )
      if (memberVote) {
        setSelectedOption(memberVote.result)
        setHasVoted(true)
        setVoteResults(resultsData.pollResults)
      }
    }
  }, [resultsData, member])

  // Mutation to create poll result
  const [submitVote, { loading: isSubmitting }] = useMutation(createPollResult)

  if (!poll || poll.status !== 'active') {
    return null
  }

  // Build options array from poll data
  const options: PollOption[] = []

  if (poll.option1) {
    options.push({ key: 1, text: poll.option1 })
  }
  if (poll.option2) {
    options.push({ key: 2, text: poll.option2 })
  }
  if (poll.option3) {
    options.push({ key: 3, text: poll.option3 })
  }
  if (poll.option4) {
    options.push({ key: 4, text: poll.option4 })
  }
  if (poll.option5) {
    options.push({ key: 5, text: poll.option5 })
  }

  if (options.length === 0) {
    return null
  }

  const isLoggedIn = !!member
  const isDisabled = !isLoggedIn || authLoading

  // Calculate percentage for each option based on vote results
  const getPercentage = (optionKey: number): number => {
    if (!hasVoted || voteResults.length === 0) return 0

    const totalVotes = voteResults.length
    const optionVotes = voteResults.filter((r) => r.result === optionKey).length
    return Math.round((optionVotes / totalVotes) * 100)
  }

  const handleOptionClick = async (optionKey: number) => {
    if (hasVoted || isSubmitting || isDisabled) return

    try {
      // Submit vote to API
      await submitVote({
        variables: {
          pollId: poll.id,
          postId,
          memberId: member!.id,
          result: optionKey,
        },
      })

      // Refetch results after voting
      const { data } = await refetchResults()

      if (data?.pollResults) {
        setVoteResults(data.pollResults)
      }

      setSelectedOption(optionKey)
      setHasVoted(true)
    } catch (error) {
      console.error('Failed to submit vote:', error)
    }
  }

  return (
    <PollWrapper>
      <PollTitle>心情互動</PollTitle>
      {poll.content && <PollContent>{poll.content}</PollContent>}
      <OptionList>
        {options.map((option) => (
          <OptionRow
            key={option.key}
            $hasVoted={hasVoted}
            $disabled={isDisabled}
            onClick={() => handleOptionClick(option.key)}
          >
            <RadioCircle $isSelected={selectedOption === option.key} />
            <OptionBar>
              <BarFill $percentage={getPercentage(option.key)} />
              <OptionText>{option.text}</OptionText>
            </OptionBar>
          </OptionRow>
        ))}
      </OptionList>
      {!isLoggedIn && !authLoading && (
        <LoginPrompt>請登入後參與投票</LoginPrompt>
      )}
    </PollWrapper>
  )
}
