import styled from 'styled-components'

import { SITE_TITLE } from '~/constants/constant'

import CustomHead from './custom-head'
import Header from './header/header'

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  overflow: hidden;
`

type LayoutProps = {
  title?: string
  description?: string
  imageUrl?: string
  children: React.ReactNode
  onCompleteReadingHandle?: () => void
}

export default function LayoutGeneral({
  children,
  title,
  description,
  imageUrl,
  onCompleteReadingHandle,
}: LayoutProps) {
  const pageTitle = title ? `${title} - ${SITE_TITLE}` : title

  return (
    <LayoutWrapper>
      <CustomHead
        title={pageTitle}
        description={description}
        imageUrl={imageUrl}
      ></CustomHead>
      <Header />
      <Main>{children}</Main>
    </LayoutWrapper>
  )
}
