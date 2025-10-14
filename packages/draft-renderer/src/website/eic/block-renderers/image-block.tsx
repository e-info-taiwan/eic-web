import { ContentBlock, ContentState } from 'draft-js'
import React from 'react'
import styled from 'styled-components'
import CustomImage from '@readr-media/react-image'
import defaultImage from '../assets/default-og-img.png'

const Figure = styled.figure`
  width: 100%;
  ${({ theme }) => theme.margin.default};
`

const FigureCaption = styled.figcaption`
  width: 100%;
  font-size: 12px;
  line-height: 1.25;
  text-align: justify;
  color: #373740;
  padding: 0;
  margin: 8px 0 0;

  ${({ theme }) => theme.breakpoint.xl} {
    line-height: 1.25;
  }
`
const Anchor = styled.a`
  text-decoration: none;
`

type ImageBlockProps = {
  block: ContentBlock
  contentState: ContentState
}

export function ImageBlock(props: ImageBlockProps) {
  const { block, contentState } = props
  const entityKey = block.getEntityAt(0)

  const entity = contentState.getEntity(entityKey)
  const { desc, name, resized = {}, resizedWebp = {}, url, src } = entity.getData()

  // Check if resized images exist, otherwise fallback to src
  const hasResizedImages = resized && Object.keys(resized).length > 0
  const imagesToUse = hasResizedImages ? resized : (src ? { original: src } : {})
  const webpImagesToUse = resizedWebp && Object.keys(resizedWebp).length > 0 ? resizedWebp : {}

  let imgBlock = (
    <Figure>
      <CustomImage
        images={imagesToUse}
        imagesWebP={webpImagesToUse}
        defaultImage={defaultImage}
        alt={name || desc}
        rwd={{
          mobile: '100vw',
          tablet: '608px',
          desktop: '640px',
          default: '100%',
        }}
        priority={true}
      />
      <FigureCaption>{desc}</FigureCaption>
    </Figure>
  )

  if (url) {
    imgBlock = (
      <Anchor href={url} target="_blank">
        {imgBlock}
      </Anchor>
    )
  }

  return imgBlock
}
