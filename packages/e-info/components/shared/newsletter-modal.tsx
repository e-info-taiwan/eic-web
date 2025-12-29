import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

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
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px 24px;
  position: relative;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 40px 48px;
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
  margin: 0 0 24px;
`

// Checkbox group
const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`

// Main checkbox item (Daily / Weekly)
const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
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
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid
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

// Checkbox label text
const CheckboxLabel = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary[40]};
`

// Sub-option container (for beautified version)
const SubOptionContainer = styled.div`
  margin-left: 36px;
  margin-top: 8px;
`

// Orange checkbox for beautified version
const OrangeCheckboxIcon = styled.span<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid ${({ $checked }) => ($checked ? '#e8a66c' : '#ccc')};
  background-color: ${({ $checked }) => ($checked ? '#fdecd8' : 'transparent')};
  transition: all 0.2s ease;
  flex-shrink: 0;

  &::after {
    content: '';
    display: ${({ $checked }) => ($checked ? 'block' : 'none')};
    width: 5px;
    height: 8px;
    border: solid #e8a66c;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    margin-top: -2px;
  }
`

const SubCheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`

const SubCheckboxLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grayscale[20]};
`

const InfoLink = styled.a`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary[40]};
  text-decoration: none;
  margin-left: 4px;

  &:hover {
    text-decoration: underline;
  }
`

// Info box for beautified version explanation
const InfoBox = styled.div`
  background-color: #fdecd8;
  border-radius: 8px;
  padding: 16px;
  margin-top: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  text-align: center;
`

// Form section
const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.grayscale[80]};
  border-radius: 8px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[40]};
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
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
  display: block;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.primary[40]};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
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

const NewsletterModal = ({ isOpen, onClose }: NewsletterModalProps) => {
  const [dailyChecked, setDailyChecked] = useState(false)
  const [weeklyChecked, setWeeklyChecked] = useState(false)
  const [beautifiedChecked, setBeautifiedChecked] = useState(false)
  const [showBeautifiedInfo, setShowBeautifiedInfo] = useState(false)
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

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
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleSubmit = () => {
    // TODO: Implement actual subscription logic
    console.log('Subscribe:', {
      daily: dailyChecked,
      weekly: weeklyChecked,
      beautified: beautifiedChecked,
      email,
      confirmEmail,
    })
    setIsSubmitted(true)
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

            <CheckboxGroup>
              {/* Daily newsletter option */}
              <CheckboxItem>
                <HiddenCheckbox
                  type="checkbox"
                  checked={dailyChecked}
                  onChange={(e) => setDailyChecked(e.target.checked)}
                />
                <CheckboxIcon $checked={dailyChecked} />
                <CheckboxLabel>訂閱《環境資訊電子報》每日報</CheckboxLabel>
              </CheckboxItem>

              {/* Weekly newsletter option */}
              <CheckboxItem>
                <HiddenCheckbox
                  type="checkbox"
                  checked={weeklyChecked}
                  onChange={(e) => setWeeklyChecked(e.target.checked)}
                />
                <CheckboxIcon $checked={weeklyChecked} />
                <CheckboxLabel>訂閱《環境資訊電子報一週回顧》</CheckboxLabel>
              </CheckboxItem>

              {/* Beautified version sub-option (shown when any newsletter is checked) */}
              {(dailyChecked || weeklyChecked) && (
                <SubOptionContainer>
                  <SubCheckboxItem>
                    <HiddenCheckbox
                      type="checkbox"
                      checked={beautifiedChecked}
                      onChange={(e) => setBeautifiedChecked(e.target.checked)}
                    />
                    <OrangeCheckboxIcon $checked={beautifiedChecked} />
                    <SubCheckboxLabel>訂閱美化版</SubCheckboxLabel>
                    <InfoLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setShowBeautifiedInfo(!showBeautifiedInfo)
                      }}
                    >
                      （什麼是美化版）
                    </InfoLink>
                  </SubCheckboxItem>

                  {showBeautifiedInfo && (
                    <InfoBox>
                      美化版可放大重要資訊字體，帶來更友善的閱讀體驗
                    </InfoBox>
                  )}
                </SubOptionContainer>
              )}
            </CheckboxGroup>

            <FormSection>
              <Input
                type="email"
                placeholder="請輸入 Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputLabel>請再輸入一次</InputLabel>
              <Input
                type="email"
                placeholder="請再輸入一次 Email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
            </FormSection>

            <SubmitButton
              onClick={handleSubmit}
              disabled={!email || !confirmEmail || email !== confirmEmail}
            >
              訂閱
            </SubmitButton>
          </>
        )}
      </ModalContainer>
    </Overlay>
  )

  return createPortal(modalContent, document.body)
}

export default NewsletterModal
