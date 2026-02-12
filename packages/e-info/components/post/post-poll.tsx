import { useQuery } from '@apollo/client/react'
import Lottie from 'lottie-react'
import { forwardRef, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import type { TurnstileWidgetHandle } from '~/components/shared/turnstile-widget'
import TurnstileWidget from '~/components/shared/turnstile-widget'
import AuthContext from '~/contexts/auth-context'
import {
  type PollResult,
  type PollResultCounts,
  pollResultsCounts,
} from '~/graphql/query/poll'
import type { Poll } from '~/graphql/query/post'
import { getIdToken } from '~/lib/firebase/get-id-token'
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

type PollWrapperProps = {
  $hideBorderTop?: boolean
}

const PollWrapper = styled.section<PollWrapperProps>`
  margin-bottom: 52px;
  border-top: ${({ $hideBorderTop, theme }) =>
    $hideBorderTop ? 'none' : `1px solid ${theme.colors.grayscale[40]}`};
  padding-top: ${({ $hideBorderTop }) => ($hideBorderTop ? '0' : '36px')};

  ${({ theme }) => theme.breakpoint.md} {
    padding-top: ${({ $hideBorderTop }) => ($hideBorderTop ? '0' : '52px')};
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

type OptionTextProps = {
  $percentage: number
}

const OptionTextWrapper = styled.span<OptionTextProps>`
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  height: 100%;
  top: 0;
  left: ${(props) => Math.min(props.$percentage, 80)}%;
  padding: 0 8px;
  font-size: 16px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  white-space: nowrap;
  transition: left 0.3s ease;
`

const OptionImage = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  margin-right: 4px;
  flex-shrink: 0;
`

const OptionText = styled.span`
  font-size: 16px;
  line-height: 1;
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

const TurnstileContainer = styled.div`
  margin-top: 16px;
`

type PollOption = {
  key: number
  text: string
  imageUrl: string | null
}

type PostPollProps = {
  poll: Poll
  postId?: string // Post ID (for post pages)
  newsletterId?: string // Newsletter ID (for newsletter pages)
  hideBorderTop?: boolean
  autoVote?: number // Option number to auto-vote (1-5), used for email voting
}

// API call helper for post voting
async function submitPostVote(params: {
  pollId: string
  postId: string
  result: number
  memberId?: string
  firebaseId?: string
  idToken?: string | null
  turnstileToken?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/poll/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    const data = (await response.json()) as {
      success?: boolean
      error?: string
    }
    if (!response.ok || !data.success) {
      return { success: false, error: data.error || 'Vote failed' }
    }
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Vote failed',
    }
  }
}

// API call helper to fetch member's existing vote (protected)
async function fetchMemberVote(params: {
  pollId: string
  memberId: string
  firebaseId: string
  idToken: string | null
}): Promise<{ pollResults: PollResult[] }> {
  try {
    const response = await fetch('/api/poll/member-vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    const data = (await response.json()) as {
      success?: boolean
      pollResults?: PollResult[]
      error?: string
    }
    if (!response.ok || !data.success) {
      console.error('Failed to fetch member vote:', data.error)
      return { pollResults: [] }
    }
    return { pollResults: data.pollResults || [] }
  } catch (error) {
    console.error('Failed to fetch member vote:', error)
    return { pollResults: [] }
  }
}

// API call helper for newsletter voting
async function submitNewsletterVote(params: {
  pollId: string
  result: number
  memberId?: string
  firebaseId?: string
  idToken?: string | null
  turnstileToken?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/poll/newsletter-vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    const data = (await response.json()) as {
      success?: boolean
      error?: string
    }
    if (!response.ok || !data.success) {
      return { success: false, error: data.error || 'Vote failed' }
    }
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Vote failed',
    }
  }
}

const PostPoll = forwardRef<HTMLElement, PostPollProps>(function PostPoll(
  { poll, postId, newsletterId, hideBorderTop = false, autoVote },
  ref
) {
  // Determine if this is for a newsletter or post
  const isNewsletter = !!newsletterId
  const entityId = newsletterId || postId || ''
  const wrapperRef = useRef<HTMLElement>(null)
  const combinedRef = (node: HTMLElement | null) => {
    ;(wrapperRef as React.MutableRefObject<HTMLElement | null>).current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }
  const { member, firebaseUser, loading: authLoading } = useContext(AuthContext)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [voteCounts, setVoteCounts] = useState<PollResultCounts | null>(null)
  const [autoVoteTriggered, setAutoVoteTriggered] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // undefined = not yet obtained, '' = Turnstile disabled, string = valid token
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>(
    undefined
  )
  const turnstileRef = useRef<TurnstileWidgetHandle>(null)

  // Query poll results counts
  const { data: countsData, refetch: refetchCounts } =
    useQuery<PollResultCounts>(pollResultsCounts, {
      variables: { pollId: poll?.id },
      skip: !poll?.id,
      fetchPolicy: 'network-only',
    })

  // Update vote counts when data changes
  useEffect(() => {
    if (countsData) {
      setVoteCounts(countsData)
    }
  }, [countsData])

  // Fetch member's vote via protected API (only for logged-in users)
  useEffect(() => {
    const fetchVote = async () => {
      if (!poll?.id || !member?.id || !firebaseUser?.uid) return

      const idToken = await getIdToken()
      const result = await fetchMemberVote({
        pollId: poll.id,
        memberId: member.id,
        firebaseId: firebaseUser.uid,
        idToken,
      })

      if (result.pollResults?.length) {
        const memberVote = result.pollResults[0]
        setSelectedOption(memberVote.result)
        setHasVoted(true)
      }
    }

    fetchVote()
  }, [poll?.id, member?.id, firebaseUser?.uid])

  // Check anonymous user's vote from localStorage
  useEffect(() => {
    if (!member && poll?.id && entityId) {
      const anonymousVote = hasAnonymousVoted(poll.id, entityId)
      if (anonymousVote !== null) {
        setSelectedOption(anonymousVote)
        setHasVoted(true)
      }
    }
  }, [member, poll?.id, entityId])

  // Auto-vote from email link (when autoVote prop is provided)
  useEffect(() => {
    const performAutoVote = async () => {
      // Only trigger auto-vote if:
      // - autoVote prop is provided (1-5)
      // - User hasn't already voted
      // - Auto-vote hasn't been triggered yet
      // - Auth loading is complete
      // - Poll is active
      if (
        !autoVote ||
        autoVote < 1 ||
        autoVote > 5 ||
        hasVoted ||
        autoVoteTriggered ||
        authLoading ||
        !poll?.id ||
        poll.status !== 'active'
      ) {
        return
      }

      // For anonymous auto-vote, we need Turnstile token (undefined = not yet obtained)
      if (!member && turnstileToken === undefined) {
        return
      }

      setAutoVoteTriggered(true)
      setIsSubmitting(true)

      try {
        let result: { success: boolean; error?: string }

        if (isNewsletter) {
          if (member && firebaseUser) {
            const idToken = await getIdToken()
            result = await submitNewsletterVote({
              pollId: poll.id,
              memberId: member.id,
              firebaseId: firebaseUser.uid,
              idToken,
              result: autoVote,
            })
          } else {
            result = await submitNewsletterVote({
              pollId: poll.id,
              turnstileToken,
              result: autoVote,
            })
            if (result.success) {
              saveAnonymousVote(poll.id, entityId, autoVote)
            }
          }
        } else {
          if (member && firebaseUser) {
            const idToken = await getIdToken()
            result = await submitPostVote({
              pollId: poll.id,
              postId: entityId,
              memberId: member.id,
              firebaseId: firebaseUser.uid,
              idToken,
              result: autoVote,
            })
          } else {
            result = await submitPostVote({
              pollId: poll.id,
              postId: entityId,
              turnstileToken,
              result: autoVote,
            })
            if (result.success) {
              saveAnonymousVote(poll.id, entityId, autoVote)
            }
          }
        }

        if (result.success) {
          const { data } = await refetchCounts()
          if (data) {
            setVoteCounts(data)
          }
          setSelectedOption(autoVote)
          setHasVoted(true)
        } else {
          console.error('Failed to auto-vote:', result.error)
        }
      } catch (error) {
        console.error('Failed to auto-vote:', error)
      } finally {
        setIsSubmitting(false)
      }
    }

    performAutoVote()
  }, [
    autoVote,
    hasVoted,
    autoVoteTriggered,
    authLoading,
    poll?.id,
    poll?.status,
    member,
    firebaseUser,
    entityId,
    isNewsletter,
    turnstileToken,
    refetchCounts,
  ])

  if (!poll || poll.status !== 'active') {
    return null
  }

  // Build options array from poll data
  const options: PollOption[] = []

  if (poll.option1) {
    options.push({
      key: 1,
      text: poll.option1,
      imageUrl: poll.option1Image?.resized?.original || null,
    })
  }
  if (poll.option2) {
    options.push({
      key: 2,
      text: poll.option2,
      imageUrl: poll.option2Image?.resized?.original || null,
    })
  }
  if (poll.option3) {
    options.push({
      key: 3,
      text: poll.option3,
      imageUrl: poll.option3Image?.resized?.original || null,
    })
  }
  if (poll.option4) {
    options.push({
      key: 4,
      text: poll.option4,
      imageUrl: poll.option4Image?.resized?.original || null,
    })
  }
  if (poll.option5) {
    options.push({
      key: 5,
      text: poll.option5,
      imageUrl: poll.option5Image?.resized?.original || null,
    })
  }

  if (options.length === 0) {
    return null
  }

  const isLoggedIn = !!member
  // Allow voting during auth loading (will use anonymous if not logged in)
  // For anonymous users, require Turnstile token (undefined = not yet obtained, '' = disabled)
  const isDisabled =
    authLoading || (!isLoggedIn && turnstileToken === undefined && !hasVoted)

  // Calculate percentage for each option based on vote counts
  const getPercentage = (optionKey: number): number => {
    if (!hasVoted || !voteCounts || voteCounts.total === 0) return 0

    const optionCount =
      voteCounts[`option${optionKey}` as keyof PollResultCounts] || 0
    return Math.round((optionCount / voteCounts.total) * 100)
  }

  const handleOptionClick = async (optionKey: number) => {
    if (hasVoted || isSubmitting || isDisabled) return

    setIsSubmitting(true)

    try {
      let result: { success: boolean; error?: string }

      if (isNewsletter) {
        if (isLoggedIn && member && firebaseUser) {
          const idToken = await getIdToken()
          result = await submitNewsletterVote({
            pollId: poll.id,
            memberId: member.id,
            firebaseId: firebaseUser.uid,
            idToken,
            result: optionKey,
          })
        } else {
          result = await submitNewsletterVote({
            pollId: poll.id,
            turnstileToken,
            result: optionKey,
          })
          if (result.success) {
            saveAnonymousVote(poll.id, entityId, optionKey)
          }
        }
      } else {
        if (isLoggedIn && member && firebaseUser) {
          const idToken = await getIdToken()
          result = await submitPostVote({
            pollId: poll.id,
            postId: entityId,
            memberId: member.id,
            firebaseId: firebaseUser.uid,
            idToken,
            result: optionKey,
          })
        } else {
          result = await submitPostVote({
            pollId: poll.id,
            postId: entityId,
            turnstileToken,
            result: optionKey,
          })
          if (result.success) {
            saveAnonymousVote(poll.id, entityId, optionKey)
          }
        }
      }

      if (result.success) {
        const { data } = await refetchCounts()
        if (data) {
          setVoteCounts(data)
        }
        setSelectedOption(optionKey)
        setHasVoted(true)
      } else {
        console.error('Failed to submit vote:', result.error)
      }
    } catch (error) {
      console.error('Failed to submit vote:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTurnstileVerify = (token: string) => {
    setTurnstileToken(token)
  }

  const handleTurnstileExpire = () => {
    setTurnstileToken(undefined)
    turnstileRef.current?.reset()
  }

  return (
    <PollWrapper ref={combinedRef} $hideBorderTop={hideBorderTop}>
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
                <OptionTextWrapper $percentage={getPercentage(option.key)}>
                  {option.imageUrl && (
                    <OptionImage src={option.imageUrl} alt="" />
                  )}
                  <OptionText>{option.text}</OptionText>
                </OptionTextWrapper>
              </OptionBar>
            </OptionRow>
          ))}
        </OptionList>
      </PollContainer>
      {/* Show Turnstile widget for anonymous users who haven't voted */}
      {!isLoggedIn && !hasVoted && (
        <TurnstileContainer>
          <TurnstileWidget
            ref={turnstileRef}
            onVerify={handleTurnstileVerify}
            onExpire={handleTurnstileExpire}
          />
        </TurnstileContainer>
      )}
    </PollWrapper>
  )
})

export default PostPoll
