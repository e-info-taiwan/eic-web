import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import LayoutGeneral from '~/components/layout/layout-general'
import { MAX_CONTENT_WIDTH } from '~/constants/layout'
import { useAuth } from '~/hooks/useAuth'
import type {
  Member,
  NewsletterType,
  SubscriptionInput,
} from '~/lib/graphql/member'
import { updateMemberSubscriptions } from '~/lib/graphql/member'
import type { NextPageWithLayout } from '~/pages/_app'
import { setCacheControl } from '~/utils/common'
import { fetchHeaderData } from '~/utils/header-data'

const PageWrapper = styled.div`
  background-color: #ffffff;
  min-height: 100vh;
`

const ContentWrapper = styled.div`
  max-width: ${MAX_CONTENT_WIDTH};
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

const SaveButton = styled.button<{ $hasChanges: boolean }>`
  padding: 6px 10px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[100]};
  background-color: ${({ theme, $hasChanges }) =>
    $hasChanges ? theme.colors.primary[20] : theme.colors.grayscale[80]};
  border: none;
  border-radius: 4px;
  cursor: ${({ $hasChanges }) => ($hasChanges ? 'pointer' : 'not-allowed')};
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme, $hasChanges }) =>
      $hasChanges ? theme.colors.primary[0] : theme.colors.grayscale[80]};
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
  dailyStyled: boolean
  weeklyStandard: boolean
  weeklyStyled: boolean
}

const defaultToggles: NewsletterToggles = {
  dailyStandard: false,
  dailyStyled: false,
  weeklyStandard: false,
  weeklyStyled: false,
}

const newsletterOptions = [
  {
    key: 'dailyStandard' as const,
    label: '《環境資訊中心電子報》每日報（一般版）',
  },
  {
    key: 'dailyStyled' as const,
    label: '《環境資訊中心電子報》每日報（美化版）',
  },
  {
    key: 'weeklyStandard' as const,
    label: '《環境資訊中心電子報一週回顧》（一般版）',
  },
  {
    key: 'weeklyStyled' as const,
    label: '《環境資訊中心電子報一週回顧》（美化版）',
  },
]

/**
 * 電子報訂閱邏輯
 *
 * 後端使用 MemberSubscription 結構：
 * - newsletterName: 'daily' | 'weekly'
 * - newsletterType: 'standard' | 'styled'
 *
 * 群組互斥邏輯：
 * - daily 的兩個選項互斥（standard vs styled）
 * - weekly 的兩個選項互斥（standard vs styled）
 * - 但 daily 和 weekly 可以同時訂閱
 */

// Convert from member subscriptions to toggles
const convertToToggles = (member: Member | null): NewsletterToggles => {
  if (!member?.subscriptions) {
    return defaultToggles
  }

  const dailySub = member.subscriptions.find(
    (s) => s.newsletterName === 'daily'
  )
  const weeklySub = member.subscriptions.find(
    (s) => s.newsletterName === 'weekly'
  )

  return {
    dailyStandard: dailySub?.newsletterType === 'standard',
    dailyStyled: dailySub?.newsletterType === 'styled',
    weeklyStandard: weeklySub?.newsletterType === 'standard',
    weeklyStyled: weeklySub?.newsletterType === 'styled',
  }
}

// Convert from toggles to subscription input
const convertFromToggles = (toggles: NewsletterToggles): SubscriptionInput => {
  let daily: NewsletterType | null = null
  let weekly: NewsletterType | null = null

  if (toggles.dailyStandard) {
    daily = 'standard'
  } else if (toggles.dailyStyled) {
    daily = 'styled'
  }

  if (toggles.weeklyStandard) {
    weekly = 'standard'
  } else if (toggles.weeklyStyled) {
    weekly = 'styled'
  }

  return { daily, weekly }
}

const MemberNewsletterPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { firebaseUser, member, loading, refreshMember } = useAuth()

  const [toggles, setToggles] = useState<NewsletterToggles>(defaultToggles)
  const [initialToggles, setInitialToggles] =
    useState<NewsletterToggles>(defaultToggles)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if there are unsaved changes
  const hasChanges =
    toggles.dailyStandard !== initialToggles.dailyStandard ||
    toggles.dailyStyled !== initialToggles.dailyStyled ||
    toggles.weeklyStandard !== initialToggles.weeklyStandard ||
    toggles.weeklyStyled !== initialToggles.weeklyStyled

  // Initialize from member profile (convert from subscriptions)
  useEffect(() => {
    if (member) {
      const memberToggles = convertToToggles(member)
      setToggles(memberToggles)
      setInitialToggles(memberToggles)
    }
  }, [member])

  // Handle toggle with group-based mutual exclusivity
  // Daily options are exclusive to each other, weekly options are exclusive to each other
  // But daily and weekly can both be selected
  const handleToggle = (key: keyof NewsletterToggles) => {
    setToggles((prev) => {
      const isCurrentlyOn = prev[key]
      if (isCurrentlyOn) {
        // Turning off - just turn off this one
        return { ...prev, [key]: false }
      } else {
        // Turning on - turn off the other option in the same group
        const isDailyOption = key === 'dailyStandard' || key === 'dailyStyled'
        if (isDailyOption) {
          // Turn off other daily option, keep weekly options unchanged
          return {
            ...prev,
            dailyStandard: key === 'dailyStandard',
            dailyStyled: key === 'dailyStyled',
          }
        } else {
          // Turn off other weekly option, keep daily options unchanged
          return {
            ...prev,
            weeklyStandard: key === 'weeklyStandard',
            weeklyStyled: key === 'weeklyStyled',
          }
        }
      }
    })
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
      // Convert toggles to subscription input
      const subscriptionInput = convertFromToggles(toggles)
      await updateMemberSubscriptions(
        member.id,
        firebaseUser.uid,
        subscriptionInput,
        {
          syncToMailchimp: true,
          email: member.email ?? undefined,
        }
      )
      await refreshMember()
      setInitialToggles(toggles)
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

          <SaveButton
            onClick={handleSave}
            disabled={saving || !hasChanges}
            $hasChanges={hasChanges}
          >
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
