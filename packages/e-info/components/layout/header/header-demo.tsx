import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import LogoEIC from '~/public/eic-logo.svg'
import IconCancel from '~/public/icons/cancel.svg'
import IconHamburger from '~/public/icons/hamburger.svg'
import IconSearch from '~/public/icons/search.svg'

// Styled Components
const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.grayscale[100]};
  position: sticky;
  top: 0;
  z-index: 100;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`

const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  position: relative;
  gap: 12px;
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
  gap: 1rem;

  ${({ theme }) => theme.breakpoint.md} {
    gap: 0.75rem;
  }
`

const SearchButton = styled.button`
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

const ActionButtons = styled.div`
  display: none;
  gap: 1rem;

  /* Hide on mobile (< md) */
  ${({ theme }) => theme.breakpoint.md} {
    display: flex;
  }

  /* Hide on tablet and show on desktop (>= xl) for navigation area */
  ${({ theme }) => theme.breakpoint.xl} {
    display: flex;
  }
`

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  cursor: pointer;
  transition: color 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[40]};
  }
`

const NavigationSection = styled.div<{ isOpen: boolean }>`
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide navigation on mobile and tablet (< xl) */
  @media (max-width: ${({ theme }) => theme.mediaSize.xl - 1}px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.colors.grayscale[95]};
    flex-direction: column;
    z-index: 10000;
    padding: 2rem;
    overflow-y: auto;
  }
`

const NavigationMenu = styled.nav`
  display: flex;
  gap: 0;
  min-width: max-content;

  /* Hide on mobile/tablet - desktop nav is handled by MobileMenuContent visibility */
  @media (max-width: ${({ theme }) => theme.mediaSize.xl - 1}px) {
    display: none;
  }
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

  /* Mobile menu styling */
  @media (max-width: ${({ theme }) => theme.mediaSize.xl - 1}px) {
    font-size: 18px;
    font-weight: 400;
    padding: 0.75rem 0;
    border-bottom: none;
    border-top: none;

    &.highlighted {
      font-weight: 500;
    }
  }

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
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 10px 0;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;

  /* Marquee effect for mobile and tablet devices */
  @media (max-width: ${({ theme }) => theme.mediaSize.xl - 1}px) {
    overflow: hidden;
    white-space: nowrap;
    position: relative;
  }
`

const NewsContent = styled.span`
  /* Default: centered on desktop */
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    display: inline;
  }

  /* Marquee animation for mobile and tablet */
  @media (max-width: ${({ theme }) => theme.mediaSize.xl - 1}px) {
    display: inline-block;
    animation: marquee 20s linear infinite;
    white-space: nowrap;
  }

  @keyframes marquee {
    0% {
      transform: translateX(100vw);
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

const SecondaryMenuBar = styled.div`
  position: fixed;
  margin-top: 6px;
  left: 0;
  width: 100vw;
  background: ${({ theme }) => theme.colors.primary[95]};
  z-index: 10000;
  opacity: 0;
  visibility: hidden;

  &.show {
    opacity: 1;
    visibility: visible;
  }
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

const SecondaryMenuItem = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 4px 10px;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[20]};
  }
`

const TertiaryDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 100px;
  background: ${({ theme }) => theme.colors.grayscale[100]};
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  margin-top: 0;

  &.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`

const TertiaryItem = styled.a`
  display: block;
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale[99]};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.grayscale[99]};
    color: ${({ theme }) => theme.colors.primary[40]};
    padding-left: 1.25rem;
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
  padding: 2rem;
  height: 100%;

  /* Only show on mobile/tablet */
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    display: none;
  }
`

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`

const MobileMenuLogo = styled.div`
  svg {
    width: 150px;
    height: auto;
  }
`

const MobileMenuSection = styled.div`
  display: flex;
  flex: wrap;
  flex-direction: column;
  margin-bottom: 1rem;
`

const MobileMenuFooter = styled.div`
  margin-top: auto;
  padding-top: 2rem;
`

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;

  svg {
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.colors.grayscale[40]};
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colors.primary[40]};
    }
  }
`

const SubMenuView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 2rem;
  height: 100%;
`

const SubMenuHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
`

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  cursor: pointer;
  padding: 0.5rem;
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

const SubMenuTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  margin: 0;
`

const SubMenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`

const SubMenuItem = styled.a`
  color: ${({ theme }) => theme.colors.grayscale[0]};
  text-decoration: none;
  font-size: 18px;
  font-weight: 400;
  padding: 0.75rem 0;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[40]};
  }
`

