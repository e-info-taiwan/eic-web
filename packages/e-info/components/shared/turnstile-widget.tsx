import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import styled from 'styled-components'

import { TURNSTILE_SITE_KEY } from '~/constants/environment-variables'

export type TurnstileWidgetHandle = {
  reset: () => void
}

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

const TurnstileWidget = forwardRef<TurnstileWidgetHandle, Props>(
  ({ onVerify, onExpire, onError }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | null>(null)
    // Use refs for callbacks to avoid effect re-runs when parent re-renders
    const onVerifyRef = useRef(onVerify)
    const onExpireRef = useRef(onExpire)
    const onErrorRef = useRef(onError)

    // Keep callback refs in sync
    useEffect(() => {
      onVerifyRef.current = onVerify
      onExpireRef.current = onExpire
      onErrorRef.current = onError
    })

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current)
        }
      },
    }))

    useEffect(() => {
      // Skip if no site key (graceful degradation)
      if (!TURNSTILE_SITE_KEY) {
        onVerifyRef.current('')
        return
      }

      let cancelled = false

      const renderWidget = () => {
        if (cancelled || widgetIdRef.current || !containerRef.current) return
        if (!window.turnstile) return

        const id = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'light',
          callback: (token: string) => onVerifyRef.current(token),
          'expired-callback': () => onExpireRef.current?.(),
          'error-callback': () => onErrorRef.current?.(),
        })
        widgetIdRef.current = id
      }

      if (window.turnstile) {
        renderWidget()
      } else {
        const existingScript = document.querySelector(
          `script[src="${TURNSTILE_SCRIPT_URL}"]`
        )
        if (existingScript) {
          existingScript.addEventListener('load', renderWidget)
        } else {
          const script = document.createElement('script')
          script.src = TURNSTILE_SCRIPT_URL
          script.async = true
          script.addEventListener('load', renderWidget)
          document.head.appendChild(script)
        }
      }

      return () => {
        cancelled = true
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current)
          widgetIdRef.current = null
        }
      }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // If no site key, don't render anything (graceful degradation)
    if (!TURNSTILE_SITE_KEY) {
      return null
    }

    return <TurnstileContainer ref={containerRef} />
  }
)

TurnstileWidget.displayName = 'TurnstileWidget'

export default TurnstileWidget
