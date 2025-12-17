import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import NewsletterOptions from '~/components/auth/newsletter-options'
import ValidationIndicator from '~/components/auth/validation-indicator'
import LayoutGeneral from '~/components/layout/layout-general'
import {
  INTERESTED_CATEGORIES,
  LOCATION_OPTIONS,
  VALIDATION_RULES,
} from '~/constants/auth'
import { useAuth } from '~/hooks/useAuth'
import { createUserProfile } from '~/lib/firebase/firestore'
import type { NextPageWithLayout } from '~/pages/_app'
import type {
  InterestedCategory,
  LocationOption,
  RegisterFormData,
  RegisterFormErrors,
  RegisterFormValidation,
} from '~/types/auth'
import { setCacheControl } from '~/utils/common'

const PageWrapper = styled.div`
  background-color: #ffffff;
  min-height: 100vh;
`

const ContentWrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 40px 20px 60px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 60px 20px 80px;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
`

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
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

  &:disabled {
    background-color: ${({ theme }) => theme.colors.grayscale[95]};
    cursor: not-allowed;
  }
`

const PasswordWrapper = styled.div`
  position: relative;
`

const PasswordInput = styled(Input)`
  padding-right: 48px;
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

const Select = styled.select`
  width: 100%;
  padding: 10px 32px 10px 14px;
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.grayscale[80]};
  border-radius: 4px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236F6F72' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[20]};
  }
`

const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
`

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  cursor: pointer;
`

const Radio = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary[20]};
`

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`

const PrimaryButton = styled.button`
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

const SecondaryButton = styled.button`
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.grayscale[80]};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.grayscale[99]};
    color: ${({ theme }) => theme.colors.grayscale[0]};
  }
`

