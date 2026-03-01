import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

const STORAGE_PREFIX = '__scroll_'

export function useScrollRestoration() {
  const router = useRouter()
  const isPopStateRef = useRef(false)
  const restoreTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    // Take manual control of scroll restoration from the browser
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    // Clean up any pending restore timers
    const clearRestoreTimers = () => {
      restoreTimersRef.current.forEach(clearTimeout)
      restoreTimersRef.current = []
    }

    // Detect back/forward navigation (fires before Next.js router events)
    const onPopState = () => {
      isPopStateRef.current = true
    }

    // Save current scroll position before leaving the page
    const onRouteChangeStart = () => {
      clearRestoreTimers()
      const key = `${STORAGE_PREFIX}${router.asPath}`
      try {
        sessionStorage.setItem(key, String(window.scrollY))
      } catch {
        // sessionStorage may be full or unavailable
      }
    }

    // Restore scroll position after page render (only for back/forward)
    const onRouteChangeComplete = (url: string) => {
      if (isPopStateRef.current) {
        const key = `${STORAGE_PREFIX}${url}`
        const saved = sessionStorage.getItem(key)

        if (saved !== null) {
          const targetY = parseInt(saved, 10)

          // Schedule multiple restore attempts to handle progressive layout shifts
          // (images loading, styled-components hydrating, etc.)
          const delays = [0, 100, 300]
          for (const delay of delays) {
            const timer = setTimeout(() => {
              window.scrollTo(0, targetY)
            }, delay)
            restoreTimersRef.current.push(timer)
          }
        }
      }

      isPopStateRef.current = false
    }

    // popstate must be registered before router events to set flag in time
    window.addEventListener('popstate', onPopState)
    router.events.on('routeChangeStart', onRouteChangeStart)
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      clearRestoreTimers()
      window.removeEventListener('popstate', onPopState)
      router.events.off('routeChangeStart', onRouteChangeStart)
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router])
}
