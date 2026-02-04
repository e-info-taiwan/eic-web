import { useEffect, useRef, useState } from 'react'

import * as gtag from '~/utils/gtag'

type ReadingProgressOptions = {
  articleId?: string
  articleCategory?: string
  enabled?: boolean
}

/**
 * Hook to track reading progress at 25%, 50%, 75%, and 100% milestones
 * Uses IntersectionObserver with threshold markers
 */
const useReadingProgress = (options: ReadingProgressOptions = {}) => {
  const { articleId, articleCategory, enabled = true } = options
  const containerRef = useRef<HTMLDivElement>(null)
  const [trackedMilestones, setTrackedMilestones] = useState<Set<number>>(
    new Set()
  )

  useEffect(() => {
    if (!enabled || !containerRef.current) return

    const container = containerRef.current
    const milestones = [25, 50, 75, 100] as const

    const handleScroll = () => {
      const rect = container.getBoundingClientRect()
      const containerHeight = container.scrollHeight
      const viewportHeight = window.innerHeight

      // Calculate how much of the content has been scrolled past
      const scrolledPast = Math.max(0, -rect.top + viewportHeight)
      const progress = Math.min(100, (scrolledPast / containerHeight) * 100)

      milestones.forEach((milestone) => {
        if (progress >= milestone && !trackedMilestones.has(milestone)) {
          setTrackedMilestones((prev) => new Set([...prev, milestone]))
          gtag.sendReadingProgress(milestone, articleId, articleCategory)
        }
      })
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [enabled, articleId, articleCategory, trackedMilestones])

  // Reset tracked milestones when article changes
  useEffect(() => {
    setTrackedMilestones(new Set())
  }, [articleId])

  return containerRef
}

export default useReadingProgress
