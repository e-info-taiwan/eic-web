import { useMutation, useQuery } from '@apollo/client/react'
import Lottie from 'lottie-react'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import AuthContext from '~/contexts/auth-context'
import {
  type PollResult,
  type PollResultCounts,
  createPollResultAnonymous,
  createPollResultWithMember,
  pollResults,
  pollResultsCounts,
} from '~/graphql/query/poll'
import type { Poll } from '~/graphql/query/post'
import loadingAnimation from '~/public/lottie/loading.json'

// Local storage key for tracking anonymous votes
const POLL_VOTES_STORAGE_KEY = 'eic_poll_votes'

// Get anonymous votes from localStorage
function getAnonymousVotes(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(POLL_VOTES_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

// Save anonymous vote to localStorage
function saveAnonymousVote(pollId: string, postId: string, result: number) {
  if (typeof window === 'undefined') return
  try {
    const votes = getAnonymousVotes()
    votes[`${pollId}_${postId}`] = result
    localStorage.setItem(POLL_VOTES_STORAGE_KEY, JSON.stringify(votes))
  } catch {
    // Ignore localStorage errors
  }
}

// Check if anonymous user has already voted
function hasAnonymousVoted(pollId: string, postId: string): number | null {
  const votes = getAnonymousVotes()
  const key = `${pollId}_${postId}`
  return key in votes ? votes[key] : null
}

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

const PollContainer = styled.div`
  position: relative;
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.64);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`

const LottieWrapper = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  const [voteCounts, setVoteCounts] = useState<PollResultCounts | null>(null)

  // Query poll results counts
  const { data: countsData, refetch: refetchCounts } =
    useQuery<PollResultCounts>(pollResultsCounts, {
      variables: { pollId: poll?.id },
      skip: !poll?.id,
      fetchPolicy: 'network-only',
    })

  // Query member's vote (only for logged-in users)
  const { data: memberVoteData } = useQuery<{ pollResults: PollResult[] }>(
    pollResults,
    {
      variables: { pollId: poll?.id, memberId: member?.id },
      skip: !poll?.id || !member?.id,
      fetchPolicy: 'network-only',
    }
  )

  // Update vote counts when data changes
  useEffect(() => {
    if (countsData) {
      setVoteCounts(countsData)
    }
  }, [countsData])

  // Check if current member has already voted (logged-in user)
  useEffect(() => {
    if (member && memberVoteData?.pollResults?.length) {
      const memberVote = memberVoteData.pollResults[0]
      setSelectedOption(memberVote.result)
      setHasVoted(true)
    }
  }, [memberVoteData, member])

  // Check anonymous user's vote from localStorage
  useEffect(() => {
    if (!member && poll?.id && postId) {
      const anonymousVote = hasAnonymousVoted(poll.id, postId)
      if (anonymousVote !== null) {
        setSelectedOption(anonymousVote)
        setHasVoted(true)
      }
    }
  }, [member, poll?.id, postId])

  // Mutations for logged-in and anonymous users
  const [submitVoteWithMember, { loading: isSubmittingWithMember }] =
    useMutation(createPollResultWithMember)
  const [submitVoteAnonymous, { loading: isSubmittingAnonymous }] = useMutation(
    createPollResultAnonymous
  )
  const isSubmitting = isSubmittingWithMember || isSubmittingAnonymous

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
  // Allow voting during auth loading (will use anonymous if not logged in)
  const isDisabled = authLoading

  // Calculate percentage for each option based on vote counts
  const getPercentage = (optionKey: number): number => {
    if (!hasVoted || !voteCounts || voteCounts.total === 0) return 0

    const optionCount =
      voteCounts[`option${optionKey}` as keyof PollResultCounts] || 0
    return Math.round((optionCount / voteCounts.total) * 100)
  }

  const handleOptionClick = async (optionKey: number) => {
    if (hasVoted || isSubmitting || isDisabled) return

    try {
      // Submit vote to API - use appropriate mutation based on login status
      if (isLoggedIn && member) {
        await submitVoteWithMember({
          variables: {
            pollId: poll.id,
            postId,
            memberId: member.id,
            result: optionKey,
          },
        })
      } else {
        await submitVoteAnonymous({
          variables: {
            pollId: poll.id,
            postId,
            result: optionKey,
          },
        })
        // Save anonymous vote to localStorage to prevent duplicate votes
        saveAnonymousVote(poll.id, postId, optionKey)
      }

      // Refetch counts after voting
      const { data } = await refetchCounts()

      if (data) {
        setVoteCounts(data)
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
      <PollContainer>
        {isSubmitting && (
          <LoadingOverlay>
            <LottieWrapper>
              <Lottie
                animationData={loadingAnimation}
                loop
                style={{ width: 80, height: 80, transform: 'scale(2)' }}
              />
            </LottieWrapper>
          </LoadingOverlay>
        )}
        <OptionList>
          {options.map((option) => (
            <OptionRow
              key={option.key}
              $hasVoted={hasVoted}
              $disabled={isDisabled || isSubmitting}
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
      </PollContainer>
    </PollWrapper>
  )
}
