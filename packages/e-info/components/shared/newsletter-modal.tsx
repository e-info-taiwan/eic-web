import { useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

import AuthContext from '~/contexts/auth-context'
import type { NewsletterType } from '~/lib/graphql/member'
import { updateMemberSubscriptions } from '~/lib/graphql/member'
import * as gtag from '~/utils/gtag'

// Modal overlay
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  padding: 20px;
`

// Modal container
const ModalContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  max-width: 300px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 40px 6px;
  position: relative;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 29px 14px;
  }
`

// Close button
const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.grayscale[60]};
  padding: 4px;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.grayscale[40]};
  }
`

// Title
const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[40]};
  text-align: center;
  margin: 0 0 16px;
`

// Description
const Description = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  text-align: center;
  margin-top: 12px;
`

// Checkbox group
const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`

// Main checkbox item (Daily / Weekly)
const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[20]};
  cursor: pointer;
`

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`

// Green circle checkbox icon
const CheckboxIcon = styled.span<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid
    ${({ theme, $checked }) =>
      $checked ? theme.colors.primary[40] : theme.colors.grayscale[60]};
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

// Sub-option container (for beautified version)
const FormatContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
`

// Secondary checkbox for beautified version
const SecondaryCheckboxIcon = styled.span<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid
    ${({ theme, $checked }) =>
      $checked ? theme.colors.secondary[20] : theme.colors.grayscale[60]};
  background-color: ${({ theme, $checked }) =>
    $checked ? theme.colors.secondary[20] : 'transparent'};
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

const FormatItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.25;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  cursor: pointer;
`

const InfoLink = styled.a`
  font-size: 12px;
  font-weight: 400;
  line-height: 1.25;
  color: ${({ theme }) => theme.colors.secondary[20]};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary[0]};
  }
`

const NewsletterLink = styled.a`
  display: block;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.secondary[20]};
  text-decoration: underline;
  text-align: center;
  cursor: pointer;
  margin: 12px 0;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary[0]};
  }
`

// Info box for beautified version explanation
const InfoBox = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.25;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  background-color: ${({ theme }) => theme.colors.secondary[80]};
  border: 0.5px solid ${({ theme }) => theme.colors.grayscale[80]};
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
  padding: 25.5px 4px;
  border-radius: 4px;
  margin: 8px auto 0;
  max-width: 272px;
  text-align: center;
`

// Form section
const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  margin-bottom: 24px;
`

const Input = styled.input`
  width: 100%;
  padding: 6px 10px;
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  background-color: ${({ theme }) => theme.colors.grayscale[99]};
  box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.05) inset;
  border-radius: 4px;
  text-align: center;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[20]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.grayscale[60]};
  }
`

const InputLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  text-align: center;
`

// Submit button
const SubmitButton = styled.button`
  margin: 0 auto;
  display: block;
  padding: 4px 52px;
  background-color: ${({ theme }) => theme.colors.primary[40]};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primary[20]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

// Success view styles
const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
`

const SuccessMessage = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  margin: 0 0 24px;
  text-align: center;
`

// Error message
const ErrorText = styled.p`
  font-size: 14px;
  color: #d32f2f;
  text-align: center;
  margin: 0 0 16px;
`

const ValidationError = styled.p`
  font-size: 12px;
  color: #d32f2f;
  text-align: center;
  margin: 4px 0 0;
`

const CloseButtonLarge = styled.button`
  width: 100%;
  max-width: 200px;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.primary[40]};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[20]};
  }
`

type NewsletterModalProps = {
  isOpen: boolean
  onClose: () => void
}

type SubscriptionState = 'idle' | 'loading' | 'success' | 'error'

