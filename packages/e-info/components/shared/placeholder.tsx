import React from 'react'
import styled from 'styled-components'

interface PlaceholderProps {
  height?: string | number
  className?: string
  children?: React.ReactNode
}

const PlaceholderContainer = styled.div<{ height: string | number }>`
  width: 100%;
  height: ${({ height }) =>
    typeof height === 'number' ? `${height}px` : height};
  background-color: #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Placeholder: React.FC<PlaceholderProps> = ({
  height = '200px',
  className,
  children,
}) => {
  return (
    <PlaceholderContainer height={height} className={className}>
      {children}
    </PlaceholderContainer>
  )
}

export default Placeholder
