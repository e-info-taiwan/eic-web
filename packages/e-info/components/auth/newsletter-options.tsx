import styled from 'styled-components'

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  cursor: pointer;
`

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary[20]};
`

const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
`

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
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

const BeautifiedLink = styled.a`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary[20]};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[0]};
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
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  margin: 16px 0 0;
`

type NewsletterOptionsProps = {
  dailyNewsletter: boolean
  weeklyNewsletter: boolean
  newsletterFormat: 'general' | 'beautified'
  onDailyChange: (checked: boolean) => void
  onWeeklyChange: (checked: boolean) => void
  onFormatChange: (format: 'general' | 'beautified') => void
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
      <CheckboxGroup>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={dailyNewsletter}
            onChange={(e) => onDailyChange(e.target.checked)}
          />
          《環境資訊電子報》每日報
        </CheckboxLabel>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={weeklyNewsletter}
            onChange={(e) => onWeeklyChange(e.target.checked)}
          />
          《環境資訊電子報一週回顧》
        </CheckboxLabel>
      </CheckboxGroup>

      <FormatContainer>
        <RadioGroup>
          <RadioLabel>
            <Radio
              type="radio"
              name="newsletterFormat"
              value="general"
              checked={newsletterFormat === 'general'}
              onChange={() => onFormatChange('general')}
            />
            一般版
          </RadioLabel>
          <RadioLabel>
            <Radio
              type="radio"
              name="newsletterFormat"
              value="beautified"
              checked={newsletterFormat === 'beautified'}
              onChange={() => onFormatChange('beautified')}
            />
            美化版
          </RadioLabel>
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
