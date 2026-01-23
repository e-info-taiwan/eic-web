import React, { useState } from 'react'
import styled from 'styled-components'

import NewsletterModal from '~/components/shared/newsletter-modal'
import { useHeaderData } from '~/contexts/header-context'
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
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`

const CopyrightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
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

const ContactSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    text-align: left;
  }
`

const ContactText = styled.p`
  color: ${({ theme }) => theme.colors.grayscale[40]};
  font-size: 12px;
  line-height: 1.5;
  margin: 0;

  a {
    color: ${({ theme }) => theme.colors.grayscale[40]};
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.colors.primary[40]};
    }
  }
`

const SocialSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    justify-content: flex-end;
  }
`

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[40]};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`

const Footer = () => {
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false)
  const { siteConfigs } = useHeaderData()

  // Get donation permit number from site configs
  const donationPermitConfig = siteConfigs.find(
    (config) => config.name === '公益勸募字號'
  )
  const donationPermitNumber = donationPermitConfig?.content || ''

  const navigationData = [
    [
      { label: '關於我們', href: '/about' },
      { label: '合作媒體', href: '/media-partners' },
      { label: '編輯室自律公約', href: '/editorial-guidelines' },
      { label: '活動', href: '/events' },
    ],
    [
      { label: '網站授權條款', href: '/copyright' },
      { label: '常見問題', href: '/faq' },
      { label: '獲獎記錄', href: '/awards' },
      { label: '綠色職缺', href: '/jobs' },
    ],
    [
      { label: '投稿須知', href: '/submission-guidelines' },
      { label: '隱私權政策', href: '/privacy' },
      { label: '網站導覽', href: '/sitemap' },
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
              <Button
                as="a"
                href="https://tnf.neticrm.tw/civicrm/contribute/transact?reset=1&id=12"
                target="_blank"
                rel="noopener noreferrer"
              >
                捐款支持
              </Button>
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
              © Copyright 2026 環境資訊中心 版權所有
            </CopyrightText>
            <CopyrightText>公益勸募字號：{donationPermitNumber}</CopyrightText>
          </CopyrightSection>

          <ContactSection>
            <ContactText>
              服務信箱：
              <a href="mailto:service@tnf.org.tw">service@tnf.org.tw</a>
            </ContactText>
            <ContactText>
              投稿信箱：
              <a href="mailto:infor@e-info.org.tw">infor@e-info.org.tw</a>
            </ContactText>
          </ContactSection>

          <ContactSection>
            <ContactText>客服電話：070-10101-666／02-2910-6000</ContactText>
            <ContactText>
              地址：231023新北市新店區民權路48號3樓（近捷運大坪林站1號出口）
            </ContactText>
          </ContactSection>

          <SocialSection>
            <SocialLink
              href="https://www.facebook.com/enc.teia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </SocialLink>
            <SocialLink
              href="https://x.com/e_info"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </SocialLink>
            <SocialLink
              href="https://www.instagram.com/enc.teia/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </SocialLink>
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
