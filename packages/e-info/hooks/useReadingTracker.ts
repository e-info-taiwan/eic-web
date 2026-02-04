import { useEffect, useRef } from 'react'

import { useAuth } from '~/hooks/useAuth'
import { recordReadingHistory } from '~/lib/graphql/reading-history'

/**
 * Hook to track reading history for logged-in members
 *
 * Records reading history when:
 * 1. User is logged in (has a member record)
 * 2. User stays on the page for at least 3 seconds (to filter out accidental clicks)
 *
 * If a reading history already exists for the same member+post combination,
 * it updates the timestamp instead of creating a duplicate.
 *
 * @param postId - The ID of the post being viewed
 */
export function useReadingTracker(postId: string | undefined): void {
  const { member, firebaseUser } = useAuth()
  const hasRecorded = useRef(false)

  useEffect(() => {
    // Reset recorded flag when post changes
    hasRecorded.current = false
  }, [postId])

  useEffect(() => {
    // Don't track if no member, no firebaseUser, or no postId
    if (!member?.id || !firebaseUser?.uid || !postId) {
      return
    }

    // Don't record again if already recorded for this post
    if (hasRecorded.current) {
      return
    }

    // Wait 3 seconds before recording to ensure user is actually reading
    const timer = setTimeout(async () => {
      try {
        await recordReadingHistory(member.id, postId, firebaseUser.uid)
        hasRecorded.current = true
      } catch (err) {
        // Silently fail - reading history is not critical
        console.error('Failed to record reading history:', err)
      }
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [member?.id, firebaseUser?.uid, postId])
}
