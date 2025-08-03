import React, { useState } from 'react'
import styled from 'styled-components'

import LogoEIC from '~/public/eic-logo.svg'
import IconSearch from '~/public/icons/search.svg'

// Styled Components
const HeaderContainer = styled.header`
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
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
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background-color: #059669;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
`

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`

const LogoTitle = styled.h1`
  color: #059669;
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`

const LogoSubtitle = styled.p`
  color: #6b7280;
  font-size: 0.75rem;
  margin: 0;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const SearchButton = styled.button`
  width: 32px;
  height: 32px;
  background-color: #388a48;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #388a48;
  }
`

const LoginButton = styled.button`
  background: none;
  border: 1px solid #5b9d68;
  color: #5b9d68;
  padding: 5.5px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #5b9d68;
    color: white;
  }
`

const ActionButtons = styled.div`
  display: none;
  gap: 1rem;
  @media (min-width: 1024px) {
    display: flex;
  }
`

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #232333;
  padding: 0.5rem 1rem;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  cursor: pointer;
  transition: color 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: #5b9d68;
  }
`

const NavigationSection = styled.div`
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  &::-webkit-scrollbar {
    display: none;
  }
`

const NavigationMenu = styled.nav`
  display: flex;
  gap: 0;
  min-width: max-content;
`

const NavItem = styled.a`
  position: relative;
  padding: 1rem 0.75rem;
  color: #232333;
  text-decoration: none;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.3s ease;
  white-space: nowrap;
  border-top: 3px solid transparent;

  &:hover {
    color: #5b9d68;
  }

  &.active {
    color: ##B9D68;
    border-top-color: #5b9d68;
  }

  &.featured {
    color: #f97316;

    &:hover {
      color: #ea580c;
    }

    &.active {
      color: #f97316;
      border-bottom-color: #f97316;
    }
  }
`

const MobileMenuButton = styled.button`
  display: block;
  background: none;
  border: none;
  color: #4b5563;
  font-size: 1.5rem;
  cursor: pointer;

  @media (min-width: 768px) {
    display: none;
  }
`

const NewsBar = styled.div`
  background: #cfedd1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 10px 0;
  color: #232333;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
`

// Navigation data
const navigationItems = [
  { label: '時事新聞', href: '#', active: true },
  { label: '評論', href: '#' },
  { label: '專欄', href: '#' },
  { label: '副刊', href: '#' },
  { label: '綠色消費', href: '#' },
  { label: '深度專題', href: '#', featured: true },
  { label: '氣候能源', href: '#' },
  { label: '土地永續', href: '#' },
  { label: '循環經濟', href: '#' },
  { label: '生態保育', href: '#' },
]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <HeaderContainer>
      <Container>
        <TopSection>
          <Logo>
            <LogoEIC />
          </Logo>

          <RightSection>
            <SearchButton>
              <IconSearch />
            </SearchButton>
            <LoginButton>登入</LoginButton>
            <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
              ☰
            </MobileMenuButton>
          </RightSection>
        </TopSection>

        <NavigationSection>
          <NavigationMenu>
            {navigationItems.map((item, index) => (
              <NavItem
                key={index}
                href={item.href}
                className={`${item.active ? 'active' : ''} ${
                  item.featured ? 'featured' : ''
                }`}
              >
                {item.label}
              </NavItem>
            ))}
          </NavigationMenu>
          <ActionButtons>
            <ActionButton>訂閱電子報</ActionButton>
            <ActionButton>捐款支持</ActionButton>
          </ActionButtons>
        </NavigationSection>
      </Container>
      <NewsBar>
        《核管法》修法三讀 核電運轉年限最多再加20年、已停機核電可重啟
      </NewsBar>
    </HeaderContainer>
  )
}

export default Header
