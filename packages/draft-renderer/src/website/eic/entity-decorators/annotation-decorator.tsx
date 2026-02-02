import React, { useState } from 'react'
import styled from 'styled-components'

import {
  defaultH2Style,
  defaultLinkStyle,
  defaultOlStyle,
  defaultOrderedListStyle,
  defaultUlStyle,
  defaultUnorderedListStyle,
  defaultBlockQuoteStyle,
} from '../shared-style'

const annotationDefaultSpacing = 8

const AnnotationText = styled.span`
  ${defaultLinkStyle};
`

const AnnotationWrapper = styled.span`
  display: inline-block;
  cursor: pointer;

  &:hover ${AnnotationText} {
    border-bottom: 2px solid #04295e;
  }
`

const AnnotationBody = styled.div`
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colors.grayscale[95]};
  padding: 20px 24px;
  margin: 12px 0 28px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  display: inline-block;
  text-align: left;
  width: 100%;
  color: ${({ theme }) => theme.colors.grayscale[20]};

  ${({ theme }) => theme.breakpoint.md} {
    padding: 20px;
  }

  > * + * {
    margin: ${annotationDefaultSpacing}px 0 0;
    min-height: 0.01px; //to make margins between paragraphs effective
  }

  h2 {
    ${defaultH2Style}
  }

  ul {
    ${defaultUlStyle}
    margin-top: ${annotationDefaultSpacing}px;

    > li {
      ${defaultUnorderedListStyle}
    }
  }

  ol {
    ${defaultOlStyle}
    margin-top: ${annotationDefaultSpacing}px;

    > li {
      ${defaultOrderedListStyle}
    }
  }

  a {
    ${defaultLinkStyle}
  }

  blockquote {
    ${defaultBlockQuoteStyle}
  }
`

type ArrowIconWrapperProps = {
  $showContent: boolean
}

const ArrowIconWrapper = styled.span<ArrowIconWrapperProps>`
  width: 20px;
  height: 20px;
  margin: auto 4px;
  transition: transform 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: text-top;
  background-color: ${({ theme }) => theme.colors.secondary[80]};
  border-radius: 10px;
  transform: ${(props) => (props.$showContent ? 'rotate(-180deg)' : '')};
`

const ArrowIcon = ({ showContent }: { showContent: boolean }) => (
  <ArrowIconWrapper $showContent={showContent}>
    <svg
      width="11"
      height="9"
      viewBox="0 0 11 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.19617 9L1.60456e-05 -9.78799e-07L10.3923 -7.02746e-08L5.19617 9Z"
        fill="#388A48"
      />
    </svg>
  </ArrowIconWrapper>
)

function AnnotationBlock(props) {
  const { children: annotated } = props
  const [showContent, setShowContent] = useState(false)
  /**
   * to support k5 old annotation data, check if annotation key exist
   * k5
   * {
   *    text: string,
   *     annotation: html string,
   *     draftRawObj: DraftBlocks
   * }
   * k6
   * {
   *   bodyHTML: string,
   *   bodyEscapedHTML: string,
   *   rawContentState: DraftBlocks
   * }
   */
  const { bodyHTML, annotation } = props.contentState
    .getEntity(props.entityKey)
    .getData()
  const annotationBodyHtml = bodyHTML || annotation.trim()
  return (
    <React.Fragment>
      <AnnotationWrapper
        onClick={(e) => {
          e.preventDefault()
          setShowContent(!showContent)
        }}
      >
        <AnnotationText className="text">{annotated}</AnnotationText>
        <ArrowIcon showContent={showContent} />
      </AnnotationWrapper>
      {showContent ? (
        <AnnotationBody
          contentEditable={false}
          dangerouslySetInnerHTML={{ __html: annotationBodyHtml }}
        ></AnnotationBody>
      ) : null}
    </React.Fragment>
  )
}

function findAnnotationEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity()
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'ANNOTATION'
    )
  }, callback)
}

export const annotationDecorator = {
  strategy: findAnnotationEntities,
  component: AnnotationBlock,
}
