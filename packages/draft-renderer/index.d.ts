import type { RawDraftContentState } from 'draft-js'
import type { FC, ReactElement } from 'react'

export interface DraftRendererProps {
  rawContentBlock: RawDraftContentState
  contentType?: string
  disabledImageLazyLoad?: boolean
}

export interface EicModule {
  DraftRenderer: FC<DraftRendererProps>
  blockRenderers: any
  entityDecorators: any
  hasContentInRawContentBlock: (rawContentBlock: RawDraftContentState) => boolean
  removeEmptyContentBlock: (rawContentBlock: RawDraftContentState) => RawDraftContentState
  getSideIndexEntityData: (rawContentBlock: RawDraftContentState) => any[]
  insertRecommendInContentBlock: (rawContentBlock: RawDraftContentState, index: number, recommend: any) => RawDraftContentState
  getFirstBlockEntityType: (rawContentBlock: RawDraftContentState) => string
}

export const Eic: EicModule

export const ENTITY: {
  [key: string]: string
}

export const BLOCK_ALIGNMENT: {
  [key: string]: string
}