// Email validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const NewsletterModal = ({ isOpen, onClose }: NewsletterModalProps) => {
  const { member, firebaseUser } = useContext(AuthContext)
  const [dailyChecked, setDailyChecked] = useState(false)
  const [weeklyChecked, setWeeklyChecked] = useState(false)
  const [beautifiedChecked, setBeautifiedChecked] = useState(false)
  const [showBeautifiedInfo, setShowBeautifiedInfo] = useState(false)
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [subscriptionState, setSubscriptionState] =
    useState<SubscriptionState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Validation states
  const emailFormatError = email.length > 0 && !isValidEmail(email)
  const emailMismatchError =
    email.length > 0 && confirmEmail.length > 0 && email !== confirmEmail

  // Ensure we only render portal on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset state when modal closes
  const handleClose = () => {
    setIsSubmitted(false)
    setDailyChecked(false)
    setWeeklyChecked(false)
    setBeautifiedChecked(false)
    setShowBeautifiedInfo(false)
    setEmail('')
    setConfirmEmail('')
    setSubscriptionState('idle')
    setErrorMessage('')
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleSubmit = async () => {
    // Reset error state
    setErrorMessage('')
    setSubscriptionState('loading')

    // Determine format from checkbox (styled = beautified)
    const format = beautifiedChecked ? 'styled' : 'standard'
    // For the external newsletter API, use 'daily' if daily is checked, otherwise 'weekly'
    const frequency = dailyChecked ? 'daily' : 'weekly'

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          frequency,
          format: beautifiedChecked ? 'beautified' : 'standard', // Keep old API format
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSubscriptionState('success')
        setIsSubmitted(true)

        // Track conversion in GA4
        const subscriptionType =
          dailyChecked && weeklyChecked ? 'both' : frequency
        gtag.sendConversion('newsletter_subscribe', subscriptionType)

        // Sync to member system if user is logged in
        if (member && firebaseUser) {
          try {
            // Build subscription input based on checked options
            const subscriptionInput: {
              daily?: NewsletterType | null
              weekly?: NewsletterType | null
            } = {
              daily: dailyChecked ? format : null,
              weekly: weeklyChecked ? format : null,
            }

            await updateMemberSubscriptions(
              member.id,
              firebaseUser.uid,
              subscriptionInput
            )
            console.log('[Newsletter] Member subscription synced')
          } catch (syncError) {
            // Don't fail the overall subscription if member sync fails
            console.error('[Newsletter] Member sync error:', syncError)
          }
        }
      } else {
        setSubscriptionState('error')
        setErrorMessage(data.error || '訂閱失敗，請稍後再試')
      }
    } catch (error) {
      console.error('[Newsletter] Subscription error:', error)
      setSubscriptionState('error')
      setErrorMessage('網路錯誤，請稍後再試')
    }
  }

  if (!isOpen || !mounted) return null

  const modalContent = (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer>
        <CloseButton onClick={handleClose}>&times;</CloseButton>

        {isSubmitted ? (
          // Success view
          <SuccessContainer>
            <SuccessMessage>訂閱成功！</SuccessMessage>
            <CloseButtonLarge onClick={handleClose}>關閉</CloseButtonLarge>
          </SuccessContainer>
        ) : (
          // Form view
          <>
            <Title>訂閱電子報</Title>

            <Description>
              我們是環境資訊中心，耕耘了二十多年的獨立媒體，我們相信生長在台灣的每一個人，都有權利知道這片土地發生的事情。
            </Description>

            <NewsletterLink href="/newsletter">查看所有電子報</NewsletterLink>

            <CheckboxGroup>
              {/* Daily newsletter option */}
              <CheckboxItem>
                <HiddenCheckbox
                  type="checkbox"
                  checked={dailyChecked}
                  onChange={(e) => setDailyChecked(e.target.checked)}
                />
                <CheckboxIcon $checked={dailyChecked} />
                訂閱《環境資訊電子報》每日報
              </CheckboxItem>

              {/* Weekly newsletter option */}
              <CheckboxItem>
                <HiddenCheckbox
                  type="checkbox"
                  checked={weeklyChecked}
                  onChange={(e) => setWeeklyChecked(e.target.checked)}
                />
                <CheckboxIcon $checked={weeklyChecked} />
                訂閱《環境資訊電子報一週回顧》
              </CheckboxItem>
            </CheckboxGroup>

            {/* Beautified version sub-option (shown when any newsletter is checked) */}
            {(dailyChecked || weeklyChecked) && (
              <>
                <FormatContainer>
                  <FormatItem>
                    <HiddenCheckbox
                      type="checkbox"
                      checked={beautifiedChecked}
                      onChange={(e) => setBeautifiedChecked(e.target.checked)}
                    />
                    <SecondaryCheckboxIcon $checked={beautifiedChecked} />
                    訂閱美化版
                  </FormatItem>
                  <InfoLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowBeautifiedInfo(!showBeautifiedInfo)
                    }}
                  >
                    （什麼是美化版）
                  </InfoLink>
                </FormatContainer>

                {showBeautifiedInfo && (
                  <InfoBox>
                    美化版可放大重要資訊字體，帶來更友善的閱讀體驗
                  </InfoBox>
                )}
              </>
            )}

            <FormSection>
              <Input
                type="email"
                placeholder="請輸入 Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailFormatError && (
                <ValidationError>
                  您輸入的 email 無效，請重新輸入
                </ValidationError>
              )}
              <InputLabel>請再輸入一次</InputLabel>
              <Input
                type="email"
                placeholder="請再輸入一次 Email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
              {emailMismatchError && (
                <ValidationError>您輸入的 email 不一致，請確認</ValidationError>
              )}
            </FormSection>

            {subscriptionState === 'error' && errorMessage && (
              <ErrorText>{errorMessage}</ErrorText>
            )}

            <SubmitButton
              onClick={handleSubmit}
              disabled={
                !email ||
                !confirmEmail ||
                !isValidEmail(email) ||
                email !== confirmEmail ||
                (!dailyChecked && !weeklyChecked) ||
                subscriptionState === 'loading'
              }
            >
              {subscriptionState === 'loading' ? '訂閱中...' : '訂閱'}
            </SubmitButton>
          </>
        )}
      </ModalContainer>
    </Overlay>
  )

  return createPortal(modalContent, document.body)
}

export default NewsletterModal
