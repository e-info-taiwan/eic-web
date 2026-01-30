import Lottie from 'lottie-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import NewsletterModal from '~/components/shared/newsletter-modal'
import { useHeaderData } from '~/contexts/header-context'
import type { HeaderNavSection } from '~/graphql/query/section'
import { useAuth } from '~/hooks/useAuth'
import { getMemberDisplayName } from '~/lib/graphql/member'
import LogoEIC from '~/public/eic-logo.svg'
import IconCancel from '~/public/icons/cancel.svg'
import IconFacebook from '~/public/icons/facebook.svg'
import IconHamburger from '~/public/icons/hamburger.svg'
import IconInstagram from '~/public/icons/instagram.svg'
import IconLeftArrow from '~/public/icons/left-arrow.svg'
import IconMail from '~/public/icons/mail.svg'
import IconMember from '~/public/icons/member.svg'
import IconSearch from '~/public/icons/search.svg'
import loadingAnimation from '~/public/lottie/loading.json'
// Styled Components
const HeaderContainer = styled.header<{ $isHidden?: boolean }>`
  background-color: ${({ theme }) => theme.colors.grayscale[100]};
  position: sticky;
  top: 0;
  z-index: 100;
  transform: ${({ $isHidden }) =>
    $isHidden ? 'translateY(-100%)' : 'translateY(0)'};
  transition: transform 0.3s ease-in-out;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 12px 30px 12px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 35px 44px 20px 44px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 35px 32px 0px 40px;
  }
`

const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  gap: 12px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
  }
`

const Logo = styled.div`
  display: flex;
  align-items: center;

  /* Set max width for mobile and tablet devices */
  @media (max-width: ${({ theme }) => theme.mediaSize.xl - 1}px) {
    max-width: 150px;

    svg {
      max-width: 100%;
      height: auto;
    }
  }
`

const LogoRightWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: space-between;
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5px;

  ${({ theme }) => theme.breakpoint.md} {
    gap: 0.75rem;
  }
`

const SearchButton = styled(Link)`
  width: 32px;
  height: 32px;
  background-color: ${({ theme }) => theme.colors.primary[20]};
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[20]};
  }

  /* Hide on mobile devices */
  @media (max-width: ${({ theme }) => theme.mediaSize.md - 1}px) {
    display: none;
  }
`

const LoginButton = styled.button`
  white-space: nowrap;
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.primary[40]};
  color: ${({ theme }) => theme.colors.primary[40]};
  padding: 5.5px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[40]};
    color: white;
  }
`

const LogoutButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary[20]};
  border: 1px solid ${({ theme }) => theme.colors.primary[20]};
  color: ${({ theme }) => theme.colors.primary[95]};
  padding: 2.5px 4px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.25;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[0]};
    border-color: ${({ theme }) => theme.colors.primary[0]};
  }

  ${({ theme }) => theme.breakpoint.md} {
    padding: 1.5px 12px;
    font-size: 14px;
    font-weight: 500;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 5.5px 12px;
  }
`

const UserInfo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0;
  color: ${({ theme }) => theme.colors.primary[20]};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  text-decoration: none;
  cursor: pointer;

  svg {
    width: 28px;
    height: 23px;

    > path {
      fill: ${({ theme }) => theme.colors.primary[20]};
    }
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary[0]};

    svg > path {
      fill: ${({ theme }) => theme.colors.primary[0]};
    }
  }

  ${({ theme }) => theme.breakpoint.xl} {
    gap: 12px;
    font-size: 18px;
    font-weight: 500;

    svg {
      height: 32px;
    }
  }
`

const UserName = styled.span`
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    max-width: 150px;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`

const ActionButton = styled.a`
  background: none;
  border: none;
  padding: 0;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  cursor: pointer;
  transition: color 0.3s ease;
  white-space: nowrap;
  font-family: inherit;
  text-decoration: none;

  /* Mobile menu styling */
  @media (max-width: ${({ theme }) => theme.mediaSize.xl - 1}px) {
    font-size: 16px;
    font-weight: 500;
    border-bottom: none;
    border-top: none;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary[40]};
  }
`

