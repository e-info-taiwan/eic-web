import { useState } from 'react'
import styled from 'styled-components'

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[20]};
  text-align: center;
`

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

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

const BeautifiedLink = styled.a`
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

const FormatContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`

const InfoText = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.25;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  background-color: ${({ theme }) => theme.colors.secondary[80]};
  border: 0.5px solid ${({ theme }) => theme.colors.grayscale[80]};
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
  padding: 4px 15.5px;
  border-radius: 4px;
  margin: 8px 0 0;
  max-width: 272px;
  text-align: center;
`

type NewsletterOptionsProps = {
  dailyNewsletter: boolean
  weeklyNewsletter: boolean
  newsletterFormat: 'general' | 'beautified'
  onDailyChange: (_checked: boolean) => void
  onWeeklyChange: (_checked: boolean) => void
  onFormatChange: (_format: 'general' | 'beautified') => void
}

const NewsletterOptions = ({
  dailyNewsletter,
  weeklyNewsletter,
  newsletterFormat,
  onDailyChange,
  onWeeklyChange,
  onFormatChange,
}: NewsletterOptionsProps) => {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <OptionsContainer>
      <SectionTitle>訂閱電子報</SectionTitle>
      <CheckboxGroup>
        <CheckboxItem>
          <HiddenCheckbox
            type="checkbox"
            checked={dailyNewsletter}
            onChange={(e) => onDailyChange(e.target.checked)}
          />
          <CheckboxIcon $checked={dailyNewsletter} />
          訂閱《環境資訊電子報》每日報
        </CheckboxItem>
        <CheckboxItem>
          <HiddenCheckbox
            type="checkbox"
            checked={weeklyNewsletter}
            onChange={(e) => onWeeklyChange(e.target.checked)}
          />
          <CheckboxIcon $checked={weeklyNewsletter} />
          訂閱《環境資訊電子報一週回顧》
        </CheckboxItem>
      </CheckboxGroup>

      {(dailyNewsletter || weeklyNewsletter) && (
        <>
          <FormatContainer>
            <FormatItem>
              <HiddenCheckbox
                type="checkbox"
                checked={newsletterFormat === 'beautified'}
                onChange={(e) =>
                  onFormatChange(e.target.checked ? 'beautified' : 'general')
                }
              />
              <SecondaryCheckboxIcon
                $checked={newsletterFormat === 'beautified'}
              />
              訂閱美化版
            </FormatItem>
            <BeautifiedLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setShowInfo(!showInfo)
              }}
            >
              （什麼是美化版）
            </BeautifiedLink>
          </FormatContainer>

          {showInfo && (
            <InfoText>美化版可放大重要資訊字體，帶來更友善的閱讀體驗</InfoText>
          )}
        </>
      )}
    </OptionsContainer>
  )
}

export default NewsletterOptions
