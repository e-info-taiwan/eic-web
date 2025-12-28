import type { InterestedCategory, LocationOption } from '~/types/auth'

// 地區選項列表
export const LOCATION_OPTIONS: { value: LocationOption; label: string }[] = [
  { value: '台北市', label: '台北市' },
  { value: '新北市', label: '新北市' },
  { value: '桃園市', label: '桃園市' },
  { value: '台中市', label: '台中市' },
  { value: '台南市', label: '台南市' },
  { value: '其他', label: '其他' },
]

// 感興趣的分類選項
export const INTERESTED_CATEGORIES: {
  value: InterestedCategory
  label: string
}[] = [
  { value: '台灣新聞', label: '台灣新聞' },
  { value: '生物多樣性', label: '生物多樣性' },
  { value: '編輯直送', label: '編輯直送' },
  { value: '國際新聞', label: '國際新聞' },
]

// 電子報選項
export const NEWSLETTER_OPTIONS = [
  { value: 'daily', label: '《環境資訊電子報》每日報' },
  { value: 'weekly', label: '《環境資訊電子報一週回顧》' },
] as const

// 電子報版本選項
export const NEWSLETTER_FORMAT_OPTIONS = [
  { value: 'general', label: '一般版' },
  { value: 'beautified', label: '美化版' },
] as const

// 密碼驗證規則
export const VALIDATION_RULES = {
  password: {
    minLength: 8,
    message: '密碼在 8 位數以上',
    errorMessage: '密碼格式錯誤！',
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email 格式正確',
    errorMessage: 'Email 格式錯誤',
  },
  confirmPassword: {
    message: '密碼驗證正確',
    errorMessage: '密碼驗證錯誤',
  },
}

// Firebase 錯誤訊息中文對照
export const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  'auth/user-not-found': '找不到此帳號',
  'auth/wrong-password': '密碼錯誤',
  'auth/email-already-in-use': '此 Email 已被使用',
  'auth/weak-password': '密碼強度不足',
  'auth/invalid-email': 'Email 格式不正確',
  'auth/too-many-requests': '嘗試次數過多，請稍後再試',
  'auth/network-request-failed': '網路連線錯誤，請檢查網路',
  'auth/popup-closed-by-user': '登入視窗已關閉',
  'auth/operation-not-allowed': '此登入方式未啟用',
  'auth/invalid-credential': '認證資訊無效',
}

// 取得 Firebase 錯誤的中文訊息
export const getFirebaseErrorMessage = (errorCode: string): string => {
  return FIREBASE_ERROR_MESSAGES[errorCode] || '發生錯誤，請稍後再試'
}
