import { Eic } from '@eic-web/draft-renderer'
import type { RawDraftContentState } from 'draft-js'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

const SideIndexWrapper = styled.div`
  display: none;
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
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.primary[20] : 'rgba(0, 9, 40, 0.87)'};
  transition: color 0.2s ease;
  display: flex;
  align-items: flex-start;

  &::before {
    content: '•';
    color: ${({ theme }) => theme.colors.primary[20]};
    font-size: 14px;
    margin-right: 8px;
    flex-shrink: 0;
  }

  & + li {
    margin-top: 8px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary[20]};
  }

  > a {
    display: inline;
  }
`

const MobileFab = styled.button`
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.primary[20]};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 900;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[0]};
  }

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const MobilePanel = styled.div`
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: calc(100vw - 32px);
  max-width: 320px;
  max-height: calc(100vh - 120px);
  background: ${({ theme }) => theme.colors.primary[20]};
  color: #fff;
  border-radius: 16px;
  padding: 40px 20px 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  overflow-y: auto;
  z-index: 901;

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const MobileCloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  line-height: 1;
`

const MobileList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`

const MobileListItem = styled.li<StyleProps>`
  display: flex;
  align-items: flex-start;
  font-size: 15px;
  line-height: 1.6;
  color: #fff;
  cursor: pointer;

  &::before {
    content: '•';
    margin-right: 8px;
    flex-shrink: 0;
  }

  & + & {
    margin-top: 12px;
  }

  > a {
    color: inherit;
    text-decoration: ${({ isActive }) => (isActive ? 'underline' : 'none')};
  }
`

const FabIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <rect x="3" y="5" width="3" height="3" rx="0.5" fill="currentColor" />
    <rect x="3" y="10.5" width="3" height="3" rx="0.5" fill="currentColor" />
    <rect x="3" y="16" width="3" height="3" rx="0.5" fill="currentColor" />
    <rect x="8" y="6" width="13" height="1.5" rx="0.75" fill="currentColor" />
    <rect
      x="8"
      y="11.5"
      width="13"
      height="1.5"
      rx="0.75"
      fill="currentColor"
    />
    <rect x="8" y="17" width="13" height="1.5" rx="0.75" fill="currentColor" />
  </svg>
)

type SideIndexItem = {
  title: string
  id: string
  href: string | null
  isActive: boolean
}

type SideIndexProps = {
  rawContentBlock: RawDraftContentState
  currentIndex?: string
}

export default function SideIndex({
  rawContentBlock,
  currentIndex,
}: SideIndexProps): JSX.Element {
  const { getSideIndexEntityData } = Eic
  const sideIndexList = getSideIndexEntityData(rawContentBlock)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false)
  const [siteOrigin, setSiteOrigin] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setSiteOrigin(window.location.origin)
    setIsMounted(true)
  }, [])

  function handleScrollIntoView(target: string) {
    const targetElement = document.getElementById(target)
    targetElement &&
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
  }

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

  const mobileListItems = sideIndexList?.map((list: SideIndexItem) => {
    const { title, id, href } = list
    const isActive = currentIndex === id

    if (href) {
      const linkUrl = new URL(href)
      const target = siteOrigin === linkUrl.origin ? '_self' : '_blank'

      return (
        <MobileListItem key={id} isActive={isActive}>
          <a
            href={href}
            target={target}
            rel="noopener noreferrer"
            onClick={() => setIsMobilePanelOpen(false)}
          >
            {title}
          </a>
        </MobileListItem>
      )
    }
    return (
      <MobileListItem
        key={id}
        isActive={isActive}
        onClick={(e) => {
          e.preventDefault()
          handleScrollIntoView(id)
          setIsMobilePanelOpen(false)
        }}
      >
        <a href={`#${id}`}>{title}</a>
      </MobileListItem>
    )
  })

  const shouldShowSideIndex = Boolean(sideIndexList?.length)

  const mobileFloatingUI = isMobilePanelOpen ? (
    <MobilePanel>
      <MobileCloseButton
        type="button"
        aria-label="關閉索引"
        onClick={() => setIsMobilePanelOpen(false)}
      >
        ×
      </MobileCloseButton>
      <MobileList>{mobileListItems}</MobileList>
    </MobilePanel>
  ) : (
    <MobileFab
      type="button"
      aria-label="開啟索引"
      onClick={() => setIsMobilePanelOpen(true)}
    >
      <FabIcon />
    </MobileFab>
  )

  return (
    <>
      {shouldShowSideIndex && (
        <>
          <SideIndexWrapper>
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
          {isMounted && createPortal(mobileFloatingUI, document.body)}
        </>
      )}
    </>
  )
}