// Navigation data with nested structure
const navigationItems = [
  {
    label: '時事新聞',
    href: '#',
    active: false,
    subCategories: [
      {
        label: '國內新聞',
        href: '#',
        items: ['政治', '經濟', '社會', '地方'],
      },
      {
        label: '國際新聞',
        href: '#',
        items: ['亞洲', '歐美', '全球議題'],
      },
      {
        label: '環境新聞',
        href: '#',
        items: ['氣候變遷', '污染防治', '生態保護'],
      },
    ],
  },
  {
    label: '評論',
    href: '#',
    subCategories: [
      {
        label: '專家評論',
        href: '#',
        items: ['學者觀點', '業界分析', '政策解讀'],
      },
      {
        label: '讀者投書',
        href: '#',
        items: ['民眾聲音', '經驗分享'],
      },
    ],
  },
  {
    label: '專欄',
    href: '#',
    subCategories: [
      {
        label: '名人專欄',
        href: '#',
        items: ['環保達人', '綠色生活家', '永續專家'],
      },
      {
        label: '主題專欄',
        href: '#',
        items: ['週報', '月報', '特別企劃'],
      },
    ],
  },
  {
    label: '副刊',
    href: '#',
    subCategories: [
      {
        label: '生活風格',
        href: '#',
        items: ['綠色旅遊', '永續時尚', '健康飲食'],
      },
      {
        label: '藝文活動',
        href: '#',
        items: ['展覽', '講座', '工作坊'],
      },
    ],
  },
  {
    label: '綠色消費',
    href: '#',
    subCategories: [
      {
        label: '產品評測',
        href: '#',
        items: ['家電用品', '日用品', '食品'],
      },
      {
        label: '消費指南',
        href: '#',
        items: ['購買建議', '使用心得', '比較分析'],
      },
    ],
  },
  {
    label: '深度專題',
    href: '#',
    featured: true,
    subCategories: [
      {
        label: '調查報導',
        href: '#',
        items: ['環境污染', '政策追蹤', '企業責任'],
      },
      {
        label: '專題企劃',
        href: '#',
        items: ['年度回顧', '未來展望', '國際比較'],
      },
    ],
  },
  {
    label: '氣候能源',
    href: '#',
    highlighted: true,
    subCategories: [
      {
        label: '再生能源',
        href: '#',
        items: ['太陽能', '風能', '水力發電'],
      },
      {
        label: '節能減碳',
        href: '#',
        items: ['建築節能', '交通運輸', '工業減排'],
      },
    ],
  },
  {
    label: '土地永續',
    href: '#',
    highlighted: true,
    subCategories: [
      {
        label: '農業發展',
        href: '#',
        items: ['有機農業', '智慧農業', '農地保護'],
      },
      {
        label: '都市規劃',
        href: '#',
        items: ['綠建築', '公園綠地', '交通規劃'],
      },
    ],
  },
  {
    label: '循環經濟',
    href: '#',
    highlighted: true,
    subCategories: [
      {
        label: '廢棄物管理',
        href: '#',
        items: ['回收再利用', '垃圾減量', '資源循環'],
      },
      {
        label: '產業轉型',
        href: '#',
        items: ['綠色製造', '永續設計', '商業模式'],
      },
    ],
  },
  {
    label: '生態保育',
    href: '#',
    highlighted: true,
    subCategories: [
      {
        label: '物種保護',
        href: '#',
        items: ['瀕危物種', '棲地保護', '復育計畫'],
      },
      {
        label: '海洋保護',
        href: '#',
        items: ['海洋污染', '漁業永續', '珊瑚保育'],
      },
    ],
  },
]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null)
  const [hoveredSecondaryCategory, setHoveredSecondaryCategory] = useState<
    number | null
  >(null)
  const [currentSubMenu, setCurrentSubMenu] = useState<
    typeof navigationItems[0] | null
  >(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleCategoryHover = (categoryIndex: number) => {
    // Clear any existing timeout when hovering a new category
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setHoveredCategory(categoryIndex)
    setHoveredSecondaryCategory(null)
  }

  const handleCategoryLeave = () => {
    // Set a delay before closing to allow cursor movement to secondary menu
    const timeout = setTimeout(() => {
      setHoveredCategory(null)
      setHoveredSecondaryCategory(null)
    }, 300) // Increased delay to 300ms for easier cursor movement
    hoverTimeoutRef.current = timeout
  }

  const handleSecondaryMenuEnter = () => {
    // Cancel the closing timeout when cursor enters secondary menu
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }

  const handleSecondaryMenuLeave = () => {
    // Close immediately when leaving secondary menu
    setHoveredCategory(null)
    setHoveredSecondaryCategory(null)
  }

  const handleSecondaryItemHover = (itemIndex: number) => {
    setHoveredSecondaryCategory(itemIndex)
  }

  const handleSecondaryItemLeave = () => {
    setHoveredSecondaryCategory(null)
  }

  const handleMobileMenuItemClick = (item: typeof navigationItems[0]) => {
    if (item.subCategories && item.subCategories.length > 0) {
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  return (
    <HeaderContainer>
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
              <SearchButton>
                <IconSearch />
              </SearchButton>
              <LoginButton>登入</LoginButton>
              <TabletActionButtons>
                <ActionButton>訂閱電子報</ActionButton>
                <ActionButton>捐款支持</ActionButton>
              </TabletActionButtons>
            </RightSection>
          </LogoRightWrapper>
        </TopSection>

        <NavigationSection isOpen={isMenuOpen}>
          <CloseButton onClick={handleMenuClose}>
            <IconCancel />
          </CloseButton>

          {/* Mobile/Tablet full-page menu overlay */}
          {!currentSubMenu ? (
            <MobileMenuContent>
              <MobileMenuHeader>
                <MobileMenuLogo>
                  <LogoEIC />
                </MobileMenuLogo>
              </MobileMenuHeader>

              <MobileMenuSection>
                <NavItem href="#" className="action-item">
                  捐款支持
                </NavItem>
                <NavItem href="#" className="action-item">
                  訂閱電子報
                </NavItem>
              </MobileMenuSection>

              <MobileMenuSection>
                {navigationItems.map((item, index) => (
                  <NavItem
                    key={index}
                    href={item.subCategories ? '#' : item.href}
                    className={`${item.active ? 'active' : ''} ${
                      item.featured ? 'featured' : ''
                    } ${item.highlighted ? 'highlighted' : ''}`}
                    onClick={(e) => {
                      if (item.subCategories) {
                        e.preventDefault()
                        handleMobileMenuItemClick(item)
                      }
                    }}
                  >
                    {item.label}
                  </NavItem>
                ))}
              </MobileMenuSection>

              <MobileMenuFooter>
                <SocialIcons>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.80 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </SocialIcons>
              </MobileMenuFooter>
            </MobileMenuContent>
          ) : (
            <SubMenuView>
              <SubMenuHeader>
                <BackButton onClick={handleBackToMainMenu}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                  </svg>
                </BackButton>
                <SubMenuTitle>{currentSubMenu.label}</SubMenuTitle>
              </SubMenuHeader>

              <SubMenuList>
                {currentSubMenu.subCategories.map((subCategory, index) => (
                  <SubMenuItem key={index} href={subCategory.href}>
                    {subCategory.label}
                  </SubMenuItem>
                ))}
              </SubMenuList>
            </SubMenuView>
          )}

          {/* Desktop navigation - always visible on desktop */}
          <NavigationMenu>
            {navigationItems.map((item, index) => (
              <DropdownContainer key={index}>
                <NavItem
                  href={item.href}
                  className={`${item.active ? 'active' : ''} ${
                    item.featured ? 'featured' : ''
                  } ${item.highlighted ? 'highlighted' : ''}`}
                  onMouseEnter={() => handleCategoryHover(index)}
                  onMouseLeave={handleCategoryLeave}
                >
                  {item.label}
                </NavItem>

                {item.subCategories && hoveredCategory === index && (
                  <SecondaryMenuBar
                    className="show"
                    onMouseEnter={handleSecondaryMenuEnter}
                    onMouseLeave={handleSecondaryMenuLeave}
                  >
                    <SecondaryMenuContainer>
                      {item.subCategories.map((subCategory, subIndex) => (
                        <SecondaryMenuItem
                          key={subIndex}
                          onMouseEnter={() =>
                            handleSecondaryItemHover(subIndex)
                          }
                          onMouseLeave={handleSecondaryItemLeave}
                        >
                          {subCategory.label}

                          {subCategory.items &&
                            hoveredSecondaryCategory === subIndex && (
                              <TertiaryDropdown className="show">
                                {subCategory.items.map(
                                  (tertiary, tertiaryIndex) => (
                                    <TertiaryItem key={tertiaryIndex} href="#">
                                      {tertiary}
                                    </TertiaryItem>
                                  )
                                )}
                              </TertiaryDropdown>
                            )}
                        </SecondaryMenuItem>
                      ))}
                    </SecondaryMenuContainer>
                  </SecondaryMenuBar>
                )}
              </DropdownContainer>
            ))}
          </NavigationMenu>
          <ActionButtons>
            <ActionButton>訂閱電子報</ActionButton>
            <ActionButton>捐款支持</ActionButton>
          </ActionButtons>
        </NavigationSection>
      </Container>
      <NewsBar>
        <NewsContent>
          《核管法》修法三讀 核電運轉年限最多再加20年、已停機核電可重啟
        </NewsContent>
      </NewsBar>
    </HeaderContainer>
  )
}

export default Header
