import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import LayoutGeneral from '~/components/layout/layout-general'
import { useAuth } from '~/hooks/useAuth'
import { updateMemberById } from '~/lib/graphql/member'
import type { NextPageWithLayout } from '~/pages/_app'
import { setCacheControl } from '~/utils/common'
import { fetchHeaderData } from '~/utils/header-data'

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
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale[95]};

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

const FormSection = styled.div`
  margin-bottom: 32px;
  max-width: 344px;
`

const ToggleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
`

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`

const ToggleLabel = styled.span`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  color: #000;
`

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  flex-shrink: 0;
`

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${({ theme }) => theme.colors.primary[40]};
    border-color: ${({ theme }) => theme.colors.primary[40]};
  }

  &:checked + span:before {
    transform: translateX(22px);
    background-color: white;
  }

  &:disabled + span {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  border: 2px solid ${({ theme }) => theme.colors.primary[40]};
  transition: 0.3s;
  border-radius: 26px;

  &:before {
    position: absolute;
    content: '';
    height: 18px;
    width: 18px;
    left: 2px;
    bottom: 2px;
    background-color: ${({ theme }) => theme.colors.primary[40]};
    transition: 0.3s;
    border-radius: 50%;
  }
`

const SaveButton = styled.button`
  padding: 6px 10px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[100]};
  background-color: ${({ theme }) => theme.colors.grayscale[80]};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.grayscale[60]};
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

// Newsletter toggle options
type NewsletterToggles = {
  dailyStandard: boolean
  dailyBeautified: boolean
  weeklyStandard: boolean
  weeklyBeautified: boolean
}

const defaultToggles: NewsletterToggles = {
  dailyStandard: false,
  dailyBeautified: false,
  weeklyStandard: false,
  weeklyBeautified: false,
}

const newsletterOptions = [
  {
    key: 'dailyStandard' as const,
    label: '《環境資訊電子報》每日報（一般版）',
  },
  {
    key: 'dailyBeautified' as const,
    label: '《環境資訊電子報》每日報（美化版）',
  },
  {
    key: 'weeklyStandard' as const,
    label: '《環境資訊電子報一週回顧》（一般版）',
  },
  {
    key: 'weeklyBeautified' as const,
    label: '《環境資訊電子報一週回顧》（美化版）',
  },
]

/**
 * TODO: 這是臨時的前端轉換 workaround
 *
 * 目前後端 Member schema 只有兩個欄位：
 * - newsletterSubscription: 'none' | 'standard' | 'beautified'
 * - newsletterFrequency: 'weekday' | 'saturday' | 'both'
 *
 * 但 UI 需要 4 個獨立的 toggle，所以用前端轉換來對應。
 *
 * 限制：無法同時訂閱「每日報一般版」和「一週回顧美化版」這種組合，
 * 因為只有一個 subscription 欄位。美化版會覆蓋一般版。
 *
 * 理想解法：請後端新增 4 個 boolean 欄位：
 * - dailyStandard
 * - dailyBeautified
 * - weeklyStandard
 * - weeklyBeautified
 */

// Convert from backend schema (subscription + frequency) to toggles
const convertToToggles = (
  subscription: string | null,
  frequency: string | null
): NewsletterToggles => {
  const isStandard = subscription === 'standard'
  const isBeautified = subscription === 'beautified'
  const isWeekday = frequency === 'weekday' || frequency === 'both'
  const isSaturday = frequency === 'saturday' || frequency === 'both'

  return {
    dailyStandard: isStandard && isWeekday,
    dailyBeautified: isBeautified && isWeekday,
    weeklyStandard: isStandard && isSaturday,
    weeklyBeautified: isBeautified && isSaturday,
  }
}

// Convert from toggles to backend schema
const convertFromToggles = (
  toggles: NewsletterToggles
): { newsletterSubscription: string; newsletterFrequency: string } => {
  const hasDaily = toggles.dailyStandard || toggles.dailyBeautified
  const hasWeekly = toggles.weeklyStandard || toggles.weeklyBeautified
  const hasStandard = toggles.dailyStandard || toggles.weeklyStandard
  const hasBeautified = toggles.dailyBeautified || toggles.weeklyBeautified

  // Determine subscription type (beautified takes priority)
  let subscription = 'none'
  if (hasBeautified) {
    subscription = 'beautified'
  } else if (hasStandard) {
    subscription = 'standard'
  }

  // Determine frequency
  let frequency = 'weekday'
  if (hasDaily && hasWeekly) {
    frequency = 'both'
  } else if (hasWeekly) {
    frequency = 'saturday'
  } else if (hasDaily) {
    frequency = 'weekday'
  }

  return {
    newsletterSubscription: subscription,
    newsletterFrequency: frequency,
  }
}

const MemberNewsletterPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { firebaseUser, member, loading, refreshMember } = useAuth()

  const [toggles, setToggles] = useState<NewsletterToggles>(defaultToggles)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize from member profile (convert from backend schema)
  useEffect(() => {
    if (member) {
      setToggles(
        convertToToggles(
          member.newsletterSubscription,
          member.newsletterFrequency
        )
      )
    }
  }, [member])

  const handleToggle = (key: keyof NewsletterToggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/auth/login')
    }
  }, [loading, firebaseUser, router])

  const handleSave = async () => {
    if (!firebaseUser || !member) return

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // Convert toggles back to backend schema
      const backendData = convertFromToggles(toggles)
      await updateMemberById(member.id, backendData)
      await refreshMember()
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

          <FormSection>
            <ToggleGroup>
              {newsletterOptions.map((option) => (
                <ToggleRow key={option.key}>
                  <ToggleLabel>{option.label}</ToggleLabel>
                  <ToggleSwitch>
                    <ToggleInput
                      type="checkbox"
                      checked={toggles[option.key]}
                      onChange={() => handleToggle(option.key)}
                      disabled={saving}
                    />
                    <ToggleSlider />
                  </ToggleSwitch>
                </ToggleRow>
              ))}
            </ToggleGroup>
          </FormSection>

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
    <LayoutGeneral title="電子報" description="管理您的電子報訂閱設定">
      {page}
    </LayoutGeneral>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  setCacheControl(res)

  const headerData = await fetchHeaderData()

  return {
    props: {
      headerData,
    },
  }
}

export default MemberNewsletterPage
