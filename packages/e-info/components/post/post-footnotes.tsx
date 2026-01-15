import { useState } from 'react'
import styled from 'styled-components'

// Footnote data type extracted from Draft.js content
export type FootnoteData = {
  number: string // e.g., "註1"
  name: string // Footnote title
  bodyHTML: string // HTML content
}

type FootnoteItemProps = {
  $isExpanded: boolean
}

const FootnotesContainer = styled.div`
  margin-top: 28px;
  margin-bottom: 28px;
`

const FootnoteItem = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`

const FootnoteHeader = styled.button<FootnoteItemProps>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: 4px;
`

const FootnoteNumber = styled.span`
  color: ${({ theme }) => theme.colors.primary[40]};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  flex-shrink: 0;
`

const FootnoteTitle = styled.span`
  color: ${({ theme }) => theme.colors.primary[40]};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  text-decoration: underline;
  // flex: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[20]};
  }
`

const ArrowIconWrapper = styled.span<FootnoteItemProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 15px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
  transform: ${({ $isExpanded }) => ($isExpanded ? 'scaleY(1)' : 'scaleY(-1)')};
  margin-left: 16px;
`

const ArrowIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <ArrowIconWrapper $isExpanded={isExpanded}>
    <svg
      width="20"
      height="15"
      viewBox="0 0 20 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 4.51361L4.30466 10L3 8.7432L10 2L17 8.7432L15.6953 10L10 4.51361Z"
        fill="#388A48"
      />
      <path d="M3 12H17V13H3V12Z" fill="#388A48" />
    </svg>
  </ArrowIconWrapper>
)

const FootnoteBody = styled.div<FootnoteItemProps>`
  display: ${({ $isExpanded }) => ($isExpanded ? 'block' : 'none')};
  background-color: ${({ theme }) => theme.colors.grayscale[99]};
  padding: 20px 28px;
  margin-top: 12px;
  border-radius: 2px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.grayscale[40]};

  ${({ theme }) => theme.breakpoint.md} {
    padding: 20px 28px;
  }

  p {
    margin: 0 0 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  a {
    color: ${({ theme }) => theme.colors.primary[40]};
    text-decoration: underline;

    &:hover {
      color: ${({ theme }) => theme.colors.primary[20]};
    }
  }

  strong {
    font-weight: 700;
  }

  em {
    font-style: italic;
  }

  /* Highlight animation when scrolled to */
  &.footnote-highlight {
    animation: highlight-pulse 2s ease-out;
  }

  @keyframes highlight-pulse {
    0% {
      background-color: ${({ theme }) => theme.colors.primary[80]};
    }
    100% {
      background-color: ${({ theme }) => theme.colors.grayscale[95]};
    }
  }
`

type FootnoteRowProps = {
  footnote: FootnoteData
  defaultExpanded?: boolean
}

function FootnoteRow({ footnote, defaultExpanded = false }: FootnoteRowProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const footnoteNumber = footnote.number.replace(/[^0-9]/g, '')
  const footnoteId = `footnote-${footnoteNumber}`

  return (
    <FootnoteItem id={footnoteId}>
      <FootnoteHeader
        $isExpanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`${footnoteId}-content`}
      >
        <FootnoteNumber>{footnote.number}</FootnoteNumber>
        <FootnoteTitle>{footnote.name}</FootnoteTitle>
        <ArrowIcon isExpanded={isExpanded} />
      </FootnoteHeader>
      <FootnoteBody
        id={`${footnoteId}-content`}
        $isExpanded={isExpanded}
        dangerouslySetInnerHTML={{ __html: footnote.bodyHTML }}
      />
    </FootnoteItem>
  )
}

type PostFootnotesProps = {
  footnotes: FootnoteData[]
}

export default function PostFootnotes({ footnotes }: PostFootnotesProps) {
  if (!footnotes || footnotes.length === 0) {
    return null
  }

  return (
    <FootnotesContainer>
      {footnotes.map((footnote, index) => (
        <FootnoteRow key={`${footnote.number}-${index}`} footnote={footnote} />
      ))}
    </FootnotesContainer>
  )
}

/**
 * Extract footnotes from Draft.js content
 * @param content - Draft.js RawDraftContentState or similar object with entityMap
 * @returns Array of FootnoteData
 */
// Entity type from Draft.js content
type DraftEntity = {
  type: string
  data?: {
    number?: string
    name?: string
    bodyHTML?: string
  }
}

export function extractFootnotesFromContent(
  content: { entityMap?: Record<string, DraftEntity> } | null | undefined
): FootnoteData[] {
  if (!content?.entityMap) {
    return []
  }

  const footnotes: FootnoteData[] = []

  Object.values(content.entityMap).forEach((entity) => {
    if (entity?.type === 'FOOTNOTE' && entity?.data) {
      footnotes.push({
        number: entity.data.number || '',
        name: entity.data.name || '',
        bodyHTML: entity.data.bodyHTML || '',
      })
    }
  })

  // Sort by number
  footnotes.sort((a, b) => {
    const numA = parseInt(a.number.replace(/[^0-9]/g, ''), 10) || 0
    const numB = parseInt(b.number.replace(/[^0-9]/g, ''), 10) || 0
    return numA - numB
  })

  return footnotes
}
