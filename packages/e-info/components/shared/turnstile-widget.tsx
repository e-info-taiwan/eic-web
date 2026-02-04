import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { TURNSTILE_SITE_KEY } from '~/constants/environment-variables'

type Props = {
  // eslint-disable-next-line no-unused-vars
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
}

const TurnstileContainer = styled.div`
  margin: 16px 0;
`

const TURNSTILE_SCRIPT_URL =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

const TurnstileWidget = ({ onVerify, onExpire, onError }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [widgetId, setWidgetId] = useState<string | null>(null)
  const scriptLoadedRef = useRef(false)

  const renderWidget = useCallback(() => {
    if (containerRef.current && window.turnstile && !widgetId) {
      const id = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: onVerify,
        'expired-callback': onExpire,
        'error-callback': onError,
      })
      setWidgetId(id)
    }
  }, [onVerify, onExpire, onError, widgetId])

  useEffect(() => {
    // Skip if no site key (graceful degradation)
    if (!TURNSTILE_SITE_KEY) {
      // Signal that Turnstile is disabled by passing empty token
      onVerify('')
      return
    }

    // Check if script is already loaded
    if (window.turnstile) {
      renderWidget()
      return
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector(
      `script[src="${TURNSTILE_SCRIPT_URL}"]`
    )
    if (existingScript) {
      existingScript.addEventListener('load', renderWidget)
      return
    }

    // Load Turnstile script
    if (!scriptLoadedRef.current) {
      scriptLoadedRef.current = true
      const script = document.createElement('script')
      script.src = TURNSTILE_SCRIPT_URL
      script.async = true
      script.onload = renderWidget
      document.head.appendChild(script)
    }

    return () => {
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId)
      }
    }
  }, [renderWidget, onVerify, widgetId])

  // If no site key, don't render anything (graceful degradation)
  if (!TURNSTILE_SITE_KEY) {
    return null
  }

  return <TurnstileContainer ref={containerRef} />
}

export default TurnstileWidget
