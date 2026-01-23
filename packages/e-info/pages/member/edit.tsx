import SharedImage from '@readr-media/react-image'
import type { GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import LayoutGeneral from '~/components/layout/layout-general'
import { getFirebaseErrorMessage } from '~/constants/auth'
import { useAuth } from '~/hooks/useAuth'
import {
  changePasswordWithReauth,
  hasPasswordProvider,
} from '~/lib/firebase/auth'
import {
  getMemberDisplayName,
  updateMemberAvatar,
  updateMemberById,
} from '~/lib/graphql/member'
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

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;

  ${({ theme }) => theme.breakpoint.md} {
    flex-direction: row;
    align-items: flex-end;
  }
`

const AvatarWrapper = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 4px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.grayscale[95]};
`

const AvatarImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const UploadButton = styled.button`
  padding: 1.5px 10px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[100]};
  background-color: ${({ theme }) => theme.colors.grayscale[40]};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.grayscale[20]};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

const HiddenFileInput = styled.input`
  display: none;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  ${({ theme }) => theme.breakpoint.md} {
    align-items: flex-start;
  }
`

const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 400px;

  ${({ theme }) => theme.breakpoint.md} {
    max-width: none;
  }
`

const Label = styled.label`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  min-width: 70px;
  text-align: left;
  flex-shrink: 0;
`

const Input = styled.input`
  flex: 1;
  padding: 6px 12px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: #000;
  background-color: ${({ theme }) => theme.colors.grayscale[99]};
  border-radius: 4px;
  box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.05) inset;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[20]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.grayscale[60]};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.grayscale[95]};
    cursor: not-allowed;
  }

  ${({ theme }) => theme.breakpoint.md} {
    max-width: 250px;
  }
`

const StaticValue = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: #000;
`

const PasswordWrapper = styled.div`
  position: relative;
  flex: 1;

  ${({ theme }) => theme.breakpoint.md} {
    max-width: 250px;
  }
`

const PasswordInput = styled(Input)`
  width: 100%;
  padding-right: 48px;
  max-width: none;
`

const ToggleButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.grayscale[60]};

  &:hover {
    color: ${({ theme }) => theme.colors.grayscale[40]};
  }
`

const SubmitButton = styled.button`
  padding: 6px 10px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[100]};
  background-color: ${({ theme }) => theme.colors.primary[40]};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 16px;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primary[20]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ theme }) => theme.breakpoint.md} {
    align-self: flex-start;
  }
`

const ErrorMessage = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.error.d};
  text-align: center;

  ${({ theme }) => theme.breakpoint.md} {
    text-align: left;
  }
