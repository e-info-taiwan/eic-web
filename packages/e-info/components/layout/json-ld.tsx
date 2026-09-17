import Head from 'next/head'

import { type JsonLdObject, serializeJsonLd } from '~/utils/json-ld'

type JsonLdProps = {
  /** Unique per page so next/head can de-duplicate on navigation */
  id: string
  data: JsonLdObject | JsonLdObject[]
}

/**
 * Renders a schema.org JSON-LD script tag into <head>.
 * Build `data` with the helpers in `~/utils/json-ld`.
 */
export default function JsonLd({ id, data }: JsonLdProps): JSX.Element {
  return (
    <Head>
      <script
        key={`json-ld-${id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
      />
    </Head>
  )
}
