import React from 'react'
import styled from 'styled-components'

const FootnoteLink = styled.a`
  color: ${({ theme }) => theme.colors.primary[40]};
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[20]};
    text-decoration: underline;
  }
`

function findFootnoteEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity()
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'FOOTNOTE'
    )
  }, callback)
}

function Footnote(props) {
  const { number } = props.contentState.getEntity(props.entityKey).getData()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    // Create footnote anchor ID from number (e.g., "註1" -> "footnote-1")
    const footnoteNumber = number.replace(/[^0-9]/g, '')
    const footnoteId = `footnote-${footnoteNumber}`
    const element = document.getElementById(footnoteId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Add highlight effect
      element.classList.add('footnote-highlight')
      setTimeout(() => {
        element.classList.remove('footnote-highlight')
      }, 2000)
    }
  }

  const footnoteNumber = number.replace(/[^0-9]/g, '')

  return (
    <FootnoteLink
      id={`footnote-ref-${footnoteNumber}`}
      href={`#footnote-${footnoteNumber}`}
      onClick={handleClick}
      title={number}
    >
      {props.children}
    </FootnoteLink>
  )
}

export const footnoteDecorator = {
  strategy: findFootnoteEntities,
  component: Footnote,
}
