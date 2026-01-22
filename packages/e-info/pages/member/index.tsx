import type { GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useEffect } from 'react'
import styled from 'styled-components'

import LayoutGeneral from '~/components/layout/layout-general'
import { useAuth } from '~/hooks/useAuth'
import { getMemberAvatarUrl, getMemberDisplayName } from '~/lib/graphql/member'
import type { NextPageWithLayout } from '~/pages/_app'
import { setCacheControl } from '~/utils/common'
import { getGravatarUrl } from '~/utils/gravatar'
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
  margin-bottom: 32px;

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

const ProfileSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${({ theme }) => theme.breakpoint.md} {
    align-items: flex-start;
  }
`

const UserName = styled.h2`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[40]};
  margin: 0 0 16px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 20px;
    margin-bottom: 20px;
  }
`

const AvatarWrapper = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 24px;
  background-color: ${({ theme }) => theme.colors.grayscale[95]};

  ${({ theme }) => theme.breakpoint.md} {
    width: 150px;
    height: 150px;
  }
`

const AvatarImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const InfoList = styled.dl`
  margin: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const InfoItem = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;

  ${({ theme }) => theme.breakpoint.md} {
    justify-content: flex-start;
  }
`

const InfoLabel = styled.dt`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
`

const InfoValue = styled.dd`
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  margin: 0;
`

const EditButton = styled(Link)`
  display: inline-block;
  padding: 6px 10px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[100]};
  background-color: ${({ theme }) => theme.colors.primary[40]};
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[20]};
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

const MemberProfilePage: NextPageWithLayout = () => {
  const router = useRouter()
  const { firebaseUser, member, loading } = useAuth()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/auth/login')
    }
  }, [loading, firebaseUser, router])

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

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(date.getDate()).padStart(2, '0')}`
  }

  const displayName = member
    ? getMemberDisplayName(member)
    : firebaseUser.displayName || '會員'
  const email = member?.email || firebaseUser.email || '-'
  const createdAt = member?.createdAt
  const avatarUrl =
    getMemberAvatarUrl(member) ||
    getGravatarUrl(member?.email || firebaseUser.email, 150)

  return (
    <PageWrapper>
      <ContentWrapper>
        <Sidebar>
          <SidebarList>
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.href}
                $isActive={router.pathname === item.href}
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
                $isActive={router.pathname === item.href}
              >
                {item.label}
              </MobileNavItem>
            ))}
          </MobileNav>

          <PageTitle>個人資料</PageTitle>

          <ProfileSection>
            <UserName>{displayName}</UserName>

            <AvatarWrapper>
              <AvatarImage
                src={avatarUrl}
                alt={displayName}
                width={150}
                height={150}
                unoptimized
              />
            </AvatarWrapper>

            <InfoList>
              <InfoItem>
                <InfoLabel>帳號</InfoLabel>
                <InfoValue>{email}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>加入日期</InfoLabel>
                <InfoValue>{formatDate(createdAt)}</InfoValue>
              </InfoItem>
            </InfoList>

            <EditButton href="/member/edit">編輯個人資料</EditButton>
          </ProfileSection>
        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  )
}

MemberProfilePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutGeneral title="個人資料" description="管理您的環境資訊中心帳號">
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

export default MemberProfilePage
