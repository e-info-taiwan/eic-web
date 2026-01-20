import React, { useState } from 'react'
import styled from 'styled-components'

import NewsletterModal from '~/components/shared/newsletter-modal'
import LogoEIC from '~/public/eic-logo.svg'

// Styled Components
const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.grayscale[95]};
  padding: 36px 24px 24px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    grid-template-columns: repeat(4, 1fr);
    row-gap: 0;
    column-gap: 30px;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    column-gap: 64px;
  }
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

  justify-content: center;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 27px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    flex-direction: column;
    align-items: center;
    gap: 11px;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    flex-direction: row;
    gap: 51px;
  }
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  flex-direction: row;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    flex-direction: row;
  }
`

const Button = styled.button`
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.primary[40]};
  color: ${({ theme }) => theme.colors.primary[40]};
  padding: 5.5px 12px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[40]};
    color: white;
  }
`

const NavigationSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 20px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    grid-template-columns: repeat(4, 1fr);
    row-gap: 0;
    column-gap: 30px;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    column-gap: 64px;
  }
`

const NavLink = styled.a`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  font-size: 14px;
  line-height: 2;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[20]};
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    font-size: 14px;
    align-items: flex-start;
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.grayscale[60]};
  margin: 31px 16px 18px 16px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    margin-left: 0;
    margin-right: 0;
  }
`

const BottomSection = styled.div`
  display: flex;
  flex-direction: column-reverse;
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
  align-items: center;
  gap: 15px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 30px;
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
  justify-content: center;
  gap: 7px;
`

const SocialIcons = styled.div`
  display: flex;
  gap: 0.5rem;
`

const SocialIcon = styled.div`
  width: 21px;
  height: 21px;
  background-color: ${({ theme }) => theme.colors.grayscale[60]};
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[40]};
  }
`

const Footer = () => {
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false)

  const navigationData = [
    [
      { label: '關於我們', href: '/about' },
      { label: '合作媒體', href: '#' },
      { label: '編輯室自律公約', href: '#' },
      { label: '活動', href: '#' },
    ],
    [
      { label: '網站授權條款', href: '#' },
      { label: '常見問題', href: '#' },
      { label: '獲獎記錄', href: '#' },
      { label: '綠色職缺', href: '#' },
    ],
    [
      { label: '投稿須知', href: '#' },
      { label: '隱私權政策', href: '#' },
      { label: '網站導覽', href: '#' },
      {
        label: '意見回饋',
        href: 'https://docs.google.com/forms/d/e/1FAIpQLSf17d9VPzybQZxnhU6HRhPU-3FEflWzUbNtEafgYVLsVl7rpQ/viewform',
      },
    ],
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
              <Button onClick={() => setIsNewsletterModalOpen(true)}>
                訂閱電子報
              </Button>
              <Button>捐款支持</Button>
            </ActionButtons>
          </LeftSection>

          <NavigationSection>
            {navigationData.map((columnLinks, columnIndex) =>
              columnLinks.map((link, linkIndex) => (
                <NavLink
                  key={`${columnIndex}-${linkIndex}`}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    link.href.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                >
                  {link.label}
                </NavLink>
              ))
            )}
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
            <SocialIcons>
              {[...Array(7)].map((_, index) => (
                <SocialIcon key={index} />
              ))}
            </SocialIcons>
          </SocialSection>
        </BottomSection>
      </Container>

      <NewsletterModal
        isOpen={isNewsletterModalOpen}
        onClose={() => setIsNewsletterModalOpen(false)}
      />
    </FooterContainer>
  )
}

export default Footer