const ErrorMessage = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.error.d};
`

const SectionLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  margin-bottom: 8px;
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

const RegisterPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { email: queryEmail, provider } = router.query
  const { firebaseUser, signUpWithEmail, error, clearError, refreshUserProfile } =
    useAuth()

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: (queryEmail as string) || '',
    password: '',
    confirmPassword: '',
    location: '',
    birthDate: '',
    interestedCategories: [],
    dailyNewsletter: false,
    weeklyNewsletter: false,
    newsletterFormat: 'general',
  })

  const [validation, setValidation] = useState<RegisterFormValidation>({
    email: null,
    password: null,
    confirmPassword: null,
  })

  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // If user came from social login, prefill email
  useEffect(() => {
    if (firebaseUser && provider) {
      setFormData((prev) => ({
        ...prev,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
      }))
    }
  }, [firebaseUser, provider])

  // Validate email format
  const validateEmail = useCallback((email: string): boolean => {
    return VALIDATION_RULES.email.pattern.test(email)
  }, [])

  // Validate password length
  const validatePassword = useCallback((password: string): boolean => {
    return password.length >= VALIDATION_RULES.password.minLength
  }, [])

  // Validate confirm password
  const validateConfirmPassword = useCallback(
    (password: string, confirmPassword: string): boolean => {
      return password === confirmPassword && confirmPassword.length > 0
    },
    []
  )

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof RegisterFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    // Real-time validation
    if (name === 'email') {
      setValidation((prev) => ({
        ...prev,
        email: value ? validateEmail(value) : null,
      }))
    } else if (name === 'password') {
      setValidation((prev) => ({
        ...prev,
        password: value ? validatePassword(value) : null,
        confirmPassword: formData.confirmPassword
          ? validateConfirmPassword(value, formData.confirmPassword)
          : null,
      }))
    } else if (name === 'confirmPassword') {
      setValidation((prev) => ({
        ...prev,
        confirmPassword: value
          ? validateConfirmPassword(formData.password, value)
          : null,
      }))
    }
  }

  // Handle category selection
  const handleCategoryChange = (category: InterestedCategory) => {
    setFormData((prev) => ({
      ...prev,
      interestedCategories: prev.interestedCategories.includes(category)
        ? prev.interestedCategories.filter((c) => c !== category)
        : [...prev.interestedCategories, category],
    }))
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = '請填寫姓名'
    }

    if (!formData.email.trim()) {
      newErrors.email = '請填寫 Email'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email 格式不正確'
    }

    // Only validate password for email signup (not social login)
    if (!provider) {
      if (!formData.password) {
        newErrors.password = '請填寫密碼'
      } else if (!validatePassword(formData.password)) {
        newErrors.password = `密碼需至少 ${VALIDATION_RULES.password.minLength} 位數`
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = '請確認密碼'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '密碼不一致'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    clearError()

    try {
      // If social login, user is already authenticated
      if (provider && firebaseUser) {
        await createUserProfile(firebaseUser.uid, formData)
        await refreshUserProfile()
        router.push('/auth/register-result?success=true')
      } else {
        // Email signup
        const success = await signUpWithEmail(formData.email, formData.password)
        if (success && firebaseUser) {
          await createUserProfile(firebaseUser.uid, formData)
          await refreshUserProfile()
          router.push('/auth/register-result?success=true')
        } else {
          router.push('/auth/register-result?success=false')
        }
      }
    } catch {
      router.push('/auth/register-result?success=false')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push('/auth/login')
  }

  return (
    <PageWrapper>
      <ContentWrapper>
        <Title>註冊成為會員</Title>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading}
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading || !!provider}
            />
            <ValidationIndicator
              isValid={validation.email}
              message={VALIDATION_RULES.email.message}
              errorMessage={VALIDATION_RULES.email.errorMessage}
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormGroup>

          {!provider && (
            <>
              <FormGroup>
                <Label htmlFor="password">密碼</Label>
                <PasswordWrapper>
                  <PasswordInput
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <ToggleButton
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </ToggleButton>
                </PasswordWrapper>
                <ValidationIndicator
                  isValid={validation.password}
                  message={VALIDATION_RULES.password.message}
                  errorMessage={VALIDATION_RULES.password.errorMessage}
                />
                {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="confirmPassword">確認密碼</Label>
                <PasswordWrapper>
                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="再輸入一次密碼"
                  />
                  <ToggleButton
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? '隱藏密碼' : '顯示密碼'}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </ToggleButton>
                </PasswordWrapper>
                <ValidationIndicator
                  isValid={validation.confirmPassword}
                  message={VALIDATION_RULES.confirmPassword.message}
                  errorMessage={VALIDATION_RULES.confirmPassword.errorMessage}
                />
                {errors.confirmPassword && (
                  <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
                )}
              </FormGroup>
            </>
          )}

          <FormGroup>
            <Label htmlFor="location">居住地</Label>
            <Select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="">請輸入居住地</option>
              {LOCATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="birthDate">出生年月日</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange}
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <SectionLabel>感興趣的分類</SectionLabel>
            <RadioGroup>
              {INTERESTED_CATEGORIES.map((category) => (
                <RadioLabel key={category.value}>
                  <Radio
                    type="checkbox"
                    checked={formData.interestedCategories.includes(
                      category.value
                    )}
                    onChange={() => handleCategoryChange(category.value)}
                    disabled={loading}
                  />
                  {category.label}
                </RadioLabel>
              ))}
            </RadioGroup>
          </FormGroup>

          <FormGroup>
            <SectionLabel>訂閱電子報</SectionLabel>
            <NewsletterOptions
              dailyNewsletter={formData.dailyNewsletter}
              weeklyNewsletter={formData.weeklyNewsletter}
              newsletterFormat={formData.newsletterFormat}
              onDailyChange={(checked) =>
                setFormData((prev) => ({ ...prev, dailyNewsletter: checked }))
              }
              onWeeklyChange={(checked) =>
                setFormData((prev) => ({ ...prev, weeklyNewsletter: checked }))
              }
              onFormatChange={(format) =>
                setFormData((prev) => ({ ...prev, newsletterFormat: format }))
              }
            />
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonGroup>
            <PrimaryButton type="submit" disabled={loading}>
              註冊會員
            </PrimaryButton>
            <SecondaryButton type="button" onClick={handleBack} disabled={loading}>
              回上一步
            </SecondaryButton>
          </ButtonGroup>
        </Form>
      </ContentWrapper>
    </PageWrapper>
  )
}

RegisterPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutGeneral
      title="註冊成為會員 - 環境資訊中心"
      description="註冊成為環境資訊中心會員"
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

export default RegisterPage
