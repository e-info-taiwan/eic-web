import React from 'react'
import { DraftEntityInstance } from 'draft-js'
import { Block, Caption } from './embedded-code-block'

export function VideoV2Block(entity: DraftEntityInstance) {
  const { embedMarkup, captionHtml } = entity.getData()

  return (
    <div>
      <Block
        dangerouslySetInnerHTML={{
          __html: embedMarkup,
        }}
      />
      {captionHtml && (
        <Caption dangerouslySetInnerHTML={{ __html: captionHtml }} />
      )}
    </div>
  )
}
