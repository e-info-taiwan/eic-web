import styled from 'styled-components'

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`

const SocialButton = styled.button<{
  $variant: 'facebook' | 'google' | 'apple'
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  border: none;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $variant }) => {
    switch ($variant) {
      case 'facebook':
        return `
          background-color: #1877f2;
          color: white;
        `
      case 'google':
        return `
          background-color: white;
          border: 1px solid #dadce0;
          color: #3c4043;
        `
      case 'apple':
        return `
          background-color: #000000;
          color: white;
        `
    }
  }}
`

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`

// Facebook Icon
const FacebookIcon = () => (
  <IconWrapper>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M18.896 0H1.104C.494 0 0 .494 0 1.104v17.792C0 19.506.494 20 1.104 20h9.58v-7.745H8.076V9.237h2.606V7.01c0-2.583 1.578-3.99 3.883-3.99 1.104 0 2.052.082 2.329.119v2.7h-1.598c-1.254 0-1.496.596-1.496 1.47v1.928h2.989l-.39 3.018h-2.6V20h5.098c.608 0 1.102-.494 1.102-1.104V1.104C20 .494 19.506 0 18.896 0z" />
    </svg>
  </IconWrapper>
)

// Google Icon
const GoogleIcon = () => (
  <IconWrapper>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M19.6 10.23c0-.68-.06-1.36-.17-2.02H10v3.83h5.38a4.6 4.6 0 01-2 3.02v2.5h3.24c1.89-1.74 2.98-4.3 2.98-7.33z"
        fill="#4285F4"
      />
      <path
        d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.23-2.51c-.9.6-2.04.96-3.4.96-2.6 0-4.8-1.76-5.6-4.12H1.07v2.6A9.99 9.99 0 0010 20z"
        fill="#34A853"
      />
      <path
        d="M4.4 11.91a5.96 5.96 0 010-3.82v-2.6H1.07a10.01 10.01 0 000 9.02l3.33-2.6z"
        fill="#FBBC05"
      />
      <path
        d="M10 3.96c1.47 0 2.79.5 3.82 1.5l2.86-2.86A9.97 9.97 0 0010 0 9.99 9.99 0 001.07 5.49l3.33 2.6c.8-2.36 3-4.13 5.6-4.13z"
        fill="#EA4335"
      />
    </svg>
  </IconWrapper>
)

// Apple Icon
const AppleIcon = () => (
  <IconWrapper>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M15.17 10.26c-.02-2.02 1.65-2.99 1.72-3.03-.94-1.37-2.4-1.56-2.92-1.58-1.24-.13-2.43.73-3.06.73-.63 0-1.6-.72-2.63-.7-1.35.02-2.6.79-3.3 2-.14.24-.27.52-.37.84-.65 2.1.16 5.13 1.66 6.8.56.64 1.23 1.36 2.1 1.33.85-.03 1.17-.55 2.2-.55 1.03 0 1.32.55 2.2.53.91-.01 1.5-.64 2.05-1.29.65-.93.91-1.83.93-1.88-.02 0-1.78-.68-1.8-2.71-.02-1.69 1.38-2.5 1.44-2.54a3.2 3.2 0 00-2.52-1.36c-.35-.04-.72-.06-1.08-.06-.36 0-.72.03-1.06.07-.16.02-.32.05-.47.09-.15.04-.3.08-.43.14-.26.1-.5.24-.7.43-.1.08-.18.18-.26.28.1-.13.17-.22.1-.13a2.22 2.22 0 00-.22.3c.1-.16.08-.12.05-.07zM12.98 3.87c.46-.56.77-1.34.69-2.12-.66.03-1.46.44-1.94 1-.43.5-.8 1.29-.7 2.05.73.06 1.49-.38 1.95-.93z" />
    </svg>
  </IconWrapper>
)

type SocialLoginButtonsProps = {
  onFacebookClick: () => void
  onGoogleClick: () => void
  onAppleClick: () => void
  loading?: boolean
}

const SocialLoginButtons = ({
  onFacebookClick,
  onGoogleClick,
  onAppleClick,
  loading = false,
}: SocialLoginButtonsProps) => {
  return (
    <ButtonsContainer>
      <SocialButton
        $variant="facebook"
        onClick={onFacebookClick}
        disabled={loading}
        type="button"
      >
        <FacebookIcon />
        Facebook
      </SocialButton>
      <SocialButton
        $variant="google"
        onClick={onGoogleClick}
        disabled={loading}
        type="button"
      >
        <GoogleIcon />
        Google
      </SocialButton>
      <SocialButton
        $variant="apple"
        onClick={onAppleClick}
        disabled={loading}
        type="button"
      >
        <AppleIcon />
        Apple
      </SocialButton>
    </ButtonsContainer>
  )
}

export default SocialLoginButtons
