import { createContext, useContext } from 'react'

import type {
  HeaderNavSection,
  HeaderNavTag,
  HeaderNavTopic,
  NewsBarPick,
  SiteConfig,
} from '~/graphql/query/section'

// Header data type shared between server and client
export type HeaderContextData = {
  sections: HeaderNavSection[]
  featuredTags: HeaderNavTag[]
  topics: HeaderNavTopic[]
  newsBarPicks: NewsBarPick[]
  siteConfigs: SiteConfig[]
}

// Default empty data
const defaultHeaderData: HeaderContextData = {
  sections: [],
  featuredTags: [],
  topics: [],
  newsBarPicks: [],
  siteConfigs: [],
}

// Create context with default empty values
const HeaderContext = createContext<HeaderContextData>(defaultHeaderData)

// Provider component
type HeaderProviderProps = {
  children: React.ReactNode
  data?: HeaderContextData
}

export const HeaderProvider = ({ children, data }: HeaderProviderProps) => (
  <HeaderContext.Provider value={data || defaultHeaderData}>
    {children}
  </HeaderContext.Provider>
)

// Hook to access header data
export const useHeaderData = () => useContext(HeaderContext)

// Export default data for fallback
export { defaultHeaderData }
