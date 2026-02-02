import React from 'react'
import styled from 'styled-components'

const EmailLinkWrapper = styled.a`
  display: inline;
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary[40]};
  letter-spacing: 0.01em;
  text-align: justify;
  color: ${({ theme }) => theme.colors.primary[20]};
  padding-bottom: 2px;

  &:hover {
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary[0]};
  }
`

// Email regex pattern
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g

// Strategy function: scan text for email patterns
function findEmailPatterns(contentBlock, callback, contentState) {
  const text = contentBlock.getText()
  let match

  // Reset regex lastIndex for fresh search
  EMAIL_REGEX.lastIndex = 0

  while ((match = EMAIL_REGEX.exec(text)) !== null) {
    const start = match.index
    const end = start + match[0].length

    // Check if this range already has a LINK entity (avoid double-linking)
    const entityKey = contentBlock.getEntityAt(start)
    if (entityKey) {
      const entity = contentState.getEntity(entityKey)
      if (entity && entity.getType() === 'LINK') {
        // Skip - already a link
        continue
      }
    }

    callback(start, end)
  }
}

// Component: render email as mailto: link
function EmailLink(props) {
  const emailText = props.decoratedText
  return (
    <EmailLinkWrapper href={`mailto:${emailText}`}>
      {props.children}
    </EmailLinkWrapper>
  )
}

export const emailDecorator = {
  strategy: findEmailPatterns,
  component: EmailLink,
}
