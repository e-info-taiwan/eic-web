import type { LocationOption } from '~/types/auth'

// 地區選項列表 - 台灣所有縣市
export const LOCATION_OPTIONS: { value: LocationOption; label: string }[] = [
  // 六都
  { value: '台北市', label: '台北市' },
  { value: '新北市', label: '新北市' },
  { value: '桃園市', label: '桃園市' },
  { value: '台中市', label: '台中市' },
  { value: '台南市', label: '台南市' },
  { value: '高雄市', label: '高雄市' },
  // 其他縣市
  { value: '基隆市', label: '基隆市' },
  { value: '新竹市', label: '新竹市' },
  { value: '新竹縣', label: '新竹縣' },
  { value: '苗栗縣', label: '苗栗縣' },
  { value: '彰化縣', label: '彰化縣' },
  { value: '南投縣', label: '南投縣' },
  { value: '雲林縣', label: '雲林縣' },
  { value: '嘉義市', label: '嘉義市' },
  { value: '嘉義縣', label: '嘉義縣' },
  { value: '屏東縣', label: '屏東縣' },
  { value: '宜蘭縣', label: '宜蘭縣' },
  { value: '花蓮縣', label: '花蓮縣' },
  { value: '台東縣', label: '台東縣' },
  { value: '澎湖縣', label: '澎湖縣' },
  { value: '金門縣', label: '金門縣' },
  { value: '連江縣', label: '連江縣' },
  // 其他
  { value: '其他', label: '其他' },
]

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
    errorMessage: '密碼輸入不一致，請確認',
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
  'auth/requires-recent-login': '請重新登入後再試',
  'auth/user-mismatch': '認證資訊不符',
}

// 取得 Firebase 錯誤的中文訊息
export const getFirebaseErrorMessage = (errorCode: string): string => {
  return FIREBASE_ERROR_MESSAGES[errorCode] || '發生錯誤，請稍後再試'
}
