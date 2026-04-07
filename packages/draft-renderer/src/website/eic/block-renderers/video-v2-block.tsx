import React from 'react'
import { DraftEntityInstance } from 'draft-js'
import styled from 'styled-components'
import { Block } from './embedded-code-block'

const Figure = styled.figure`
  width: 100%;
  ${({ theme }) => theme.margin.default};

  ${Block} {
    margin: 0;
  }
`

const FigureCaption = styled.figcaption`
  width: 100%;
  font-size: 12px;
  line-height: 1.25;
  text-align: justify;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  padding: 0;
  margin: 8px 0 0;

  ${({ theme }) => theme.breakpoint.xl} {
    line-height: 1.25;
  }

  a {
    color: ${({ theme }) => theme.colors.primary[20]};
    text-decoration: underline;
  }
`

export function VideoV2Block(entity: DraftEntityInstance) {
  const { embedMarkup, captionHtml } = entity.getData()

  return (
    <Figure>
      <Block
        dangerouslySetInnerHTML={{
          __html: embedMarkup,
        }}
      />
      {captionHtml && (
        <FigureCaption dangerouslySetInnerHTML={{ __html: captionHtml }} />
      )}
    </Figure>
  )
}
