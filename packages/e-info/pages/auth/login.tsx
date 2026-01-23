import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import SocialLoginButtons from '~/components/auth/social-login-buttons'
import LayoutGeneral from '~/components/layout/layout-general'
import { useAuth } from '~/hooks/useAuth'
import type { NextPageWithLayout } from '~/pages/_app'
import { setCacheControl } from '~/utils/common'
import { fetchHeaderData } from '~/utils/header-data'

const PageWrapper = styled.div`
  background-color: #ffffff;
  min-height: 100vh;
`

const ContentWrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 60px 20px 80px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 80px 20px 100px;
  }
`

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[20]};
  text-align: center;
  margin: 0 0 32px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 24px;
    margin-bottom: 40px;
  }
`

const SocialSection = styled.div`
  margin-bottom: 24px;
`

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
`

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.grayscale[80]};
`

const DividerText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grayscale[60]};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  background-color: ${({ theme }) => theme.colors.grayscale[99]};
  border: 1px solid ${({ theme }) => theme.colors.grayscale[80]};
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[20]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.grayscale[60]};
  }
`

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  color: white;
  background-color: ${({ theme }) => theme.colors.primary[40]};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[0]};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.grayscale[60]};
    cursor: not-allowed;
  }
`

const ForgotPassword = styled.a`
  display: block;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  text-decoration: none;
  margin-top: 8px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[20]};
    text-decoration: underline;
  }
`

const TermsText = styled.p`
  font-size: 12px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.grayscale[60]};
  text-align: center;
  margin-top: 24px;
`

const TermsLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary[20]};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const ErrorMessage = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.error.d};
  text-align: center;
  margin-bottom: 16px;
`

const LoginPage: NextPageWithLayout = () => {
  const router = useRouter()
  const {
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    checkEmailExists,
    sendPasswordReset,
    error,
    clearError,
    needsRegistration,
  } = useAuth()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentProvider, setCurrentProvider] = useState<string | null>(null)

  // Redirect to registration when needsRegistration becomes true
  useEffect(() => {
    if (needsRegistration && currentProvider) {
      router.push(`/auth/register?provider=${currentProvider}`)
    }
  }, [needsRegistration, currentProvider, router])

  const handleSocialLogin = async (
    loginFn: () => Promise<boolean>,
    provider: string
  ) => {
    setLoading(true)
    clearError()
    setCurrentProvider(provider)

    try {
      const success = await loginFn()
      if (success) {
        // Login successful, redirect to success page
        router.push('/auth/login-result?success=true')
      }
      // If not success and needsRegistration is true, useEffect will handle redirect
      // If error occurred (e.g., user closed popup), error will be shown on page
    } catch {
      // Error is handled in context
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    clearError()

    try {
      const exists = await checkEmailExists(email)
      if (exists) {
        // User exists, go to password page
        router.push(`/auth/password?email=${encodeURIComponent(email)}`)
      } else {
        // User doesn't exist, go to registration
        router.push(`/auth/register?email=${encodeURIComponent(email)}`)
      }
    } catch {
      // Error is handled in context
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      alert('請先輸入 Email')
      return
    }

    setLoading(true)
    const success = await sendPasswordReset(email)
    setLoading(false)

    if (success) {
      alert('密碼重設郵件已發送，請檢查您的信箱')
    }
  }

  return (
    <PageWrapper>
      <ContentWrapper>
        <Title>登入/創建帳號</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SocialSection>
          <SocialLoginButtons
            onFacebookClick={() =>
              handleSocialLogin(signInWithFacebook, 'facebook')
            }
            onGoogleClick={() => handleSocialLogin(signInWithGoogle, 'google')}
            onAppleClick={() => handleSocialLogin(signInWithApple, 'apple')}
            loading={loading}
          />
        </SocialSection>

        <Divider>
          <DividerLine />
          <DividerText>或</DividerText>
          <DividerLine />
        </Divider>

        <Form onSubmit={handleEmailSubmit}>
          <Input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <SubmitButton type="submit" disabled={loading || !email.trim()}>
            下一步
          </SubmitButton>
        </Form>

        <ForgotPassword onClick={handleForgotPassword}>忘記密碼</ForgotPassword>

        <TermsText>
          繼續使用代表您同意接受《
          <TermsLink href="/privacy">隱私權政策</TermsLink>》
        </TermsText>
      </ContentWrapper>
    </PageWrapper>
  )
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutGeneral
      title="登入/創建帳號 - 環境資訊中心"
      description="登入或創建環境資訊中心帳號"
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

export default LoginPage
