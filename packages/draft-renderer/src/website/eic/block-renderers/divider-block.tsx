import React from 'react'
import styled from 'styled-components'

const Divider = styled.hr`
  box-sizing: border-box;
  border: none;
  border-top: 1px solid #e0e0e0;
  ${({ theme }) => theme.margin.default};
`

export const DividerBlock = () => {
  return <Divider />
}
