/**
 * JSON-LD (schema.org) builders.
 *
 * Pure functions that return plain objects; render them with
 * `components/layout/json-ld.tsx`. All URLs must be absolute — use
 * SITE_ORIGIN (https://www.e-info.org.tw), not SITE_URL (bare host).
 */

import { SITE_ORIGIN } from '~/constants/config'
import { SITE_TITLE } from '~/constants/constant'
import { SOCIAL_LINKS } from '~/constants/social'
import type { Author } from '~/graphql/fragments/author'
import type { PostDetail } from '~/graphql/query/post'

export type JsonLdObject = Record<string, unknown>

const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`
const WEBSITE_ID = `${SITE_ORIGIN}/#website`
const LOGO_URL = `${SITE_ORIGIN}/eic-logo.svg`

export const absoluteUrl = (path: string): string =>
  path.startsWith('http') ? path : `${SITE_ORIGIN}${path}`

/** Site-wide publisher entity; referenced by articles via @id */
export function buildOrganization(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    '@id': ORGANIZATION_ID,
    name: SITE_TITLE,
    url: `${SITE_ORIGIN}/`,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
    },
    sameAs: Object.values(SOCIAL_LINKS),
  }
}

/** Site-wide WebSite entity with sitelinks search box action */
export function buildWebSite(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_TITLE,
    url: `${SITE_ORIGIN}/`,
    publisher: { '@id': ORGANIZATION_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_ORIGIN}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export type BreadcrumbItem = {
  name: string
  /** Site-relative path (e.g. `/section/news`) or absolute URL. Omit for the current page. */
  path?: string
}

export function buildBreadcrumb(items: BreadcrumbItem[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  }
}

const toPerson = (author: Author) => ({
  '@type': 'Person',
  name: author.name,
  url: `${SITE_ORIGIN}/author/${author.id}`,
})

/** Credited authors: reporters, writers, stringers (CMS input order preferred) */
function pickAuthors(post: PostDetail): Author[] {
  const pick = (ordered?: Author[] | null, fallback?: Author[] | null) =>
    ordered?.length ? ordered : fallback ?? []

  const authors = [
    ...pick(post.reportersInInputOrder, post.reporters),
    ...pick(post.writersInInputOrder, post.writers),
    ...pick(post.stringersInInputOrder, post.stringers),
  ]

  // De-duplicate by id while preserving order
  const seen = new Set<string>()
  return authors.filter((a) => {
    const id = String(a?.id ?? '')
    if (!id || seen.has(id)) return false
    seen.add(id)
    return true
  })
}

type NewsArticleInput = {
  post: PostDetail
  /** Site-relative path of the article, e.g. `/node/238646` */
  path: string
  description?: string
}

export function buildNewsArticle({
  post,
  path,
  description,
}: NewsArticleInput): JsonLdObject {
  const url = absoluteUrl(path)
  const images = [
    post.heroImage?.resized?.w1600,
    post.heroImage?.resized?.w1200,
    post.heroImage?.resized?.original,
    post.ogImage?.resized?.original,
  ].filter((u): u is string => Boolean(u))

  const authors = pickAuthors(post).map(toPerson)
  const keywords = (post.tags ?? []).map((t) => t.name).filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    headline: post.title,
    ...(description ? { description } : {}),
    ...(images.length ? { image: Array.from(new Set(images)) } : {}),
    datePublished: post.publishTime,
    dateModified: post.updatedAt ?? post.publishTime,
    ...(authors.length
      ? { author: authors }
      : post.otherByline
      ? { author: { '@type': 'Person', name: post.otherByline } }
      : {}),
    publisher: { '@id': ORGANIZATION_ID },
    ...(post.section?.name ? { articleSection: post.section.name } : {}),
    ...(keywords.length ? { keywords } : {}),
    inLanguage: 'zh-TW',
    isAccessibleForFree: true,
  }
}

export function buildArticleBreadcrumb(
  post: PostDetail,
  path: string
): JsonLdObject {
  const items: BreadcrumbItem[] = [{ name: '首頁', path: '/' }]
  if (post.section) {
    items.push({
      name: post.section.name,
      path: `/section/${post.section.slug}`,
    })
  }
  const category = post.categories?.[0]
  if (category) {
    items.push({ name: category.name, path: `/category/${category.id}` })
  }
  items.push({ name: post.title, path })
  return buildBreadcrumb(items)
}

/**
 * Serialize for a <script type="application/ld+json"> body.
 * Escapes `<` so a `</script>` inside a string can't break out of the tag.
 */
export function serializeJsonLd(data: JsonLdObject | JsonLdObject[]): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
