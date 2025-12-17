import styled from 'styled-components'

const IndicatorWrapper = styled.div<{
  $status: 'valid' | 'invalid' | 'neutral'
}>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ $status, theme }) => {
    switch ($status) {
      case 'valid':
        return theme.colors.primary[20]
      case 'invalid':
        return theme.colors.error.d
      default:
        return theme.colors.grayscale[60]
    }
  }};
`

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
    <path d="M5.5 10.5L2 7l1-1 2.5 2.5L11 3l1 1-6.5 6.5z" />
  </svg>
)

const CrossIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
    <path d="M11 4l-1-1-3 3-3-3-1 1 3 3-3 3 1 1 3-3 3 3 1-1-3-3 3-3z" />
  </svg>
)

type ValidationIndicatorProps = {
  isValid: boolean | null
  message: string
  errorMessage?: string
}

const ValidationIndicator = ({
  isValid,
  message,
  errorMessage,
}: ValidationIndicatorProps) => {
  const status = isValid === null ? 'neutral' : isValid ? 'valid' : 'invalid'
  const displayMessage =
    isValid === false && errorMessage ? errorMessage : message

  return (
    <IndicatorWrapper $status={status}>
      {isValid === true && <CheckIcon />}
      {isValid === false && <CrossIcon />}
      {isValid === null && <CheckIcon />}
      {displayMessage}
    </IndicatorWrapper>
  )
}

export default ValidationIndicator
