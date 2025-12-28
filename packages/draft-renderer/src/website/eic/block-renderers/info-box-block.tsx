import { ContentBlock, ContentState } from 'draft-js'
import React from 'react'
import styled from 'styled-components'

import {
  defaultH2Style,
  defaultUlStyle,
  defaultUnorderedListStyle,
  defaultOlStyle,
  defaultOrderedListStyle,
  defaultLinkStyle,
  defaultBlockQuoteStyle,
} from '../shared-style'

const infoboxDefaultSpacing = 8

const InfoBoxRenderWrapper = styled.div`
  background: #f0f9f4;
  position: relative;
  padding: 24px 20px;
  width: 100%;
  ${({ theme }) => theme.margin.default};

  ${({ theme }) => theme.breakpoint.md} {
    padding: 24px 32px;
  }
`

const InfoTitle = styled.div`
  width: 100%;
  font-style: normal;
  font-weight: 700;
  ${({ theme }) => theme.fontSize.lg};
  line-height: 1.5;
  letter-spacing: 0.03em;
  color: #2d7a4f;
  padding: 0;
  margin-bottom: 16px;
`

const InfoContent = styled.div`
  padding: 0;
  font-style: normal;
  font-weight: 400;
  ${({ theme }) => theme.fontSize.md};
  line-height: 1.8;
  color: rgba(0, 9, 40, 0.87);

  > div > * + * {
    margin: ${infoboxDefaultSpacing}px 0 0;
    min-height: 0.01px; //to make margins between paragraphs effective
  }

  h2 {
    ${defaultH2Style}
  }

  ul {
    ${defaultUlStyle}
    margin-top: ${infoboxDefaultSpacing}px;

    > li {
      ${defaultUnorderedListStyle}

      & + li {
        margin: ${infoboxDefaultSpacing / 2}px 0 0;
      }
    }
  }

  ol {
    ${defaultOlStyle}
    margin-top: ${infoboxDefaultSpacing}px;

    > li {
      ${defaultOrderedListStyle}

      & + li {
        margin: ${infoboxDefaultSpacing / 2}px 0 0;
      }
    }
  }

  a {
    ${defaultLinkStyle}
  }

  blockquote {
    ${defaultBlockQuoteStyle}
  }
`

type InfoBoxBlockProps = {
  block: ContentBlock
  blockProps: {
    onEditStart: () => void
    onEditFinish: ({
      entityKey,
      entityData,
    }: {
      entityKey?: string
      entityData?: Record<string, unknown>
    }) => void
  }
  contentState: ContentState
}

export function InfoBoxBlock(props: InfoBoxBlockProps) {
  const { block, contentState } = props
  const entityKey = block.getEntityAt(0)
  const entity = contentState.getEntity(entityKey)
  const { title, body } = entity.getData()

  return (
    <InfoBoxRenderWrapper className="infobox-wrapper">
      <InfoTitle className="infobox-title">{title}</InfoTitle>
      <InfoContent className="infobox-content">
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </InfoContent>
    </InfoBoxRenderWrapper>
  )
}
