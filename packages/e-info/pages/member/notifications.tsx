import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import LayoutGeneral from '~/components/layout/layout-general'
import { useAuth } from '~/hooks/useAuth'
import {
  type NotificationSection,
  getAllSections,
  updateMemberById,
} from '~/lib/graphql/member'
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
  margin: 0 0 16px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 24px;
    margin-bottom: 20px;
  }
`

const Description = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  margin: 0 0 24px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 32px;
  }
`

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px 32px;
  margin-bottom: 32px;
`

const CategoryItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`

const CheckboxIcon = styled.span<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid
    ${({ theme, $checked }) =>
      $checked ? theme.colors.primary[40] : theme.colors.grayscale[80]};
  background-color: ${({ theme, $checked }) =>
    $checked ? theme.colors.primary[40] : 'transparent'};
  transition: all 0.2s ease;
  flex-shrink: 0;

  &::after {
    content: '';
    display: ${({ $checked }) => ($checked ? 'block' : 'none')};
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    margin-top: -2px;
  }
`

const CategoryLabel = styled.span`
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
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

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const MemberNotificationsPage: NextPageWithLayout<PageProps> = ({
  sections,
}) => {
  const router = useRouter()
  const { firebaseUser, member, loading, refreshMember } = useAuth()

  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([])
  const [initialSectionIds, setInitialSectionIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if there are unsaved changes
  const hasChanges =
    selectedSectionIds.length !== initialSectionIds.length ||
    selectedSectionIds.some((id) => !initialSectionIds.includes(id))

  // Initialize selected sections from member's interested sections
  useEffect(() => {
    if (member?.interestedSections) {
      const sectionIds = member.interestedSections.map((section) => section.id)
      setSelectedSectionIds(sectionIds)
      setInitialSectionIds(sectionIds)
    }
  }, [member])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/auth/login')
    }
  }, [loading, firebaseUser, router])

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSectionIds((prev) => {
      if (prev.includes(sectionId)) {
        return prev.filter((id) => id !== sectionId)
      } else {
        return [...prev, sectionId]
      }
    })
    setSuccess(false)
    setError(null)
  }

  const handleSave = async () => {
    if (!firebaseUser || !member) return

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // Update member's interestedSections using set operation
      await updateMemberById(
        member.id,
        {
          interestedSections: {
            set: selectedSectionIds.map((id) => ({ id })),
          },
        },
        firebaseUser.uid
      )
      await refreshMember()
      setInitialSectionIds(selectedSectionIds)
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
                $isActive={item.href === '/member/notifications'}
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
                $isActive={item.href === '/member/notifications'}
              >
                {item.label}
              </MobileNavItem>
            ))}
          </MobileNav>

          <PageTitle>通知</PageTitle>
          <Description>
            勾選有興趣的分類，我們將在新文章刊出的時候以email 通知
          </Description>

          {success && <SuccessMessage>通知設定已更新</SuccessMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <CategoryList>
            {sections.map((section) => (
              <CategoryItem key={section.id}>
                <HiddenCheckbox
                  type="checkbox"
                  checked={selectedSectionIds.includes(section.id)}
                  onChange={() => handleSectionToggle(section.id)}
                  disabled={saving}
                />
                <CheckboxIcon
                  $checked={selectedSectionIds.includes(section.id)}
                />
                <CategoryLabel>{section.name}</CategoryLabel>
              </CategoryItem>
            ))}
          </CategoryList>

          <SaveButton
            onClick={handleSave}
            disabled={saving || !hasChanges}
            $hasChanges={hasChanges}
          >
            {saving ? '儲存中...' : '確認'}
          </SaveButton>
        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  )
}

MemberNotificationsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutGeneral title="通知" description="管理您的通知設定">
      {page}
    </LayoutGeneral>
  )
}

export const getServerSideProps: GetServerSideProps<{
  headerData: Awaited<ReturnType<typeof fetchHeaderData>>
  sections: NotificationSection[]
}> = async ({ res }) => {
  setCacheControl(res)

  const [headerData, sections] = await Promise.all([
    fetchHeaderData(),
    getAllSections(),
  ])

  return {
    props: {
      headerData,
      sections,
    },
  }
}

export default MemberNotificationsPage
