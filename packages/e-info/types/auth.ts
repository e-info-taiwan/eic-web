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

// 感興趣的分類選項
export type InterestedCategory =
  | '台灣新聞'
  | '生物多樣性'
  | '編輯直送'
  | '國際新聞'

// 電子報訂閱選項
export type NewsletterSubscription = {
  dailyNewsletter: boolean
  weeklyNewsletter: boolean
  newsletterFormat: 'general' | 'beautified'
}

// 電子報訂閱選項（新版 - 四種獨立選項）
export type NewsletterPreferences = {
  dailyGeneral: boolean // 每日報（一般版）
  dailyBeautified: boolean // 每日報（美化版）
  weeklyGeneral: boolean // 一週回顧（一般版）
  weeklyBeautified: boolean // 一週回顧（美化版）
}

// 通知分類選項（之後會擴充）
export type NotificationCategory = '台灣新聞' | '生物多樣性' | '編輯直送'

// Firestore 使用者資料結構
export type UserProfile = {
  uid: string
  email: string
  displayName: string
  avatarUrl?: string // 頭像圖片 URL
  location: LocationOption | null
  birthDate: string | null
  interestedCategories: InterestedCategory[]
  newsletterSubscriptions: NewsletterSubscription
  newsletterPreferences?: NewsletterPreferences // 新版電子報訂閱選項
  notificationCategories?: NotificationCategory[] // 通知分類
  createdAt: string
  updatedAt: string
}

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
  interestedCategories: InterestedCategory[]
  dailyNewsletter: boolean
  weeklyNewsletter: boolean
  newsletterFormat: 'general' | 'beautified'
}

// 將註冊表單的電子報選項轉換為 NewsletterPreferences
export const convertToNewsletterPreferences = (
  dailyNewsletter: boolean,
  weeklyNewsletter: boolean,
  newsletterFormat: 'general' | 'beautified'
): NewsletterPreferences => {
  return {
    dailyGeneral: dailyNewsletter && newsletterFormat === 'general',
    dailyBeautified: dailyNewsletter && newsletterFormat === 'beautified',
    weeklyGeneral: weeklyNewsletter && newsletterFormat === 'general',
    weeklyBeautified: weeklyNewsletter && newsletterFormat === 'beautified',
  }
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
