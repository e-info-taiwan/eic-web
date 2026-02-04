// 地區選項 - 台灣所有縣市
export type LocationOption =
  // 六都
  | '台北市'
  | '新北市'
  | '桃園市'
  | '台中市'
  | '台南市'
  | '高雄市'
  // 其他縣市
  | '基隆市'
  | '新竹市'
  | '新竹縣'
  | '苗栗縣'
  | '彰化縣'
  | '南投縣'
  | '雲林縣'
  | '嘉義市'
  | '嘉義縣'
  | '屏東縣'
  | '宜蘭縣'
  | '花蓮縣'
  | '台東縣'
  | '澎湖縣'
  | '金門縣'
  | '連江縣'
  // 其他
  | '其他'

// 認證提供者類型
export type AuthProvider = 'google' | 'facebook' | 'apple' | 'email'

// 註冊表單資料
export type RegisterFormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
  location: LocationOption | ''
  customLocation: string // 當選擇「其他」時的自訂地區
  birthDate: string
  interestedSectionIds: string[] // 感興趣的分類（Section IDs）
  dailyNewsletter: boolean
  weeklyNewsletter: boolean
  newsletterFormat: 'standard' | 'styled'
}

// 註冊表單驗證狀態
export type RegisterFormValidation = {
  email: boolean | null
  password: boolean | null
  confirmPassword: boolean | null
}

// 註冊表單錯誤
export type RegisterFormErrors = {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  location?: string
  birthDate?: string
  interestedCategories?: string
}
