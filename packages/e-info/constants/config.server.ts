// Server-only module: GraphQL endpoint URLs.
// Do NOT import from client-reachable code — browser queries go through
// the /api/graphql same-origin proxy, so these literals would only leak
// into the client bundle as dead code. Keep them out of the client build
// entirely by confining imports to API routes, getServerSideProps, and
// the typeof-window-guarded branch in apollo-client.ts.

const ENV = process.env.NEXT_PUBLIC_ENV || 'local'
const USE_MOCK_SERVER = (process.env.USE_MOCK_SERVER ?? 'false') === 'true'
const MOCK_API_SERVER_PORT = Number(process.env.MOCK_API_SERVER_PORT ?? 4000)
const IS_PREVIEW_MODE = process.env.NEXT_PUBLIC_IS_PREVIEW_MODE === 'true'

let API_ENDPOINT = ''
let PREVIEW_API_ENDPOINT = ''

switch (ENV) {
  case 'prod':
    API_ENDPOINT =
      'https://eic-info-cms-gql-prod-1090198686704.asia-east1.run.app/api/graphql'
    PREVIEW_API_ENDPOINT =
      'https://eic-info-cms-preview-prod-1090198686704.asia-east1.run.app/api/graphql'
    break
  case 'dev':
  case 'main':
    API_ENDPOINT =
      'https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql'
    PREVIEW_API_ENDPOINT =
      'https://eic-cms-preview-dev-1090198686704.asia-east1.run.app/api/graphql'
    break
  default:
    API_ENDPOINT =
      'https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql'
    PREVIEW_API_ENDPOINT =
      'https://eic-cms-preview-dev-1090198686704.asia-east1.run.app/api/graphql'
    break
}

if (USE_MOCK_SERVER) API_ENDPOINT = `http://localhost:${MOCK_API_SERVER_PORT}/`
if (IS_PREVIEW_MODE && PREVIEW_API_ENDPOINT) {
  API_ENDPOINT = PREVIEW_API_ENDPOINT
}

export { API_ENDPOINT, PREVIEW_API_ENDPOINT }
