import { createHash } from 'crypto'

/**
 * Generate Gravatar URL from email
 * @param email - User's email address
 * @param size - Image size in pixels (default: 150)
 * @param defaultImage - Default image if no Gravatar found (default: 'mp' for mystery person)
 * @returns Gravatar URL
 */
export const getGravatarUrl = (
  email: string | null | undefined,
  size: number = 150,
  defaultImage:
    | 'mp'
    | 'identicon'
    | 'monsterid'
    | 'wavatar'
    | 'retro'
    | 'robohash'
    | 'blank' = 'mp'
): string => {
  if (!email) {
    return `https://www.gravatar.com/avatar/?d=${defaultImage}&s=${size}`
  }

  const trimmedEmail = email.trim().toLowerCase()
  const hash = createHash('md5').update(trimmedEmail).digest('hex')

  return `https://www.gravatar.com/avatar/${hash}?d=${defaultImage}&s=${size}`
}
