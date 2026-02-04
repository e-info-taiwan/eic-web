const ENV = process.env.NEXT_PUBLIC_ENV || 'local'

// 這裡管理的是在 runtime 時，可被設定的環境變數 (通常沒有 `NEXT_PUBLIC_` 作為開頭)
const USE_MOCK_SERVER = (process.env.USE_MOCK_SERVER ?? 'false') === 'true'
const MOCK_API_SERVER_PORT = Number(process.env.MOCK_API_SERVER_PORT ?? 4000)

// Mailchimp Configuration
// API Key format: <key>-<dc> where dc is the data center (e.g., us21)
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY ?? ''
// Dual Audience architecture: separate audiences for daily and weekly newsletters
const MAILCHIMP_LIST_ID_DAILY = process.env.MAILCHIMP_LIST_ID_DAILY ?? ''
const MAILCHIMP_LIST_ID_WEEKLY = process.env.MAILCHIMP_LIST_ID_WEEKLY ?? ''
// Server prefix is derived from API key (last part after hyphen) or set explicitly
const MAILCHIMP_SERVER_PREFIX =
  process.env.MAILCHIMP_SERVER_PREFIX ??
  (MAILCHIMP_API_KEY.split('-').pop() || '')

// Cloudflare Turnstile Configuration (server-side secret key)
// If not set, Turnstile verification is skipped (graceful degradation)
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY ?? ''

// Firebase Admin SDK Configuration (server-side token verification)
// If not set, Firebase verification is skipped (graceful degradation)
// Can be set via service account JSON file path or individual credentials
const FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH =
  process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH ?? ''
const FIREBASE_ADMIN_PROJECT_ID = process.env.FIREBASE_ADMIN_PROJECT_ID ?? ''
const FIREBASE_ADMIN_CLIENT_EMAIL =
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL ?? ''
// Private key needs newline handling (may come as \n literal string)
const FIREBASE_ADMIN_PRIVATE_KEY = (
  process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? ''
).replace(/\\n/g, '\n')

let API_ENDPOINT = ''
let FIREBASE_CONFIG = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
}

switch (ENV) {
  case 'prod':
    API_ENDPOINT =
      'https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql'
    FIREBASE_CONFIG = {
      apiKey: 'AIzaSyDSB9cyyI_XZ52v8F4_tEuJv6KXjo9aVag',
      authDomain: 'e-info-prod.firebaseapp.com',
      projectId: 'e-info-prod',
      storageBucket: 'e-info-prod.firebasestorage.app',
      messagingSenderId: '1077023789574',
      appId: '1:1077023789574:web:e3c98327e4e3e5250d6987',
    }
    break
  case 'staging':
    API_ENDPOINT =
      'https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql'
    FIREBASE_CONFIG = {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    }
    break
  case 'dev':
  default:
    API_ENDPOINT =
      'https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql'
    FIREBASE_CONFIG = {
      // e-info-dev
      apiKey: 'AIzaSyCEk2WxBeqiuTI6Xjh1QOkK-mpJXJlGWoc',
      authDomain: 'e-info-dev.firebaseapp.com',
      projectId: 'e-info-dev',
      storageBucket: 'e-info-dev.firebasestorage.app',
      messagingSenderId: '503550465964',
      appId: '1:503550465964:web:1f1f075c8165fb88b3cc09',
    }
    break
}

if (USE_MOCK_SERVER) API_ENDPOINT = `http://localhost:${MOCK_API_SERVER_PORT}/`

// 環境變數優先覆蓋 Firebase 設定（各欄位獨立檢查）
if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  FIREBASE_CONFIG.apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
}
if (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
  FIREBASE_CONFIG.authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
}
if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  FIREBASE_CONFIG.projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
}
if (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) {
  FIREBASE_CONFIG.storageBucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
}
if (process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) {
  FIREBASE_CONFIG.messagingSenderId =
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
}
if (process.env.NEXT_PUBLIC_FIREBASE_APP_ID) {
  FIREBASE_CONFIG.appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

export {
  API_ENDPOINT,
  FIREBASE_ADMIN_CLIENT_EMAIL,
  FIREBASE_ADMIN_PRIVATE_KEY,
  FIREBASE_ADMIN_PROJECT_ID,
  FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH,
  FIREBASE_CONFIG,
  MAILCHIMP_API_KEY,
  MAILCHIMP_LIST_ID_DAILY,
  MAILCHIMP_LIST_ID_WEEKLY,
  MAILCHIMP_SERVER_PREFIX,
  MOCK_API_SERVER_PORT,
  TURNSTILE_SECRET_KEY,
}