`

const SuccessMessage = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[40]};
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors.primary[95]};
  border-radius: 4px;
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

// Eye icon for showing password
const EyeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M10 4C4.5 4 1 10 1 10s3.5 6 9 6 9-6 9-6-3.5-6-9-6z" />
    <circle cx="10" cy="10" r="3" />
  </svg>
)

// Eye-off icon for hiding password
const EyeOffIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M10 4C4.5 4 1 10 1 10s3.5 6 9 6 9-6 9-6-3.5-6-9-6z" />
    <circle cx="10" cy="10" r="3" />
    <path d="M3 17L17 3" />
  </svg>
)

const sidebarItems = [
  { label: '個人資料', href: '/member' },
  { label: '電子報', href: '/member/newsletter' },
  { label: '閱讀紀錄', href: '/member/history' },
  { label: '收藏文章', href: '/member/bookmarks' },
  { label: '通知', href: '/member/notifications' },
]

type FormData = {
  displayName: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const MemberEditPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { firebaseUser, member, loading, refreshMember } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<FormData>({
    displayName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [avatarCacheBuster, setAvatarCacheBuster] = useState<number>(Date.now())

  // Initialize form data from member profile
  useEffect(() => {
    if (member) {
      setFormData((prev) => ({
        ...prev,
        displayName: getMemberDisplayName(member),
      }))
    }
  }, [member])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/auth/login')
    }
  }, [loading, firebaseUser, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firebaseUser) return

    if (!formData.displayName.trim()) {
      setError('請填寫姓名')
      return
    }

    // Validate password if user wants to change it
    const wantsToChangePassword =
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword
    if (wantsToChangePassword) {
      if (!formData.currentPassword) {
        setError('請輸入目前密碼')
        return
      }
      if (!formData.newPassword) {
        setError('請輸入新密碼')
        return
      }
      if (formData.newPassword.length < 8) {
        setError('新密碼需至少 8 位數')
        return
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('新密碼與確認密碼不一致')
        return
      }
    }

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // Update profile name if member exists
      if (member) {
        // Parse displayName into firstName and lastName
        const nameParts = formData.displayName.trim().split(/\s+/)
        const lastName = nameParts[0] || ''
        const firstName = nameParts.slice(1).join(' ') || ''

        await updateMemberById(member.id, {
          lastName,
          firstName,
        })
      }

      // Update password if provided
      if (wantsToChangePassword) {
        await changePasswordWithReauth(
          firebaseUser,
          formData.currentPassword,
          formData.newPassword
        )
      }

      await refreshMember()
      setSuccess(true)

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }))
    } catch (err: unknown) {
      const errorCode =
        err && typeof err === 'object' && 'code' in err
          ? (err as { code: string }).code
          : ''
      if (errorCode) {
        setError(getFirebaseErrorMessage(errorCode))
      } else {
        setError('更新失敗，請稍後再試')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !firebaseUser) return

    // Validate file type - only allow jpg, png, gif, webp
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('只支援 JPG、PNG、GIF、WebP 格式的圖片')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('圖片大小不可超過 5MB')
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      if (!member) {
        setError('無法取得會員資料')
        return
      }

      // Upload avatar and update member profile
      await updateMemberAvatar(member.id, file, firebaseUser.uid)

      await refreshMember()
      // Force image refresh by updating cache buster
      setAvatarCacheBuster(Date.now())
      setSuccess(true)
    } catch (err: unknown) {
      console.error('Avatar upload error:', err)
      const errorMessage =
        err instanceof Error ? err.message : '頭像上傳失敗，請稍後再試'
      setError(errorMessage)
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
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

  // Use custom avatar if available, otherwise fallback to Gravatar
  const gravatarUrl = getGravatarUrl(member?.email || firebaseUser.email, 150)
  const hasAvatar = !!member?.avatar
  // Add cache buster to force image refresh after upload
  const avatarDefaultImage = member?.avatar?.imageFile?.url
    ? `${member.avatar.imageFile.url}?t=${avatarCacheBuster}`
    : gravatarUrl

  return (
    <PageWrapper>
      <ContentWrapper>
        <Sidebar>
          <SidebarList>
            {sidebarItems.map((item) => (
              <SidebarItem key={item.href} $isActive={item.href === '/member'}>
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
                $isActive={item.href === '/member'}
              >
                {item.label}
              </MobileNavItem>
            ))}
          </MobileNav>

          <PageTitle>個人資料</PageTitle>

          <AvatarSection>
            <AvatarWrapper>
              {hasAvatar ? (
                <SharedImage
                  images={member.avatar?.resized}
                  defaultImage={avatarDefaultImage}
                  alt={formData.displayName}
                  priority={false}
                  rwd={{
                    mobile: '150px',
                    default: '150px',
                  }}
                />
              ) : (
                <AvatarImage
                  src={gravatarUrl}
                  alt={formData.displayName}
                  width={150}
                  height={150}
                  unoptimized
                />
              )}
            </AvatarWrapper>
            <UploadButton
              type="button"
              onClick={handleUploadClick}
              disabled={uploading}
            >
              {uploading ? '上傳中...' : '上傳'}
            </UploadButton>
            <HiddenFileInput
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
            />
          </AvatarSection>

          <Form onSubmit={handleSubmit}>
            <FormRow>
              <Label htmlFor="displayName">姓名</Label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                value={formData.displayName}
                onChange={handleInputChange}
                disabled={saving}
              />
            </FormRow>

            <FormRow>
              <Label>帳號</Label>
              <StaticValue>
                {member?.email || firebaseUser.email || '-'}
              </StaticValue>
            </FormRow>

            {hasPasswordProvider(firebaseUser) && (
              <>
                <FormRow>
                  <Label htmlFor="currentPassword">目前密碼</Label>
                  <PasswordWrapper>
                    <PasswordInput
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
                    <ToggleButton
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      aria-label={showCurrentPassword ? '隱藏密碼' : '顯示密碼'}
                    >
                      {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </ToggleButton>
                  </PasswordWrapper>
                </FormRow>

                <FormRow>
                  <Label htmlFor="newPassword">變更密碼</Label>
                  <PasswordWrapper>
                    <PasswordInput
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
                    <ToggleButton
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label={showNewPassword ? '隱藏密碼' : '顯示密碼'}
                    >
                      {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </ToggleButton>
                  </PasswordWrapper>
                </FormRow>

                <FormRow>
                  <Label htmlFor="confirmPassword">確認密碼</Label>
                  <PasswordWrapper>
                    <PasswordInput
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
                    <ToggleButton
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={showConfirmPassword ? '隱藏密碼' : '顯示密碼'}
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </ToggleButton>
                  </PasswordWrapper>
                </FormRow>
              </>
            )}

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>個人資料已更新</SuccessMessage>}

            <SubmitButton type="submit" disabled={saving}>
              {saving ? '更新中...' : '更新'}
            </SubmitButton>
          </Form>
        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  )
}

MemberEditPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutGeneral
      title="編輯個人資料"
      description="編輯您的環境資訊中心帳號資料"
    >
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

export default MemberEditPage
