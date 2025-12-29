import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import LayoutGeneral from '~/components/layout/layout-general'
import { useAuth } from '~/hooks/useAuth'
import { updateUserProfile } from '~/lib/firebase/firestore'
import type { NextPageWithLayout } from '~/pages/_app'
import type { NewsletterPreferences } from '~/types/auth'
import { setCacheControl } from '~/utils/common'

const PageWrapper = styled.div`
  background-color: #ffffff;
  min-height: 100vh;
`

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px 60px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 60px 20px 100px;
    display: flex;
    gap: 60px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    gap: 80px;
  }
`

const Sidebar = styled.nav`
  display: none;

  ${({ theme }) => theme.breakpoint.md} {
    display: block;
    width: 120px;
    flex-shrink: 0;
  }
`

const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

type SidebarItemProps = {
  $isActive?: boolean
}

const SidebarItem = styled.li<SidebarItemProps>`
  a {
    display: block;
    padding: 8px 0;
    font-size: 16px;
    font-weight: ${({ $isActive }) => ($isActive ? '700' : '400')};
    line-height: 1.5;
    color: ${({ theme, $isActive }) =>
      $isActive ? theme.colors.primary[40] : theme.colors.grayscale[40]};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.primary[40]};
    }
  }
`

const MobileNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px 24px;
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale[90]};

  ${({ theme }) => theme.breakpoint.md} {
    display: none;
  }
`

const MobileNavItem = styled(Link)<{ $isActive?: boolean }>`
  font-size: 16px;
  font-weight: ${({ $isActive }) => ($isActive ? '700' : '400')};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary[40] : theme.colors.grayscale[40]};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[40]};
  }
`

const MainContent = styled.main`
  flex: 1;
  max-width: 600px;
  text-align: center;

  ${({ theme }) => theme.breakpoint.md} {
    text-align: left;
  }
`

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[40]};
  margin: 0 0 24px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 24px;
    margin-bottom: 32px;
  }
`

const NewsletterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
`

const NewsletterItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`

const NewsletterLabel = styled.span`
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
`

// Toggle Switch Styles
const ToggleWrapper = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  flex-shrink: 0;
`

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${({ theme }) => theme.colors.primary[40]};
  }

  &:checked + span:before {
    transform: translateX(24px);
  }
`

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.grayscale[80]};
  transition: 0.3s;
  border-radius: 26px;

  &:before {
    position: absolute;
    content: '';
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }
`

const SaveButton = styled.button`
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
  color: white;
  background-color: ${({ theme }) => theme.colors.grayscale[60]};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.grayscale[40]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ theme }) => theme.breakpoint.md} {
    align-self: flex-start;
  }
`

const SuccessMessage = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[40]};
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors.primary[95]};
  border-radius: 4px;
  margin-bottom: 16px;
  text-align: center;

  ${({ theme }) => theme.breakpoint.md} {
    text-align: left;
  }
`

const ErrorMessage = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.error.d};
  margin-bottom: 16px;
  text-align: center;

  ${({ theme }) => theme.breakpoint.md} {
    text-align: left;
  }
`

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: ${({ theme }) => theme.colors.grayscale[60]};
`

const sidebarItems = [
  { label: '個人資料', href: '/member' },
  { label: '電子報', href: '/member/newsletter' },
  { label: '閱讀紀錄', href: '/member/history' },
  { label: '收藏文章', href: '/member/bookmarks' },
  { label: '通知', href: '/member/notifications' },
]

const newsletterOptions = [
  { key: 'dailyGeneral', label: '《環境資訊電子報》每日報（一般版）' },
  { key: 'dailyBeautified', label: '《環境資訊電子報》每日報（美化版）' },
  { key: 'weeklyGeneral', label: '《環境資訊電子報一週回顧》（一般版）' },
  { key: 'weeklyBeautified', label: '《環境資訊電子報一週回顧》（美化版）' },
] as const

const defaultPreferences: NewsletterPreferences = {
  dailyGeneral: false,
  dailyBeautified: false,
  weeklyGeneral: false,
  weeklyBeautified: false,
}

const MemberNewsletterPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { firebaseUser, userProfile, loading, refreshUserProfile } = useAuth()

  const [preferences, setPreferences] =
    useState<NewsletterPreferences>(defaultPreferences)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize preferences from user profile
  useEffect(() => {
    if (userProfile?.newsletterPreferences) {
      setPreferences(userProfile.newsletterPreferences)
    } else if (userProfile?.newsletterSubscriptions) {
      // Migrate from old format if exists
      const { dailyNewsletter, weeklyNewsletter, newsletterFormat } =
        userProfile.newsletterSubscriptions
      setPreferences({
        dailyGeneral:
          dailyNewsletter && newsletterFormat === 'general' ? true : false,
        dailyBeautified:
          dailyNewsletter && newsletterFormat === 'beautified' ? true : false,
        weeklyGeneral:
          weeklyNewsletter && newsletterFormat === 'general' ? true : false,
        weeklyBeautified:
          weeklyNewsletter && newsletterFormat === 'beautified' ? true : false,
      })
    }
  }, [userProfile])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/auth/login')
    }
  }, [loading, firebaseUser, router])

  const handleToggle = (key: keyof NewsletterPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
    setSuccess(false)
    setError(null)
  }

  const handleSave = async () => {
    if (!firebaseUser) return

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      await updateUserProfile(firebaseUser.uid, {
        newsletterPreferences: preferences,
      })
      await refreshUserProfile()
      setSuccess(true)
    } catch {
      setError('儲存失敗，請稍後再試')
    } finally {
      setSaving(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <PageWrapper>
        <ContentWrapper>
          <LoadingWrapper>載入中...</LoadingWrapper>
        </ContentWrapper>
      </PageWrapper>
    )
  }

  // Don't render if not authenticated
  if (!firebaseUser) {
    return null
  }

  return (
    <PageWrapper>
      <ContentWrapper>
        <Sidebar>
          <SidebarList>
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.href}
                $isActive={item.href === '/member/newsletter'}
              >
                <Link href={item.href}>{item.label}</Link>
              </SidebarItem>
            ))}
          </SidebarList>
        </Sidebar>

        <MainContent>
          <MobileNav>
            {sidebarItems.map((item) => (
              <MobileNavItem
                key={item.href}
                href={item.href}
                $isActive={item.href === '/member/newsletter'}
              >
                {item.label}
              </MobileNavItem>
            ))}
          </MobileNav>

          <PageTitle>電子報</PageTitle>

          {success && <SuccessMessage>電子報訂閱設定已更新</SuccessMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <NewsletterList>
            {newsletterOptions.map((option) => (
              <NewsletterItem key={option.key}>
                <NewsletterLabel>{option.label}</NewsletterLabel>
                <ToggleWrapper>
                  <ToggleInput
                    type="checkbox"
                    checked={preferences[option.key]}
                    onChange={() => handleToggle(option.key)}
                    disabled={saving}
                  />
                  <ToggleSlider />
                </ToggleWrapper>
              </NewsletterItem>
            ))}
          </NewsletterList>

          <SaveButton onClick={handleSave} disabled={saving}>
            {saving ? '儲存中...' : '儲存'}
          </SaveButton>
        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  )
}

MemberNewsletterPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutGeneral
      title="電子報 - 環境資訊中心"
      description="管理您的電子報訂閱設定"
    >
      {page}
    </LayoutGeneral>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  setCacheControl(res)

  return {
    props: {},
  }
}

export default MemberNewsletterPage
