import styled from 'styled-components'

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: ${({ theme }) => theme.colors.grayscale[95]};
  padding: 16px;
`

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[20]};
`

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
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

const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
`

const RadioItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  cursor: pointer;
`

const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`

const RadioIcon = styled.span<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid
    ${({ theme, $checked }) =>
      $checked ? theme.colors.primary[40] : theme.colors.grayscale[60]};
  background-color: transparent;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &::after {
    content: '';
    display: ${({ $checked }) => ($checked ? 'block' : 'none')};
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary[40]};
  }
`

const BeautifiedLink = styled.a`
  font-size: 14px;
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
  gap: 8px;
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
  margin: 8px -8px -8px;
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
          《環境資訊電子報》每日報
        </CheckboxItem>
        <CheckboxItem>
          <HiddenCheckbox
            type="checkbox"
            checked={weeklyNewsletter}
            onChange={(e) => onWeeklyChange(e.target.checked)}
          />
          <CheckboxIcon $checked={weeklyNewsletter} />
          《環境資訊電子報一週回顧》
        </CheckboxItem>
      </CheckboxGroup>

      <FormatContainer>
        <RadioGroup>
          <RadioItem>
            <HiddenRadio
              type="radio"
              name="newsletterFormat"
              value="general"
              checked={newsletterFormat === 'general'}
              onChange={() => onFormatChange('general')}
            />
            <RadioIcon $checked={newsletterFormat === 'general'} />
            一般版
          </RadioItem>
          <RadioItem>
            <HiddenRadio
              type="radio"
              name="newsletterFormat"
              value="beautified"
              checked={newsletterFormat === 'beautified'}
              onChange={() => onFormatChange('beautified')}
            />
            <RadioIcon $checked={newsletterFormat === 'beautified'} />
            美化版
          </RadioItem>
        </RadioGroup>
        <BeautifiedLink
          href="#"
          onClick={(e) => {
            e.preventDefault()
            // TODO: Show beautified version info modal
            alert('什麼是美化版？（功能待實作）')
          }}
        >
          （什麼是美化版）
        </BeautifiedLink>
      </FormatContainer>

      <InfoText>
        我們是環境資訊中心，耕耘了二十多年的獨立媒體，我們相信生長在台灣的每一個人，都有權利知道這片土地發生的事情。
      </InfoText>
    </OptionsContainer>
  )
}

export default NewsletterOptions
