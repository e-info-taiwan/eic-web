/**
 * Date helpers pinned to Taiwan time.
 *
 * CMS timestamps are UTC instants (e.g. an event created on 12/19 via the
 * submit form is stored as `2026-12-19T00:00:00.000Z`; one entered as 12/19
 * 00:00 in the Keystone admin is `2026-12-18T16:00:00.000Z`). Formatting them
 * with `Date#getDate()` depends on the runtime's timezone (UTC on Cloud Run,
 * the visitor's zone in the browser), so always go through these helpers.
 */

const TAIPEI_TIME_ZONE = 'Asia/Taipei'

const taipeiFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TAIPEI_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

export type TaipeiDateParts = {
  year: string
  /** 2-digit, `01`–`12` */
  month: string
  /** 2-digit, `01`–`31` */
  day: string
  /** 2-digit, `00`–`23` */
  hour: string
  /** 2-digit, `00`–`59` */
  minute: string
}

/** Wall-clock parts in Taiwan, or null for empty / unparsable input */
export function getTaipeiParts(
  input?: string | Date | null
): TaipeiDateParts | null {
  if (!input) return null
  const date = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(date.getTime())) return null

  const parts = Object.fromEntries(
    taipeiFormatter.formatToParts(date).map((p) => [p.type, p.value])
  )
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
  }
}

/** Calendar date in Taiwan as ISO 8601 `YYYY-MM-DD` (for schema.org dates) */
export function toTaipeiISODate(input?: string | Date | null): string {
  const p = getTaipeiParts(input)
  return p ? `${p.year}-${p.month}-${p.day}` : ''
}

/** Month in Taiwan as `YYYY-MM` */
export function toTaipeiMonth(input?: string | Date | null): string {
  const p = getTaipeiParts(input)
  return p ? `${p.year}-${p.month}` : ''
}

/** Calendar date in Taiwan as `yyyy年mm月dd日` */
export function formatTaipeiDate(input?: string | Date | null): string {
  const p = getTaipeiParts(input)
  return p ? `${p.year}年${p.month}月${p.day}日` : ''
}

/** Year and month (1–12) in Taiwan; defaults to now */
export function getTaipeiYearMonth(input: string | Date = new Date()): {
  year: number
  month: number
} {
  const p = getTaipeiParts(input) ?? getTaipeiParts(new Date())
  return { year: Number(p?.year), month: Number(p?.month) }
}

// Taiwan has had no DST since 1979, so a fixed offset is exact
const TAIPEI_OFFSET_MS = 8 * 60 * 60 * 1000

/**
 * UTC ISO bounds of a Taiwan calendar month, for GraphQL range filters.
 * e.g. (2026, 12) → 2026-11-30T16:00:00.000Z … 2026-12-31T15:59:59.999Z
 */
export function taipeiMonthRange(
  year: number,
  month: number
): { startDate: string; endDate: string } {
  const start = Date.UTC(year, month - 1, 1) - TAIPEI_OFFSET_MS
  const nextMonthStart = Date.UTC(year, month, 1) - TAIPEI_OFFSET_MS
  return {
    startDate: new Date(start).toISOString(),
    endDate: new Date(nextMonthStart - 1).toISOString(),
  }
}
