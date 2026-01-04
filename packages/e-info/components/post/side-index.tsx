import { Eic } from '@eic-web/draft-renderer'
import type { RawDraftContentState } from 'draft-js'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

type WrapperProps = {
  isAside: boolean
  shouldShowSideIndex: boolean
}

const SideIndexWrapper = styled.div<WrapperProps>`
  display: ${(props) => (props.isAside ? 'none' : 'block')};
  margin-top: 24px;

  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
  }
`

type TitleProps = {
  isExpanded: boolean
}

const Title = styled.button<TitleProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  padding: 0;
  width: 100%;
  cursor: pointer;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[20]};
  background: transparent;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[40]};
  }
`

const Arrow = styled.span<TitleProps>`
  display: inline-flex;
  transition: transform 0.2s ease;
  transform: ${(props) => (props.isExpanded ? 'rotate(180deg)' : 'rotate(0)')};

  &::before {
    content: '▼';
    font-size: 12px;
  }
`

type ListWrapperProps = {
  isExpanded: boolean
}

const ListWrapper = styled.div<ListWrapperProps>`
  display: ${(props) => (props.isExpanded ? 'block' : 'none')};
  padding: 12px 0;
`
type StyleProps = {
  isActive?: boolean
}

const SideIndexListItem = styled.li<StyleProps>`
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  cursor: pointer;
  color: ${(props) => (props.isActive ? '#2d7a4f' : 'rgba(0, 9, 40, 0.87)')};
  transition: color 0.2s ease;
  display: flex;
  align-items: flex-start;

  &::before {
    content: '•';
    color: #2d7a4f;
    font-size: 14px;
    margin-right: 8px;
    flex-shrink: 0;
  }

  & + li {
    margin-top: 8px;
  }

  &:hover {
    color: #2d7a4f;
  }

  > a {
    display: inline;
  }
`

type SideIndexItem = {
  title: string
  id: string
  href: string | null
  isActive: boolean
}

type SideIndexProps = {
  rawContentBlock: RawDraftContentState
  currentIndex?: string
  isAside: boolean
}

export default function SideIndex({
  rawContentBlock,
  currentIndex,
  isAside = false,
}: SideIndexProps): JSX.Element {
  const { getSideIndexEntityData } = Eic
  const sideIndexList = getSideIndexEntityData(rawContentBlock)
  const [isExpanded, setIsExpanded] = useState(false)

  function handleScrollIntoView(target: string) {
    const targetElement = document.querySelector(`#${target}`)
    targetElement &&
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
  }

  const [siteOrigin, setSiteOrigin] = useState('')

  useEffect(() => {
    setSiteOrigin(window.location.origin)
  }, [])

  const sideIndexLists = sideIndexList?.map((list: SideIndexItem) => {
    const { title, id, href } = list

    if (href) {
      //If origin of href is the same as the origin of the current website, not need to open in a new tab
      const linkUrl = new URL(href)
      const target = siteOrigin === linkUrl.origin ? '_self' : '_blank'

      return (
        <SideIndexListItem key={id} isActive={currentIndex === id}>
          <a href={href} target={target} rel="noopener noreferrer">
            {title}
          </a>
        </SideIndexListItem>
      )
    } else {
      return (
        <SideIndexListItem
          key={id}
          isActive={currentIndex === id}
          onClick={(e) => {
            e.preventDefault()
            handleScrollIntoView(id)
          }}
        >
          <a href={`#${id}`}>{title}</a>
        </SideIndexListItem>
      )
    }
  })

  const shouldShowSideIndex = Boolean(sideIndexList?.length)

  return (
    <>
      {shouldShowSideIndex && (
        <SideIndexWrapper
          isAside={isAside}
          shouldShowSideIndex={shouldShowSideIndex}
        >
          <Title
            isExpanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            索引
            <Arrow isExpanded={isExpanded} />
          </Title>
          <ListWrapper isExpanded={isExpanded}>
            <ul>{sideIndexLists}</ul>
          </ListWrapper>
        </SideIndexWrapper>
      )}
    </>
  )
}
