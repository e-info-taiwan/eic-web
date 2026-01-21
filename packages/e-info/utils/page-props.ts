import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'

import type { HeaderContextData } from '~/contexts/header-context'

import { fetchHeaderData } from './header-data'

// Type for props that include header data
export type WithHeaderData<P> = P & {
  headerData: HeaderContextData
}

/**
 * Higher-order function that wraps getServerSideProps to include header data
 * Usage:
 *   export const getServerSideProps = withHeaderData(async (context) => {
 *     // your existing logic
 *     return { props: { ... } }
 *   })
 */
export function withHeaderData<P extends Record<string, unknown>>(
  getServerSidePropsFunc?: (
    context: GetServerSidePropsContext
  ) => Promise<GetServerSidePropsResult<P>>
): GetServerSideProps<WithHeaderData<P>> {
  return async (context) => {
    // Fetch header data and page data in parallel
    const headerDataPromise = fetchHeaderData()
    const pageResultPromise = getServerSidePropsFunc
      ? getServerSidePropsFunc(context)
      : Promise.resolve({ props: {} as P })

    const [headerData, pageResult] = await Promise.all([
      headerDataPromise,
      pageResultPromise,
    ])

    // Handle notFound
    if (pageResult && 'notFound' in pageResult) {
      return pageResult
    }

    // Handle redirect
    if (pageResult && 'redirect' in pageResult) {
      return pageResult
    }

    // Merge header data with page props
    return {
      ...pageResult,
      props: {
        ...(pageResult as { props: P }).props,
        headerData,
      },
    }
  }
}

/**
 * Higher-order function that wraps getStaticProps to include header data
 * Usage:
 *   export const getStaticProps = withHeaderDataStatic(async (context) => {
 *     // your existing logic
 *     return { props: { ... }, revalidate: 60 }
 *   })
 */
export function withHeaderDataStatic<P extends Record<string, unknown>>(
  getStaticPropsFunc?: (
    context: GetStaticPropsContext
  ) => Promise<GetStaticPropsResult<P>>
): GetStaticProps<WithHeaderData<P>> {
  return async (context) => {
    // Fetch header data and page data in parallel
    const headerDataPromise = fetchHeaderData()
    const pageResultPromise = getStaticPropsFunc
      ? getStaticPropsFunc(context)
      : Promise.resolve({ props: {} as P })

    const [headerData, pageResult] = await Promise.all([
      headerDataPromise,
      pageResultPromise,
    ])

    // Handle notFound
    if (pageResult && 'notFound' in pageResult) {
      return pageResult
    }

    // Handle redirect
    if (pageResult && 'redirect' in pageResult) {
      return pageResult
    }

    // Merge header data with page props, preserve revalidate if present
    const result = pageResult as { props: P; revalidate?: number | boolean }
    return {
      props: {
        ...result.props,
        headerData,
      },
      ...(result.revalidate !== undefined && { revalidate: result.revalidate }),
    }
  }
}
