// 搜尋頁
import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Script from 'next/script'
import type { FormEvent, ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import LayoutGeneral from '~/components/layout/layout-general'
import SectionHeading from '~/components/shared/section-heading'
import { GOOGLE_CSE_ID } from '~/constants/environment-variables'
import type { HeaderContextData } from '~/contexts/header-context'
import type { NextPageWithLayout } from '~/pages/_app'
import { setCacheControl } from '~/utils/common'
import { fetchHeaderData } from '~/utils/header-data'

const SearchBar = styled.form`
  display: flex;
  justify-content: center;
  margin: 20px 0 24px;
  gap: 12px;

  ${({ theme }) => theme.breakpoint.xl} {
    justify-content: flex-start;
    margin: 32px 0 40px;
  }
`

const SearchInput = styled.input`
  flex: 1;
  max-width: 426px;
  height: 32px;
  padding: 0 12px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  border: 1px solid ${({ theme }) => theme.colors.grayscale[40]};

  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[20]};
  }
`

const SearchButton = styled.button`
  width: 56px;
  height: 32px;
  padding: 2.5px 10px;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[95]};
  background-color: ${({ theme }) => theme.colors.primary[20]};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[0]};
  }
`

const SearchWrapper = styled.div`
  padding: 20px 20px 24px;

  ${({ theme }) => theme.breakpoint.sm} {
    padding: 20px 20px 48px;
  }
  ${({ theme }) => theme.breakpoint.md} {
    padding: 20px 48px 48px;
  }

  ${({ theme }) => theme.breakpoint.lg} {
    padding: 20px 72px 0px;
    max-width: 1240px;
    margin: auto;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 40px 72px 0px;
  }
`

const SearchResultsWrapper = styled.div`
  max-width: 1240px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoint.lg} {
    padding: 0 52px 0;
  }
`

const CSE_ELEMENT_NAME = 'eic-search'

type GoogleCSEElement = {
  execute: (query: string) => void
}

type GoogleCSEApi = {
  search?: {
    cse?: {
      element?: {
        getElement: (name: string) => GoogleCSEElement | null
        go: (container?: Element | string) => void
      }
    }
  }
}

type PageProps = {
  headerData: HeaderContextData
}

const Search: NextPageWithLayout<PageProps> = () => {
  const router = useRouter()
  const sectionTitle = '搜尋結果'
  const [query, setQuery] = useState('')
  const [cseReady, setCseReady] = useState(false)

  const getGoogle = () => (window as never as { google?: GoogleCSEApi }).google

  const executeSearch = useCallback((searchQuery: string) => {
    const tryExecute = (retries = 10) => {
      const element =
        getGoogle()?.search?.cse?.element?.getElement(CSE_ELEMENT_NAME)
      if (element) {
        element.execute(searchQuery)
      } else if (retries > 0) {
        setTimeout(() => tryExecute(retries - 1), 200)
      }
    }
    tryExecute()
  }, [])

  // On mount: if CSE script was already loaded (SPA re-visit),
  // call go() to re-scan DOM for the new gcse-* element
  useEffect(() => {
    const google = getGoogle()
    if (google?.search?.cse?.element) {
      google.search.cse.element.go()
      setCseReady(true)
    }
  }, [])

  // Execute search when query and CSE are both ready
  useEffect(() => {
    const q = router.query.q
    if (typeof q === 'string') {
      setQuery(q)
      if (cseReady) {
        executeSearch(q)
      }
    }
  }, [router.query.q, cseReady, executeSearch])

  // Handle first-time script load
  const handleCseReady = () => {
    setCseReady(true)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(
        { pathname: '/search', query: { q: query.trim() } },
        undefined,
        { shallow: true }
      )
    }
  }

  return (
    <>
      <SearchWrapper aria-label={sectionTitle}>
        <SectionHeading title={sectionTitle} showBorder={false} />

        <SearchBar onSubmit={handleSubmit}>
          <SearchInput
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="輸入關鍵字搜尋"
          />
          <SearchButton type="submit">搜尋</SearchButton>
        </SearchBar>
      </SearchWrapper>
      <Script
        src={`https://cse.google.com/cse.js?cx=${GOOGLE_CSE_ID}`}
        strategy="afterInteractive"
        onReady={handleCseReady}
      />
      <SearchResultsWrapper>
        <div
          className="gcse-searchresults-only"
          data-gname={CSE_ELEMENT_NAME}
        />
      </SearchResultsWrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  res,
}) => {
  setCacheControl(res)

  const headerData = await fetchHeaderData()

  return {
    props: {
      headerData,
    },
  }
}

Search.getLayout = function getLayout(page: ReactElement<PageProps>) {
  const ogTitle = '搜尋'

  return <LayoutGeneral title={ogTitle}>{page}</LayoutGeneral>
}

export default Search
