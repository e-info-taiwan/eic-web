import Head from 'next/head'

import { SITE_ORIGIN } from '~/constants/config'
import { SITE_TITLE } from '~/constants/constant'
import { buildOrganization, buildWebSite } from '~/utils/json-ld'

import JsonLd from './json-ld'

// Evaluated once at server startup — changes per deployment
const DEPLOY_CACHE_BUSTER = Date.now()

type OGProperties = {
  locale?: 'zh_TW'
  url: string
  title: string
  type: 'website' | 'article'
  description: string
  site_name: string
  image: {
    type: string
    url: string
    width: string
    height: string
  } | null
  author?: string
  section?: string
  modified_time?: string
  published_time?: string
  tags?: string[]
  card: 'summary_large_image'
}

const OpenGraph = ({ properties }: { properties: OGProperties }) => {
  const {
    locale,
    url,
    site_name,
    title,
    type,
    description,
    image,
    card,
    published_time,
    modified_time,
    section,
    tags,
  } = properties

  return (
    <>
      <meta property="og:locale" content={locale || 'zh_TW'} key="og:locale" />
      <meta property="og:url" content={url} key="og:url" />
      <meta property="og:title" content={title} key="og:title" />
      <meta property="og:type" content={type} key="og:type" />
      <meta
        property="og:description"
        content={description || ''}
        key="og:description"
      />
      <meta property="og:site_name" content={site_name} key="og:site_name" />
      {image && (
        <>
          <meta property="og:image" content={image.url} key="og:image" />
          <meta
            property="og:image:secure_url"
            content={image.url.replace('http://', 'https://')}
            key="og:image:secure_url"
          />
          <meta
            property="og:image:width"
            content={image.width}
            key="og:image:width"
          />
          <meta
            property="og:image:height"
            content={image.height}
            key="og:image:height"
          />
          <meta
            property="og:image:type"
            content={image.type}
            key="og:image:type"
          />
          <meta name="twitter:image" content={image.url} key="twitter:image" />
        </>
      )}
      {type === 'article' && (
        <>
          {published_time && (
            <meta
              property="article:published_time"
              content={published_time}
              key="article:published_time"
            />
          )}
          {modified_time && (
            <meta
              property="article:modified_time"
              content={modified_time}
              key="article:modified_time"
            />
          )}
          {section && (
            <meta
              property="article:section"
              content={section}
              key="article:section"
            />
          )}
          {tags?.map((tag) => (
            <meta
              property="article:tag"
              content={tag}
              key={`article:tag:${tag}`}
            />
          ))}
        </>
      )}
      <meta name="twitter:card" content={card} key="twitter:card" />
      <meta name="twitter:url" content={url} key="twitter:url" />
      <meta name="twitter:title" content={title} key="twitter:title" />
      <meta
        name="twitter:description"
        content={description || ''}
        key="twitter:description"
      />
    </>
  )
}

type HeadProps = {
  title?: string
  description?: string
  imageUrl?: string
  /** Site-relative path (e.g. `/node/123`) used for canonical + og:url. Defaults to site root. */
  path?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
}

export default function CustomHead(props: HeadProps): JSX.Element {
  const canonicalUrl = props.path
    ? `${SITE_ORIGIN}${props.path}`
    : `${SITE_ORIGIN}/`

  const siteInformation: OGProperties = {
    title: props.title ?? SITE_TITLE,
    description:
      props.description ??
      '「環境資訊中心」由自然保育與環境資訊基金會（前身為社團法人台灣環境資訊協會）所經營。我們相信，任何改變行動都源自於「知道身邊發生什麼事」開始，唯有資訊公開、普及，並透過社會大眾參與，方能促進人與自然和諧，臻至永續發展。',
    site_name: SITE_TITLE,
    url: canonicalUrl,
    type: props.type ?? 'website',
    published_time: props.publishedTime,
    modified_time: props.modifiedTime,
    section: props.section,
    tags: props.tags,
    image: {
      width: '1200',
      height: '630',
      type: 'images/jpeg',
      url: props.imageUrl ?? `${SITE_ORIGIN}/og.jpg?v=${DEPLOY_CACHE_BUSTER}`,
    },
    card: 'summary_large_image',
  }

  return (
    <>
      <Head>
        <title key="title">{siteInformation.title}</title>
        <meta
          name="description"
          content={siteInformation.description}
          key="description"
        />
        <link rel="canonical" href={canonicalUrl} key="canonical" />
        <OpenGraph properties={siteInformation} />
        <meta name="application-name" content={siteInformation.title} />
      </Head>
      {/* Site-wide entities; articles reference the organization via @id */}
      <JsonLd id="site" data={[buildOrganization(), buildWebSite()]} />
    </>
  )
}
