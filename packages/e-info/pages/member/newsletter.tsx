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
`

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  margin: 0 0 16px;
  text-align: left;
`

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[20]};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[40]};
  }
`

const RadioInput = styled.input`
  width: 20px;
  height: 20px;
  accent-color: ${({ theme }) => theme.colors.primary[40]};
  cursor: pointer;
  flex-shrink: 0;
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

// Newsletter subscription options matching CMS schema
type NewsletterSubscription = 'none' | 'standard' | 'beautified'
type NewsletterFrequency = 'weekday' | 'saturday' | 'both'

const subscriptionOptions: { value: NewsletterSubscription; label: string }[] =
  [
    { value: 'none', label: '未訂閱' },
    { value: 'standard', label: '一般版' },
    { value: 'beautified', label: '美化版' },
  ]

const frequencyOptions: { value: NewsletterFrequency; label: string }[] = [
  { value: 'weekday', label: '每個工作日' },
  { value: 'saturday', label: '每週六' },
  { value: 'both', label: '兩者都有' },
]

const MemberNewsletterPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { firebaseUser, member, loading, refreshMember } = useAuth()

  const [subscription, setSubscription] =
    useState<NewsletterSubscription>('none')
  const [frequency, setFrequency] = useState<NewsletterFrequency>('weekday')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize from member profile
  useEffect(() => {
    if (member) {
      setSubscription(
        (member.newsletterSubscription as NewsletterSubscription) || 'none'
      )
      setFrequency(
        (member.newsletterFrequency as NewsletterFrequency) || 'weekday'
      )
    }
  }, [member])

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
      await updateMemberById(member.id, {
        newsletterSubscription: subscription,
        newsletterFrequency: frequency,
      })
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
            <SectionTitle>訂閱版本</SectionTitle>
            <RadioGroup>
              {subscriptionOptions.map((option) => (
                <RadioLabel key={option.value}>
                  <RadioInput
                    type="radio"
                    name="subscription"
                    value={option.value}
                    checked={subscription === option.value}
                    onChange={(e) =>
                      setSubscription(e.target.value as NewsletterSubscription)
                    }
                    disabled={saving}
                  />
                  {option.label}
                </RadioLabel>
              ))}
            </RadioGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>訂閱頻率</SectionTitle>
            <RadioGroup>
              {frequencyOptions.map((option) => (
                <RadioLabel key={option.value}>
                  <RadioInput
                    type="radio"
                    name="frequency"
                    value={option.value}
                    checked={frequency === option.value}
                    onChange={(e) =>
                      setFrequency(e.target.value as NewsletterFrequency)
                    }
                    disabled={saving || subscription === 'none'}
                  />
                  {option.label}
                </RadioLabel>
              ))}
            </RadioGroup>
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

  return {
    props: {},
  }
}

export default MemberNewsletterPage
