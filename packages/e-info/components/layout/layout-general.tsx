import styled from 'styled-components'

import { SITE_TITLE } from '~/constants/constant'
import { type BreadcrumbItem, buildBreadcrumb } from '~/utils/json-ld'

import CustomHead from './custom-head'
import Header from './header/header'
import JsonLd from './json-ld'

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
  /** Site-relative path for canonical / og:url (e.g. `/category/7?page=2`) */
  path?: string
  /** Trail ending at the current page; rendered as BreadcrumbList JSON-LD */
  breadcrumbs?: BreadcrumbItem[]
  children: React.ReactNode
  onCompleteReadingHandle?: () => void
}

export default function LayoutGeneral({
  children,
  title,
  description,
  imageUrl,
  path,
  breadcrumbs,
  onCompleteReadingHandle,
}: LayoutProps) {
  const pageTitle = title ? `${title} - ${SITE_TITLE}` : title

  return (
    <LayoutWrapper>
      <CustomHead
        title={pageTitle}
        description={description}
        imageUrl={imageUrl}
        path={path}
      ></CustomHead>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <JsonLd id="breadcrumb" data={buildBreadcrumb(breadcrumbs)} />
      )}
      <Header />
      <Main>{children}</Main>
    </LayoutWrapper>
  )
}
