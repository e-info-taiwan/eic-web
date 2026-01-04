import React from 'react'
import styled from 'styled-components'

const LinkWrapper = styled.a`
  display: inline;
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary[40]};
  letter-spacing: 0.01em;
  text-align: justify;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  padding-bottom: 2px;

  &:hover {
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary[0]};
  }
`

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity()
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    )
  }, callback)
}

export const linkDecorator = {
  strategy: findLinkEntities,
  component: Link,
}

function Link(props) {
  const { url } = props.contentState.getEntity(props.entityKey).getData()
  return (
    <LinkWrapper href={url} target="_blank">
      {props.children}
    </LinkWrapper>
  )
}
