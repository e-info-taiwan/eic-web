// Server-only helper: fetches an ID token so Cloud Run can call another
// Cloud Run service that requires IAM auth.
// - On GCP: reads from the metadata server.
// - Local dev: shells out to `gcloud auth print-identity-token` so the dev
//   server can hit IAM-locked CMS GraphQL endpoints with the developer's
//   own identity (must have run.invoker on the target service).
// Returns null on failure — callers treat that as "no Authorization header".

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

type Cached = { audience: string; token: string; exp: number }
let cached: Cached | null = null

async function fetchFromGcloud(audience: string): Promise<string | null> {
  // User accounts can't mint audience-bound ID tokens directly, so we
  // impersonate a service account that has run.invoker on the target.
  // Set GCP_IMPERSONATE_SA in .env.local to the SA email the developer
  // has iam.serviceAccountTokenCreator on (typically the Cloud Run
  // runtime SA so the local dev server behaves the same as prod).
  const impersonate = process.env.GCP_IMPERSONATE_SA
  if (!impersonate) return null
  try {
    const { stdout } = await execFileAsync('gcloud', [
      'auth',
      'print-identity-token',
      `--impersonate-service-account=${impersonate}`,
      `--audiences=${audience}`,
    ])
    return stdout.trim() || null
  } catch {
    return null
  }
}

async function fetchFromMetadata(audience: string): Promise<string | null> {
  try {
    const res = await fetch(
      `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=${encodeURIComponent(
        audience
      )}`,
      { headers: { 'Metadata-Flavor': 'Google' } }
    )
    if (!res.ok) return null
    return (await res.text()).trim() || null
  } catch {
    return null
  }
}

export async function getIdToken(targetUrl: string): Promise<string | null> {
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

  // On Cloud Run, K_SERVICE is always set. Use that as the "am I on GCP?"
  // signal instead of NEXT_PUBLIC_ENV, which is undefined for local dev.
  const onGcp = Boolean(process.env.K_SERVICE)
  const token = onGcp
    ? await fetchFromMetadata(audience)
    : await fetchFromGcloud(audience)

  if (!token) return null

  // ID tokens are valid for 1h; refresh before expiry.
  cached = { audience, token, exp: now + 55 * 60 * 1000 }
  return token
}
