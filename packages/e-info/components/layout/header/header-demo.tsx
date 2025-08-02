import React, { useState } from 'react'
import styled from 'styled-components'

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
  width: 40px;
  height: 40px;
  background-color: #059669;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #047857;
  }
`

const LoginButton = styled.button`
  background: none;
  border: 2px solid #059669;
  color: #059669;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #059669;
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
  color: #059669;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: normal;
  cursor: pointer;
  transition: color 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: #047857;
  }
`

const NavigationSection = styled.div`
  border-top: 1px solid #e5e7eb;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

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
  padding: 1rem 1.5rem;
  color: #4b5563;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;
  white-space: nowrap;
  border-bottom: 3px solid transparent;

  &:hover {
    color: #059669;
  }

  &.active {
    color: #059669;
    border-bottom-color: #059669;
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
            <LogoIcon>🌱</LogoIcon>
            <LogoText>
              <LogoTitle>環境資訊中心</LogoTitle>
              <LogoSubtitle>Environmental Information Center</LogoSubtitle>
            </LogoText>
          </Logo>

          <RightSection>
            <SearchButton>🔍</SearchButton>
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
            <ActionButtons>
              <ActionButton>訂閱電子報</ActionButton>
              <ActionButton>捐款支持</ActionButton>
            </ActionButtons>
          </NavigationMenu>
        </NavigationSection>
      </Container>
    </HeaderContainer>
  )
}

export default Header
