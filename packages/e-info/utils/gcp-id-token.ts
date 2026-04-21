// Server-only helper: fetches an ID token from the GCP metadata server so
// Cloud Run can call another Cloud Run service that requires IAM auth.
// Returns null outside GCP (local dev / mock server) — callers must treat
// that as "no Authorization header" and rely on the target being open there.

type Cached = { audience: string; token: string; exp: number }
let cached: Cached | null = null

export async function getIdToken(targetUrl: string): Promise<string | null> {
  if (process.env.NEXT_PUBLIC_ENV === 'local') return null

  let audience: string
  try {
    audience = new URL(targetUrl).origin
  } catch {
    return null
  }

  const now = Date.now()
  if (cached && cached.audience === audience && cached.exp - 60_000 > now) {
    return cached.token
  }

  try {
    const res = await fetch(
      `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=${encodeURIComponent(
        audience
      )}`,
      { headers: { 'Metadata-Flavor': 'Google' } }
    )
    if (!res.ok) return null
    const token = (await res.text()).trim()
    // ID tokens are valid for 1h; refresh before expiry.
    cached = { audience, token, exp: now + 55 * 60 * 1000 }
    return token
  } catch {
    return null
  }
}