const NavigationSection = styled.div<{ isOpen: boolean }>`
  /* Mobile/Tablet full-page menu overlay */
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.grayscale[95]};
  flex-direction: column;
  z-index: 10000;
  padding: 72px 48px;
  overflow-y: auto;

  /* Hide on desktop */
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    display: none;
  }
`

const DesktopNavWrapper = styled.div`
  display: none;

  /* Show only on desktop */
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
`

const NavigationMenu = styled.nav`
  display: flex;
  gap: 0;
  min-width: max-content;
`

const NavItem = styled.a`
  position: relative;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  text-decoration: none;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.3s ease;
  white-space: nowrap;
  border-top: 3px solid transparent;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[40]};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary[40]};
  }

  &.featured {
    color: ${({ theme }) => theme.colors.secondary[20]};

    &:hover {
      color: ${({ theme }) => theme.colors.secondary[0]};
    }

    &.active {
      color: ${({ theme }) => theme.colors.secondary[20]};
      border-bottom-color: ${({ theme }) => theme.colors.secondary[20]};
    }
  }

  /* Mobile menu styling */
  @media (max-width: ${({ theme }) => theme.mediaSize.xl - 1}px) {
    font-size: 20px;
    font-weight: 500;
    line-height: 2;
    border-bottom: none;
    border-top: none;
    /* Mobile: section names use primary 40 */
    color: ${({ theme }) => theme.colors.primary[40]};

    &:hover {
      color: ${({ theme }) => theme.colors.primary[20]};
    }

    &.highlighted {
      font-weight: 500;
    }
  }

  /* Desktop: featured tags use primary 40 */
  &.featured-tag {
    color: ${({ theme }) => theme.colors.primary[40]};

    &:hover {
      color: ${({ theme }) => theme.colors.primary[20]};
    }

    /* Mobile: featured tags use grayscale 40 */
    @media (max-width: ${({ theme }) => theme.mediaSize.xl - 1}px) {
      color: ${({ theme }) => theme.colors.grayscale[40]};

      &:hover {
        color: ${({ theme }) => theme.colors.grayscale[20]};
      }
    }
  }

  &.highlighted {
    color: ${({ theme }) => theme.colors.primary[40]};

    &:hover {
      color: ${({ theme }) => theme.colors.primary[20]};
    }
  }
`

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  /* Show on mobile and tablet (< xl) */
  @media (max-width: ${({ theme }) => theme.mediaSize.xl - 1}px) {
    display: flex;
  }
`

const NewsBar = styled.div`
  background: ${({ theme }) => theme.colors.primary[80]};
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-height: 44px;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;

  /* Marquee effect for mobile and tablet devices */
  @media (max-width: ${({ theme }) => theme.mediaSize.xl - 1}px) {
    white-space: nowrap;
  }
`

const NewsLabel = styled.span`
  font-weight: 700;
  margin-right: 10px;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.mediaSize.xl - 1}px) {
    margin-right: 8px;
  }
`

type NewsContentProps = {
  $isActive?: boolean
  $isLeaving?: boolean
}

const NewsContent = styled.a<NewsContentProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: inherit;
  padding: 10px 0;

  /* Desktop: vertical slide animation (old exits up, new enters from below) */
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    position: absolute;
    left: 50%;
    white-space: nowrap;
    opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
    transform: ${({ $isActive, $isLeaving }) => {
      if ($isActive) return 'translateX(-50%) translateY(0)'
      if ($isLeaving) return 'translateX(-50%) translateY(-100%)'
      return 'translateX(-50%) translateY(100%)'
    }};
    transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
  }

  /* Mobile/Tablet: marquee effect */
  @media (max-width: ${({ theme }) => theme.mediaSize.xl - 1}px) {
    position: absolute;
    left: 0;
    justify-content: flex-start;
    white-space: nowrap;
    opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
    animation: ${({ $isActive }) =>
      $isActive ? 'marquee 15s linear infinite' : 'none'};
  }

  &:hover {
    text-decoration: underline;
  }

  @keyframes marquee {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`

