import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useState } from 'react'
import styled from 'styled-components'

import LayoutGeneral from '~/components/layout/layout-general'
import { useAuth } from '~/hooks/useAuth'
import type { NextPageWithLayout } from '~/pages/_app'
import { setCacheControl } from '~/utils/common'

const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.grayscale[95]};
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 320px;
`

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[20]};
  text-align: center;
  margin: 0 0 16px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const PasswordWrapper = styled.div`
  position: relative;
`

const PasswordInput = styled.input`
  width: 100%;
  padding: 12px 48px 12px 16px;
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.grayscale[80]};
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[20]};
  }
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

const ErrorMessage = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.error.d};
  text-align: center;
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

const PasswordPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { email } = router.query
  const { signInWithEmail, error, clearError } = useAuth()

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim() || !email) return

    setLoading(true)
    clearError()

    try {
      const success = await signInWithEmail(email as string, password)
      if (success) {
        router.push('/auth/login-result?success=true')
      } else {
        router.push('/auth/login-result?success=false')
      }
    } catch {
      router.push('/auth/login-result?success=false')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <Card>
        <Title>請輸入密碼</Title>

        <Form onSubmit={handleSubmit}>
          <PasswordWrapper>
            <PasswordInput
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <ToggleButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </ToggleButton>
          </PasswordWrapper>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={loading || !password.trim()}>
            登入
          </SubmitButton>
        </Form>
      </Card>
    </PageWrapper>
  )
}

PasswordPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutGeneral title="輸入密碼 - 環境資訊中心" description="輸入密碼登入">
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

export default PasswordPage
