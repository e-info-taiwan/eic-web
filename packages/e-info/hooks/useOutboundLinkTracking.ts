import { useEffect } from 'react'

import { SITE_URL } from '~/constants/environment-variables'
import * as gtag from '~/utils/gtag'

/**
 * Hook to track clicks on external links within a container
 * Attaches a delegated click handler to track outbound links
 */
const useOutboundLinkTracking = (
  containerRef: React.RefObject<HTMLElement>,
  enabled = true
) => {
  useEffect(() => {
    if (!enabled || !containerRef.current) return

    const container = containerRef.current

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const link = target.closest('a')

      if (!link) return

      const href = link.getAttribute('href')
      if (!href) return

      // Check if it's an external link
      try {
        const url = new URL(href, window.location.origin)
        const isExternal =
          url.hostname !== window.location.hostname &&
          !url.hostname.includes(SITE_URL) &&
          url.protocol.startsWith('http')

        if (isExternal) {
          const linkText = link.textContent?.trim() || ''
          gtag.sendOutboundClick(href, linkText)
        }
      } catch {
        // Invalid URL, skip tracking
      }
    }

    container.addEventListener('click', handleClick)

    return () => {
      container.removeEventListener('click', handleClick)
    }
  }, [containerRef, enabled])
}

export default useOutboundLinkTracking
