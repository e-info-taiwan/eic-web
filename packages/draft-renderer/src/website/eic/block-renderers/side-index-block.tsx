import { ContentBlock, ContentState } from 'draft-js'
import React from 'react'
import styled from 'styled-components'

import { defaultH2Style } from '../shared-style'

const sideIndexDefaultSpacing = 32

const SideIndexBlockWrapper = styled.div`
  margin-top: ${sideIndexDefaultSpacing}px;
  // --header-height is published by the site Header component on mount/resize
  // so the scroll target lands just below the sticky header. Fallback covers
  // SSR / pages without the Header.
  scroll-margin-top: calc(var(--header-height, 80px) + 16px);

  h2 {
    ${defaultH2Style}
    margin: 0;
  }
`

type SideIndexBlockProps = {
  block: ContentBlock
  blockProps: {
    onEditStart: () => void
    onEditFinish: ({
      entityKey,
      entityData,
    }: {
      entityKey?: string
      entityDaZta?: Record<string, unknown>
    }) => void
  }
  contentState: ContentState
}

export function SideIndexBlock(props: SideIndexBlockProps) {
  const { block, contentState } = props
  const entityKey = block.getEntityAt(0)
  if (!entityKey) {
    return <></>
  }
  const entity = contentState.getEntity(entityKey)
  const { h2Text } = entity.getData()
  if (!h2Text) {
    return <></>
  }

  // Compute this block's index among SIDEINDEX blocks in document order.
  // Must match the same Nth-occurrence indexing in
  // utils/post.ts → getSideIndexEntityData, since convertFromRaw remaps
  // entityMap keys to internal identifiers we can't share with raw content.
  const blocks = contentState.getBlocksAsArray()
  let sideIndexNumber = -1
  let counter = 0
  for (const b of blocks) {
    const ek = b.getEntityAt(0)
    if (!ek) continue
    if (contentState.getEntity(ek).getType() !== 'SIDEINDEX') continue
    if (b.getKey() === block.getKey()) {
      sideIndexNumber = counter
      break
    }
    counter++
  }

  return (
    <SideIndexBlockWrapper id={`header-${sideIndexNumber}`}>
      <h2>{h2Text}</h2>
    </SideIndexBlockWrapper>
  )
}
