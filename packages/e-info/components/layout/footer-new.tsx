import React from 'react'
import styled from 'styled-components'

import LogoEIC from '~/public/eic-logo.svg'

// Styled Components
const FooterContainer = styled.footer`
  background-color: #eaeaea;
  padding: 2rem 1rem 1rem;
  margin-top: 4rem;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }
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

const LogoTitle = styled.h3`
  color: #059669;
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
`

const LogoSubtitle = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.2;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`

const Button = styled.button`
  background: #fff;
  border: 1px solid #5b9d68;
  color: #5b9d68;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #5b9d68;
    color: white;
  }
`

const NavigationSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, auto);
    gap: 3rem;
  }
`

const NavColumn = styled.div`
  display: flex;
  flex-direction: column;
`

const NavLink = styled.a`
  color: #6f6f72;
  font-size: 14px;
  line-height: 2;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #388a48;
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #d1d5db;
  margin: 2rem 0 1.5rem;
`

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

const CopyrightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    gap: 2rem;
  }
`

const CopyrightText = styled.p`
  color: #000;
  font-size: 12px;
  line-height: 1.25;
  font-weight: 400;
  letter-spacing: 0;
  margin: 0;
`

const SocialSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const SocialLabel = styled.span`
  color: #000;
  font-size: 12px;
  line-height: 1.25;
  font-weight: 400;
  letter-spacing: 0;
`

const SocialIcons = styled.div`
  display: flex;
  gap: 0.5rem;
`

const SocialIcon = styled.div`
  width: 21px;
  height: 21px;
  background-color: #9ca3af;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #059669;
  }
`

const Footer = () => {
  const navigationData = [
    ['關於我們', '網站授權條款', '投稿須知'],
    ['合作媒體', '常見問題', '隱私權政策'],
    ['編輯室自律公約', '獲獎記錄', '網站導覽'],
    ['活動', '綠色職缺'],
  ]

  return (
    <FooterContainer>
      <Container>
        <TopSection>
          <LeftSection>
            <Logo>
              <LogoEIC />
            </Logo>

            <ActionButtons>
              <Button>訂閱電子報</Button>
              <Button>捐款支持</Button>
            </ActionButtons>
          </LeftSection>

          <NavigationSection>
            {navigationData.map((columnLinks, columnIndex) => (
              <NavColumn key={columnIndex}>
                {columnLinks.map((link, linkIndex) => (
                  <NavLink key={linkIndex} href="#">
                    {link}
                  </NavLink>
                ))}
              </NavColumn>
            ))}
          </NavigationSection>
        </TopSection>

        <Divider />

        <BottomSection>
          <CopyrightSection>
            <CopyrightText>
              © Copyright 2023 環境資訊中心 版權所有
            </CopyrightText>
            <CopyrightText>公益勸募字號</CopyrightText>
          </CopyrightSection>

          <SocialSection>
            <SocialLabel>聯絡資訊與社群ICON</SocialLabel>
            <SocialIcons>
              {[...Array(7)].map((_, index) => (
                <SocialIcon key={index} />
              ))}
            </SocialIcons>
          </SocialSection>
        </BottomSection>
      </Container>
    </FooterContainer>
  )
}

export default Footer
