// Cloudflare Turnstile server-side verification
// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

import { TURNSTILE_SECRET_KEY } from '~/constants/config'

const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify'

type TurnstileVerifyResponse = {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
}

type VerifyResult = {
  success: boolean
  error?: string
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<VerifyResult> {
  // Graceful degradation: if no secret key, skip verification
  if (!TURNSTILE_SECRET_KEY) {
    return { success: true }
  }

  // If token is empty but secret key exists, reject
  // (empty token means Turnstile was disabled on frontend but enabled on backend)
  if (!token) {
    return { success: false, error: 'Missing Turnstile token' }
  }

  try {
    const formData = new URLSearchParams()
    formData.append('secret', TURNSTILE_SECRET_KEY)
    formData.append('response', token)
    if (remoteIp) {
      formData.append('remoteip', remoteIp)
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: formData,
    })

    const result = (await response.json()) as TurnstileVerifyResponse

    if (result.success) {
      return { success: true }
    } else {
      return {
        success: false,
        error: result['error-codes']?.join(', ') || 'Verification failed',
      }
    }
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return { success: false, error: 'Verification request failed' }
  }
}

// Helper to get client IP from Next.js request
export function getClientIp(
  headers: Record<string, string | string[] | undefined>,
  socketRemoteAddress?: string
): string | undefined {
  const forwardedFor = headers['x-forwarded-for']
  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0].trim()
  }
  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0]
  }
  return socketRemoteAddress
}
