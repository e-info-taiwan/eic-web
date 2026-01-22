import Link from 'next/link'
import styled from 'styled-components'

const CardWrapper = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 320px;
`

const Title = styled.h2<{ $success: boolean }>`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  margin: 0 0 16px;
  color: ${({ $success, theme }) =>
    $success ? theme.colors.primary[20] : theme.colors.error.d};
`

const ActionButton = styled.button`
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
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
`

const StyledLink = styled(Link)`
  display: block;
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  color: white;
  background-color: ${({ theme }) => theme.colors.primary[40]};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-decoration: none;
  text-align: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[0]};
  }
`

const ErrorMessage = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  margin: 0 0 16px;
  word-break: break-word;
`

type AuthResultCardProps = {
  type: 'login' | 'register'
  success: boolean
  onRetry?: () => void
  errorMessage?: string
}

const AuthResultCard = ({
  type,
  success,
  onRetry,
  errorMessage,
}: AuthResultCardProps) => {
  if (type === 'login') {
    if (success) {
      return (
        <CardWrapper>
          <Title $success={true}>登入成功！</Title>
          <StyledLink href="/">跳轉至首頁</StyledLink>
        </CardWrapper>
      )
    } else {
      return (
        <CardWrapper>
          <Title $success={false}>登入失敗！</Title>
          <ActionButton onClick={onRetry}>重新登入</ActionButton>
        </CardWrapper>
      )
    }
  }

  // type === 'register'
  if (success) {
    return (
      <CardWrapper>
        <Title $success={true}>註冊成功！</Title>
        <StyledLink href="/member">跳轉至個人檔案</StyledLink>
      </CardWrapper>
    )
  } else {
    return (
      <CardWrapper>
        <Title $success={false}>註冊失敗！</Title>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <ActionButton onClick={onRetry}>重新註冊</ActionButton>
      </CardWrapper>
    )
  }
}

export default AuthResultCard