// Dropdown styled components
const DropdownContainer = styled.div`
  position: relative;
  padding: 10px 10px;
`

const SecondaryMenuBar = styled.div<{ $isVisible: boolean }>`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary[95]};
  display: ${({ $isVisible }) => ($isVisible ? 'block' : 'none')};
  margin-left: 25px;
`

const SecondaryMenuContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  padding: 0 16px;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
`

const SecondaryMenuItem = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 4px 10px;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[20]};
  }
`

// Action buttons for tablet (shown in top section)
const TabletActionButtons = styled.div`
  display: none;
  gap: 0.75rem;

  /* Hide on mobile (< md) */
  /* Show only on tablet (md to xl) */
  @media (min-width: ${({ theme }) =>
      theme.mediaSize.md}px) and (max-width: ${({ theme }) =>
      theme.mediaSize.xl - 1}px) {
    display: flex;
  }
`

const CloseButton = styled.button`
  position: fixed;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[40]};
  }

  /* Only show on mobile/tablet */
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    display: none;
  }
`

const MobileMenuContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;

  /* Only show on mobile/tablet */
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    display: none;
  }
`

const MobileMenuHeader = styled.div`
  display: none;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;

  /* Show on mobile and tablet (< xl) */
  @media (max-width: ${({ theme }) => theme.mediaSize.xl - 1}px) {
    display: flex;
  }
`

const MobileMenuLogo = styled.div`
  svg {
    width: 150px;
    height: auto;
  }
`

const MobileMenuSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1rem;
`

const MobileMenuDivider = styled.hr`
  width: 88px;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.grayscale[60]};
  margin: 8px 0;
`

const MobileMenuFooter = styled.div`
  display: none;
  padding-top: 1rem;

  /* Show on mobile and tablet (< xl) */
  @media (max-width: ${({ theme }) => theme.mediaSize.xl - 1}px) {
    display: flex;
  }
`

const SocialIcons = styled.div`
  display: flex;
  gap: 16px;

  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.grayscale[40]};
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colors.primary[40]};
    }

    &.mail {
      width: 20px;
      height: 20px;
    }
  }
`

const SubMenuView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
`

const SubMenuHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 1rem;
`

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary[40]};
  }
`

const SubMenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`

const SubMenuItem = styled.a`
  color: ${({ theme }) => theme.colors.grayscale[0]};
  text-decoration: none;
  font-size: 20px;
  font-weight: 500;
  line-height: 2;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[40]};
  }
`

