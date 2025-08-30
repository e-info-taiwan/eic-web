import React from 'react'
import styled from 'styled-components'

import Placeholder from './placeholder'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0;
  width: 100%;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    flex-direction: row;
    padding: 0 40px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 76px 156px 0 156px;
  }
`

const Text = styled.span`
  font-weight: 400;
  font-size: 48px;
  color: #000;
`

const AdContent: React.FC = () => {
  return (
    <Container>
      <Placeholder height={200}>
        <Text>廣告</Text>
      </Placeholder>
      <Placeholder height={200}>
        <Text>廣告</Text>
      </Placeholder>
    </Container>
  )
}

export default AdContent
