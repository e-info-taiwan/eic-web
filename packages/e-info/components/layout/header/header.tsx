import { useQuery } from '@apollo/client/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import NewsletterModal from '~/components/shared/newsletter-modal'
import {
  type NewsBarPick,
  homepagePicksForNewsBar,
} from '~/graphql/query/section'
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

const LogoutButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary[40]};
  border: 1px solid ${({ theme }) => theme.colors.primary[40]};
  color: white;
  padding: 5.5px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[20]};
    border-color: ${({ theme }) => theme.colors.primary[20]};
  }
`

const UserInfo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.colors.primary[20]};
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[40]};
  }

  svg {
    width: 28px;
    height: 32px;
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

  /* Mobile menu styling */
  @media (max-width: ${({ theme }) => theme.mediaSize.xl - 1}px) {
    font-size: 20px;
    font-weight: 500;
    line-height: 2;
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
  max-width: 150px;
  background: ${({ theme }) => theme.colors.grayscale[100]};
  z-index: 1001;
  opacity: 0;
  visibility: hidden;
  margin-top: 0;
  padding: 9px 8px;

  &.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`

const TertiaryItem = styled.a`
  display: block;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  text-decoration: none;
  font-size: 14px;
  text-align: center;
  padding-bottom: 12px;

  &:last-child {
    padding-bottom: 0;
  }
  &:hover {
    color: ${({ theme }) => theme.colors.primary[40]};
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

const MobileMenuFooter = styled.div`
  display: none;
  margin-top: auto;
  padding-top: 2rem;

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
      width: 30px;
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
        items: [
          '在理想中擱淺的鯨豚觀察員',
          '我推的防災生活',
          '直擊阿聯氣候新時代',
        ],
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
  const router = useRouter()
  const { firebaseUser, member, loading: authLoading, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null)
  const [hoveredSecondaryCategory, setHoveredSecondaryCategory] = useState<
    number | null
  >(null)
  const [currentSubMenu, setCurrentSubMenu] = useState<
    (typeof navigationItems)[0] | null
  >(null)
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false)
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0)
  const [prevNewsIndex, setPrevNewsIndex] = useState<number | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollY = useRef(0)
  const scrollDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const isHoveringNavRef = useRef(false)

  // Fetch all homepage picks for NewsBar (from all categories)
  const { data: newsBarData } = useQuery<{ homepagePicks: NewsBarPick[] }>(
    homepagePicksForNewsBar
  )

  // Process news items from homepage picks
  const newsItems = (newsBarData?.homepagePicks || [])
    .filter((pick) => pick.customTitle || pick.posts?.title)
    .map((pick) => ({
      id: pick.id,
      title: pick.customTitle || pick.posts?.title || '',
      url: pick.customUrl || (pick.posts ? `/node/${pick.posts.id}` : null),
      categoryName: pick.category?.name || '',
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
    // Pause scroll detection while hovering nav
    isHoveringNavRef.current = true
    setHoveredCategory(categoryIndex)
    setHoveredSecondaryCategory(null)
  }

  const handleCategoryLeave = () => {
    // Set a delay before closing to allow cursor movement to secondary menu
    const timeout = setTimeout(() => {
      setHoveredCategory(null)
      setHoveredSecondaryCategory(null)
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
    setHoveredSecondaryCategory(null)
    // Resume scroll detection after leaving nav
    isHoveringNavRef.current = false
  }

  const handleSecondaryItemHover = (itemIndex: number) => {
    setHoveredSecondaryCategory(itemIndex)
  }

  const handleSecondaryItemLeave = () => {
    setHoveredSecondaryCategory(null)
  }

  const handleMobileMenuItemClick = (item: (typeof navigationItems)[0]) => {
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
                <SearchButton>
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
                    {authLoading ? '...' : '登入'}
                  </LoginButton>
                )}
                <TabletActionButtons>
                  <ActionButton
                    as="button"
                    onClick={() => setIsNewsletterModalOpen(true)}
                  >
                    訂閱電子報
                  </ActionButton>
                  <ActionButton>捐款支持</ActionButton>
                </TabletActionButtons>
              </RightSection>
            </LogoRightWrapper>
          </TopSection>

          {/* Desktop navigation - inside Container */}
          <DesktopNavWrapper>
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
              <ActionButton>捐款支持</ActionButton>
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
              navigationItems[hoveredCategory]?.subCategories?.map(
                (subCategory, subIndex) => (
                  <SecondaryMenuItem
                    key={subIndex}
                    onMouseEnter={() => handleSecondaryItemHover(subIndex)}
                    onMouseLeave={handleSecondaryItemLeave}
                  >
                    {subCategory.label}

                    {subCategory.items &&
                      hoveredSecondaryCategory === subIndex && (
                        <TertiaryDropdown className="show">
                          {subCategory.items.map((tertiary, tertiaryIndex) => (
                            <TertiaryItem key={tertiaryIndex} href="#">
                              {tertiary}
                            </TertiaryItem>
                          ))}
                        </TertiaryDropdown>
                      )}
                  </SecondaryMenuItem>
                )
              )}
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
                {news.categoryName && (
                  <NewsLabel>{news.categoryName}</NewsLabel>
                )}
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
              <ActionButton>捐款支持</ActionButton>
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
          </MobileMenuContent>
        ) : (
          <SubMenuView>
            <SubMenuHeader>
              <BackButton onClick={handleBackToMainMenu}>
                <IconLeftArrow />
              </BackButton>
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

        <MobileMenuFooter>
          <SocialIcons>
            <IconFacebook />
            <IconInstagram />
            <IconMail className="mail" />
          </SocialIcons>
        </MobileMenuFooter>
      </NavigationSection>
    </>
  )
}

export default Header