const Header = () => {
  const router = useRouter()
  const { firebaseUser, member, loading: authLoading, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null)
  const [isFeatureHovered, setIsFeatureHovered] = useState(false)
  const [currentSubMenu, setCurrentSubMenu] = useState<HeaderNavSection | null>(
    null
  )
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false)
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0)
  const [prevNewsIndex, setPrevNewsIndex] = useState<number | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const featureHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollY = useRef(0)
  const scrollDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const isHoveringNavRef = useRef(false)

  // Get header data from context (pre-fetched on server side)
  const {
    sections: navigationItems,
    featuredTags,
    topics: headerTopics,
    newsBarPicks,
  } = useHeaderData()

  // Process news items from homepage picks
  const newsItems = newsBarPicks
    .filter((pick) => pick.customTitle || pick.posts?.title)
    .map((pick) => ({
      id: pick.id,
      title: pick.customTitle || pick.posts?.title || '',
      url: pick.customUrl || (pick.posts ? `/node/${pick.posts.id}` : null),
    }))

  // Auto-rotate news items
  // Desktop: 5 seconds (vertical slide)
  // Mobile/Tablet: 15 seconds (match marquee animation duration)
  useEffect(() => {
    if (newsItems.length <= 1) return

    const isDesktop = window.innerWidth >= 1200
    const rotateInterval = isDesktop ? 5000 : 15000

    const interval = setInterval(() => {
      setPrevNewsIndex(currentNewsIndex)
      setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length)
    }, rotateInterval)

    return () => clearInterval(interval)
  }, [newsItems.length, currentNewsIndex])

  // Check if user is logged in (has firebase user and member)
  const isLoggedIn = !authLoading && firebaseUser && member

  const handleAuthButtonClick = async () => {
    if (isLoggedIn) {
      // User is logged in, sign out
      await signOut()
      router.push('/')
    } else {
      // User is not logged in, go to login page
      router.push('/auth/login')
    }
  }

  const handleCategoryHover = (categoryIndex: number) => {
    // Clear any existing timeout when hovering a new category
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    // Close feature menu when hovering other categories
    setIsFeatureHovered(false)
    if (featureHoverTimeoutRef.current) {
      clearTimeout(featureHoverTimeoutRef.current)
      featureHoverTimeoutRef.current = null
    }
    // Pause scroll detection while hovering nav
    isHoveringNavRef.current = true
    setHoveredCategory(categoryIndex)
  }

  const handleCategoryLeave = () => {
    // Set a delay before closing to allow cursor movement to secondary menu
    const timeout = setTimeout(() => {
      setHoveredCategory(null)
      // Resume scroll detection after leaving nav
      isHoveringNavRef.current = false
    }, 300) // Increased delay to 300ms for easier cursor movement
    hoverTimeoutRef.current = timeout
  }

  const handleSecondaryMenuEnter = () => {
    // Cancel the closing timeout when cursor enters secondary menu
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    // Keep scroll detection paused while in secondary menu
    isHoveringNavRef.current = true
  }

  const handleSecondaryMenuLeave = () => {
    // Close immediately when leaving secondary menu
    setHoveredCategory(null)
    // Resume scroll detection after leaving nav
    isHoveringNavRef.current = false
  }

  // 深度專題 hover handlers
  const handleFeatureHover = () => {
    if (featureHoverTimeoutRef.current) {
      clearTimeout(featureHoverTimeoutRef.current)
      featureHoverTimeoutRef.current = null
    }
    // Close category menu when hovering feature
    setHoveredCategory(null)
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    isHoveringNavRef.current = true
    setIsFeatureHovered(true)
  }

  const handleFeatureLeave = () => {
    const timeout = setTimeout(() => {
      setIsFeatureHovered(false)
      isHoveringNavRef.current = false
    }, 300)
    featureHoverTimeoutRef.current = timeout
  }

  const handleFeatureMenuEnter = () => {
    if (featureHoverTimeoutRef.current) {
      clearTimeout(featureHoverTimeoutRef.current)
      featureHoverTimeoutRef.current = null
    }
    isHoveringNavRef.current = true
  }

  const handleFeatureMenuLeave = () => {
    setIsFeatureHovered(false)
    isHoveringNavRef.current = false
  }

  const handleMobileMenuItemClick = (item: HeaderNavSection) => {
    if (item.categories && item.categories.length > 0) {
      setCurrentSubMenu(item)
    }
  }

  const handleBackToMainMenu = () => {
    setCurrentSubMenu(null)
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false)
    setCurrentSubMenu(null)
  }

  // Handle scroll direction for header hide/show
  useEffect(() => {
    const handleScroll = () => {
      // Skip if hovering on navigation menu
      if (isHoveringNavRef.current) {
        return
      }

      const currentScrollY = window.scrollY
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current)

      // Only process if scrolled more than 40px to avoid small movements
      if (scrollDelta > 40) {
        // Clear any pending debounce
        if (scrollDebounceRef.current) {
          clearTimeout(scrollDebounceRef.current)
        }

        // Debounce the state change by 150ms
        scrollDebounceRef.current = setTimeout(() => {
          if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            // Scrolling down - hide header
            setIsHeaderHidden(true)
          } else if (currentScrollY < lastScrollY.current) {
            // Scrolling up - show header
            setIsHeaderHidden(false)
          }
          lastScrollY.current = currentScrollY
        }, 150)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollDebounceRef.current) {
        clearTimeout(scrollDebounceRef.current)
      }
    }
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <HeaderContainer $isHidden={isHeaderHidden}>
        <Container>
          <TopSection>
            <HamburgerButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <IconHamburger />
            </HamburgerButton>
            <LogoRightWrapper>
              <Logo>
                <Link href="/">
                  <LogoEIC />
                </Link>
              </Logo>
              <RightSection>
                <SearchButton href="/search">
                  <IconSearch />
                </SearchButton>
                {isLoggedIn ? (
                  <>
                    <UserInfo href="/member">
                      <UserName>
                        {member ? getMemberDisplayName(member) : '會員'}
                      </UserName>
                      <IconMember />
                    </UserInfo>
                    <LogoutButton onClick={handleAuthButtonClick}>
                      登出
                    </LogoutButton>
                  </>
                ) : (
                  <LoginButton onClick={handleAuthButtonClick}>
                    {authLoading ? (
                      <Lottie
                        animationData={loadingAnimation}
                        loop
                        style={{ width: 24, height: 24, transform: 'scale(2)' }}
                      />
                    ) : (
                      '登入'
                    )}
                  </LoginButton>
                )}
                <TabletActionButtons>
                  <ActionButton
                    as="button"
                    onClick={() => setIsNewsletterModalOpen(true)}
                  >
                    訂閱電子報
                  </ActionButton>
                  <ActionButton
                    as="a"
                    href="https://tnf.neticrm.tw/civicrm/contribute/transact?reset=1&id=12"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    捐款支持
                  </ActionButton>
                </TabletActionButtons>
              </RightSection>
            </LogoRightWrapper>
          </TopSection>

          {/* Desktop navigation - inside Container */}
          <DesktopNavWrapper>
            <NavigationMenu>
              {navigationItems.map((item, index) => (
                <DropdownContainer key={item.id}>
                  <NavItem
                    href={`/section/${item.slug}`}
                    onMouseEnter={() => handleCategoryHover(index)}
                    onMouseLeave={handleCategoryLeave}
                  >
                    {item.name}
                  </NavItem>
                </DropdownContainer>
              ))}
              {/* 深度專題 - fixed link with featured style */}
              <DropdownContainer>
                <NavItem
                  href="/feature"
                  className="featured"
                  onMouseEnter={handleFeatureHover}
                  onMouseLeave={handleFeatureLeave}
                >
                  深度專題
                </NavItem>
              </DropdownContainer>
              {/* Featured tags */}
              {featuredTags.map((tag) => (
                <DropdownContainer key={tag.id}>
                  <NavItem href={`/tag/${tag.name}`} className="featured-tag">
                    {tag.name}
                  </NavItem>
                </DropdownContainer>
              ))}
            </NavigationMenu>
            <ActionButtons>
              <ActionButton
                as="button"
                onClick={() => setIsNewsletterModalOpen(true)}
              >
                訂閱電子報
              </ActionButton>
              <ActionButton
                as="a"
                href="https://tnf.neticrm.tw/civicrm/contribute/transact?reset=1&id=12"
                target="_blank"
                rel="noopener noreferrer"
              >
                捐款支持
              </ActionButton>
            </ActionButtons>
          </DesktopNavWrapper>
        </Container>

        {/* Secondary menu - outside Container to push NewsBar down */}
        <SecondaryMenuBar
          $isVisible={hoveredCategory !== null}
          onMouseEnter={handleSecondaryMenuEnter}
          onMouseLeave={handleSecondaryMenuLeave}
        >
          <SecondaryMenuContainer>
            {hoveredCategory !== null &&
              navigationItems[hoveredCategory]?.categories?.map((category) => (
                <SecondaryMenuItem
                  key={category.id}
                  href={`/category/${category.id}`}
                >
                  {category.name}
                </SecondaryMenuItem>
              ))}
          </SecondaryMenuContainer>
        </SecondaryMenuBar>

        {/* 深度專題 secondary menu - topics list */}
        <SecondaryMenuBar
          $isVisible={isFeatureHovered}
          onMouseEnter={handleFeatureMenuEnter}
          onMouseLeave={handleFeatureMenuLeave}
        >
          <SecondaryMenuContainer>
            {headerTopics.map((topic) => (
              <SecondaryMenuItem key={topic.id} href={`/feature/${topic.id}`}>
                {topic.title}
              </SecondaryMenuItem>
            ))}
          </SecondaryMenuContainer>
        </SecondaryMenuBar>

        {newsItems.length > 0 && (
          <NewsBar>
            {newsItems.map((news, index) => (
              <NewsContent
                key={news.id}
                $isActive={index === currentNewsIndex}
                $isLeaving={index === prevNewsIndex}
                href={news.url || '#'}
              >
                <NewsLabel>快訊</NewsLabel>
                {news.title}
              </NewsContent>
            ))}
          </NewsBar>
        )}

        <NewsletterModal
          isOpen={isNewsletterModalOpen}
          onClose={() => setIsNewsletterModalOpen(false)}
        />
      </HeaderContainer>

      {/* Mobile/Tablet menu - outside HeaderContainer to avoid transform containing block issue */}
      <NavigationSection isOpen={isMenuOpen}>
        <CloseButton onClick={handleMenuClose}>
          <IconCancel />
        </CloseButton>

        <MobileMenuHeader>
          <MobileMenuLogo>
            <LogoEIC />
          </MobileMenuLogo>
        </MobileMenuHeader>

        {!currentSubMenu ? (
          <MobileMenuContent>
            <MobileMenuSection>
              <ActionButton
                as="a"
                href="https://tnf.neticrm.tw/civicrm/contribute/transact?reset=1&id=12"
                target="_blank"
                rel="noopener noreferrer"
              >
                捐款支持
              </ActionButton>
              <ActionButton
                as="button"
                onClick={() => {
                  setIsNewsletterModalOpen(true)
                  handleMenuClose()
                }}
              >
                訂閱電子報
              </ActionButton>
            </MobileMenuSection>

            <MobileMenuSection>
              {navigationItems.map((item) => (
                <NavItem
                  key={item.id}
                  href={
                    item.categories && item.categories.length > 0
                      ? '#'
                      : `/section/${item.slug}`
                  }
                  onClick={(e) => {
                    if (item.categories && item.categories.length > 0) {
                      e.preventDefault()
                      handleMobileMenuItemClick(item)
                    }
                  }}
                >
                  {item.name}
                </NavItem>
              ))}
              {/* 深度專題 - fixed link with featured style */}
              <NavItem href="/feature" className="featured">
                深度專題
              </NavItem>
              {/* Divider between 深度專題 and Featured tags */}
              <MobileMenuDivider />
              {/* Featured tags */}
              {featuredTags.map((tag) => (
                <NavItem
                  key={tag.id}
                  href={`/tag/${tag.name}`}
                  className="featured-tag"
                >
                  {tag.name}
                </NavItem>
              ))}
              {/* Social icons - below featured tags */}
              <MobileMenuFooter>
                <SocialIcons>
                  <IconFacebook />
                  <IconInstagram />
                  <IconMail className="mail" />
                </SocialIcons>
              </MobileMenuFooter>
            </MobileMenuSection>
          </MobileMenuContent>
        ) : (
          <SubMenuView>
            <SubMenuHeader>
              <BackButton onClick={handleBackToMainMenu}>
                <IconLeftArrow />
              </BackButton>
            </SubMenuHeader>

            <SubMenuList>
              {currentSubMenu.categories.map((category) => (
                <SubMenuItem
                  key={category.id}
                  href={`/category/${category.id}`}
                >
                  {category.name}
                </SubMenuItem>
              ))}
            </SubMenuList>
          </SubMenuView>
        )}
      </NavigationSection>
    </>
  )
}

export default Header
