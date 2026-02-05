import NextLink from 'next/link'
import React from 'react'
import styled from 'styled-components'

import type { PopularSearchKeyword } from '~/graphql/query/section'

const SectionContainer = styled.section`
  background-color: ${({ theme }) => theme.colors.grayscale[100]};
  padding: 20px 20px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 20px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 20px 78px;
  }
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    flex-direction: row;
    justify-content: center;
    gap: 24px;
  }
`

const Title = styled.h2`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  margin: 0;
  white-space: nowrap;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 18px;
  }
`

const TagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;
  row-gap: 12px;
  column-gap: 12px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    column-gap: 16px;
  }
`

const TagItem = styled.li`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.primary[20]};
  color: ${({ theme }) => theme.colors.primary[20]};
  background: transparent;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[20]};
    border-color: ${({ theme }) => theme.colors.primary[20]};
    color: white;
  }

  a {
    display: inline-block;
    padding: 4px 16px;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 16px;

    a {
      padding: 6px 20px;
    }
  }
`

type HotKeywordsSectionProps = {
  keywords?: PopularSearchKeyword[]
}

const HotKeywordsSection: React.FC<HotKeywordsSectionProps> = ({
  keywords = [],
}) => {
  if (keywords.length === 0) {
    return null
  }

  return (
    <SectionContainer>
      <Container>
        <Title>熱搜關鍵字</Title>
        <TagList>
          {keywords.map((item) => (
            <TagItem key={item.rank}>
              <NextLink href={`/search?q=${encodeURIComponent(item.keyword)}`}>
                {item.keyword}
              </NextLink>
            </TagItem>
          ))}
        </TagList>
      </Container>
    </SectionContainer>
  )
}

export default HotKeywordsSection
