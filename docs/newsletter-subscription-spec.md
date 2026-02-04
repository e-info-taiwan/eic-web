# Newsletter 電子報訂閱功能規格文件

## 概述

本文件定義電子報訂閱功能的完整規格，包含 Mailchimp 整合、API 設計、以及前端實作細節。

> **注意**: 本文件專注於「訂閱功能」，與 [newsletter-api-spec.md](./newsletter-api-spec.md)（電子報內容 API）為不同主題。

---

## 電子報類型

環境資訊中心提供兩種電子報：

| 電子報 | 頻率 | 發送時間 | 說明 |
|--------|------|----------|------|
| 環境資訊電子報（每日報） | 每個工作日 | 週一至週五 | 每日環境新聞摘要 |
| 環境資訊電子報一週回顧 | 每週一次 | 週六 | 一週環境新聞精選 |

### 格式選項

每種電子報都提供兩種格式：

| 格式 | 代碼 | 說明 |
|------|------|------|
| 一般版 | `standard` | 標準文字排版 |
| 美化版 | `styled` | 放大重要資訊字體，更友善的閱讀體驗 |

---

## Mailchimp 架構

### 雙 Audience 架構

使用兩個獨立的 Mailchimp Audience，以頻率區分：

```
Mailchimp Account
├── Audience: 每日報 (MAILCHIMP_LIST_ID_DAILY)
│   └── Merge Field: FORMAT = 'standard' | 'styled'
│
└── Audience: 一週回顧 (MAILCHIMP_LIST_ID_WEEKLY)
    └── Merge Field: FORMAT = 'standard' | 'styled'
```

### 為何使用雙 Audience？

| 優點 | 說明 |
|------|------|
| 發送管理更簡單 | 不同頻率的電子報可獨立管理發送排程 |
| 統計數據分離 | 開信率、點擊率等指標分開統計 |
| 取消訂閱獨立 | 使用者可單獨取消某一種電子報 |
| 符合最佳實踐 | Mailchimp 建議不同發送頻率使用不同 Audience |

### Merge Fields 用途

使用 Merge Fields 儲存格式偏好：

| Merge Field | 說明 | 可能值 |
|-------------|------|--------|
| `FORMAT` | 格式偏好 | `'standard'` (一般版) 或 `'styled'` (美化版) |

---

## 環境變數設定

### 必要環境變數

```bash
# Mailchimp API 認證
MAILCHIMP_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-usX

# Audience IDs（兩個 Audience）
MAILCHIMP_LIST_ID_DAILY=xxxxxxxxxx      # 每日報 Audience ID
MAILCHIMP_LIST_ID_WEEKLY=xxxxxxxxxx     # 一週回顧 Audience ID

# Server Prefix（可選，會自動從 API Key 解析）
MAILCHIMP_SERVER_PREFIX=usX
```

### 環境變數說明

| 變數名稱 | 說明 | 範例 |
|----------|------|------|
| `MAILCHIMP_API_KEY` | Mailchimp API Key | `abc123def456...-us21` |
| `MAILCHIMP_LIST_ID_DAILY` | 每日報 Audience ID | `a1b2c3d4e5` |
| `MAILCHIMP_LIST_ID_WEEKLY` | 一週回顧 Audience ID | `f6g7h8i9j0` |
| `MAILCHIMP_SERVER_PREFIX` | API Server 前綴（可選） | `us21` |

### 取得 Audience ID

1. 登入 [Mailchimp Dashboard](https://mailchimp.com/)
2. 進入 **Audience** > **All contacts**
3. 點擊 **Settings** > **Audience name and defaults**
4. 複製 **Audience ID** 欄位的值

### 向後相容

為確保向後相容，若新環境變數未設定，會嘗試使用舊的 `MAILCHIMP_LIST_ID`：

```typescript
// 向後相容邏輯
const MAILCHIMP_LIST_ID_DAILY =
  process.env.MAILCHIMP_LIST_ID_DAILY || process.env.MAILCHIMP_LIST_ID || ''
const MAILCHIMP_LIST_ID_WEEKLY =
  process.env.MAILCHIMP_LIST_ID_WEEKLY || process.env.MAILCHIMP_LIST_ID || ''
```

---

## API 規格

### Endpoint

```
POST /api/newsletter/subscribe
```

### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```typescript
{
  email: string                          // 訂閱者 Email
  frequency: 'daily' | 'weekly'          // 電子報頻率
  format: 'standard' | 'styled'          // 格式偏好
}
```

**範例:**
```json
{
  "email": "user@example.com",
  "frequency": "daily",
  "format": "styled"
}
```

### Response

**成功 (200):**
```json
{
  "success": true,
  "message": "訂閱成功！"
}
```

**已存在並更新 (200):**
```json
{
  "success": true,
  "message": "訂閱偏好已更新！"
}
```

**錯誤 (400/500):**
```json
{
  "success": false,
  "error": "錯誤訊息"
}
```

### 錯誤代碼

| HTTP Status | 錯誤訊息 | 說明 |
|-------------|----------|------|
| 400 | 缺少必要欄位 | email、frequency 或 format 未提供 |
| 400 | 請輸入有效的 Email 地址 | Email 格式驗證失敗 |
| 400 | 此 Email 已訂閱，如需更新偏好請聯繫我們 | 已存在且 Tag 更新失敗 |
| 405 | Method not allowed | 非 POST 請求 |
| 500 | 電子報服務暫時無法使用 | Mailchimp 設定缺失 |
| 500 | 訂閱失敗，請稍後再試 | Mailchimp API 錯誤 |

---

## TypeScript 型別定義

### Request/Response 型別

```typescript
// packages/e-info/types/newsletter.ts

export type NewsletterFrequency = 'daily' | 'weekly'
export type NewsletterFormat = 'standard' | 'styled'

export type SubscribeRequest = {
  email: string
  frequency: NewsletterFrequency
  format: NewsletterFormat
}

export type SubscribeResponse = {
  success: boolean
  message?: string
  error?: string
}
```

### Mailchimp 相關型別

```typescript
export type MailchimpMemberStatus =
  | 'subscribed'
  | 'unsubscribed'
  | 'cleaned'
  | 'pending'
  | 'transactional'

export type MailchimpTag = {
  name: string
  status: 'active' | 'inactive'
}

export type MailchimpMemberData = {
  email_address: string
  status: MailchimpMemberStatus
  tags?: string[]
  merge_fields?: Record<string, string>
}

export type MailchimpErrorResponse = {
  type: string
  title: string
  status: number
  detail: string
  instance: string
}
```

---

## 訂閱流程

### 流程圖

```
使用者填寫表單
    │
    ▼
POST /api/newsletter/subscribe
    │
    ▼
根據 frequency 選擇 Audience ID
    ├── daily  → MAILCHIMP_LIST_ID_DAILY
    └── weekly → MAILCHIMP_LIST_ID_WEEKLY
    │
    ▼
設定 Merge Field FORMAT
    ├── styled   → FORMAT: 'styled'
    └── standard → FORMAT: 'standard'
    │
    ▼
呼叫 Mailchimp API 新增 member
    │
    ├── 成功 → 回傳「訂閱成功！」
    │
    └── 失敗 → 檢查錯誤類型
              │
              ├── "Member Exists" → 更新 Merge Fields
              │                      │
              │                      ├── 成功 → 回傳「訂閱偏好已更新！」
              │                      └── 失敗 → 回傳錯誤訊息
              │
              └── 其他錯誤 → 回傳錯誤訊息
```

### Mailchimp API 呼叫

#### 新增訂閱者

```
POST https://{server}.api.mailchimp.com/3.0/lists/{list_id}/members

Headers:
  Content-Type: application/json
  Authorization: Basic {base64(anystring:API_KEY)}

Body:
{
  "email_address": "user@example.com",
  "status": "subscribed",
  "merge_fields": {
    "FORMAT": "styled"
  }
}
```

#### 更新訂閱者 Merge Fields

```
PATCH https://{server}.api.mailchimp.com/3.0/lists/{list_id}/members/{subscriber_hash}

Headers:
  Content-Type: application/json
  Authorization: Basic {base64(anystring:API_KEY)}

Body:
{
  "merge_fields": {
    "FORMAT": "styled"
  }
}
```

**subscriber_hash**: Email 地址的 MD5 hash（小寫）

```typescript
const subscriberHash = crypto
  .createHash('md5')
  .update(email.toLowerCase())
  .digest('hex')
```

---

## CMS Member 同步

### MemberSubscription 結構

CMS 使用 `MemberSubscription` 關聯結構來儲存訂閱資料：

```typescript
// lib/graphql/member.ts
export type NewsletterName = 'daily' | 'weekly'
export type NewsletterType = 'standard' | 'styled'

export type MemberSubscription = {
  id: string
  newsletterName: string   // 'daily' | 'weekly'
  newsletterType: string   // 'standard' | 'styled'
}

export type SubscriptionInput = {
  daily?: NewsletterType | null   // null = 取消訂閱
  weekly?: NewsletterType | null  // null = 取消訂閱
}
```

### 同步機制

當使用者已登入時，訂閱成功後會透過 `updateMemberSubscriptions` API 同步更新 CMS 訂閱資料：

```typescript
// newsletter-modal.tsx
if (member) {
  const format: NewsletterType = styledChecked ? 'styled' : 'standard'
  const subscriptionInput: SubscriptionInput = {}

  if (dailyChecked) {
    subscriptionInput.daily = format
  }
  if (weeklyChecked) {
    subscriptionInput.weekly = format
  }

  await updateMemberSubscriptions(member.id, firebaseUser.uid, subscriptionInput)
}
```

### 欄位對應

| 前端選項 | MemberSubscription.newsletterName | MemberSubscription.newsletterType |
|----------|-----------------------------------|-----------------------------------|
| 每日報 + 一般版 | `'daily'` | `'standard'` |
| 每日報 + 美化版 | `'daily'` | `'styled'` |
| 一週回顧 + 一般版 | `'weekly'` | `'standard'` |
| 一週回顧 + 美化版 | `'weekly'` | `'styled'` |

### 群組互斥邏輯

在會員中心電子報管理頁面，同一頻率的格式選項互斥：
- `dailyStandard` 與 `dailyStyled` 互斥
- `weeklyStandard` 與 `weeklyStyled` 互斥
- 但 daily 和 weekly 可同時訂閱

---

## 前端元件

### NewsletterModal 元件

**檔案位置:** `packages/e-info/components/shared/newsletter-modal.tsx`

**Props:**
```typescript
type NewsletterModalProps = {
  isOpen: boolean
  onClose: () => void
}
```

### UI 流程

1. **選擇電子報頻率**（單選，必選一個）
   - ☐ 訂閱《環境資訊電子報》每日報
   - ☐ 訂閱《環境資訊電子報一週回顧》

2. **選擇格式**（當頻率已選時顯示）
   - ☐ 訂閱美化版
   - 「什麼是美化版」說明連結

3. **輸入 Email**
   - Email 輸入框
   - Email 確認輸入框

4. **送出訂閱**

### 狀態管理

```typescript
type SubscriptionState = 'idle' | 'loading' | 'success' | 'error'

// 元件狀態
const [dailyChecked, setDailyChecked] = useState(false)
const [weeklyChecked, setWeeklyChecked] = useState(false)
const [styledChecked, setStyledChecked] = useState(false)     // 美化版選項
const [email, setEmail] = useState('')
const [confirmEmail, setConfirmEmail] = useState('')
const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>('idle')
const [errorMessage, setErrorMessage] = useState('')
```

### 表單驗證

送出按鈕啟用條件：
```typescript
!email ||
!confirmEmail ||
email !== confirmEmail ||
(!dailyChecked && !weeklyChecked) ||
subscriptionState === 'loading'
```

---

## 實作檔案列表

| 檔案 | 用途 |
|------|------|
| `packages/e-info/pages/api/newsletter/subscribe.ts` | Mailchimp 訂閱 API endpoint |
| `packages/e-info/pages/api/member/subscriptions.ts` | CMS MemberSubscription 管理 API |
| `packages/e-info/components/shared/newsletter-modal.tsx` | 訂閱表單 UI |
| `packages/e-info/pages/member/newsletter.tsx` | 會員中心電子報管理頁面 |
| `packages/e-info/types/newsletter.ts` | TypeScript 型別 |
| `packages/e-info/constants/config.ts` | 環境變數設定 |
| `packages/e-info/lib/graphql/member.ts` | CMS Member GraphQL 操作 |

---

## 實作摘要

### 架構設計

| 項目 | 實作方式 |
|------|----------|
| Audience 數量 | 雙 Audience (`MAILCHIMP_LIST_ID_DAILY`, `MAILCHIMP_LIST_ID_WEEKLY`) |
| 頻率區分方式 | 由 Audience ID 區分 |
| 格式區分方式 | Merge Field `FORMAT` |

### 核心程式碼

**檔案:** `packages/e-info/constants/config.ts`

```typescript
// 雙 Audience 架構，向後相容舊的 MAILCHIMP_LIST_ID
const MAILCHIMP_LIST_ID_DAILY =
  process.env.MAILCHIMP_LIST_ID_DAILY || process.env.MAILCHIMP_LIST_ID || ''
const MAILCHIMP_LIST_ID_WEEKLY =
  process.env.MAILCHIMP_LIST_ID_WEEKLY || process.env.MAILCHIMP_LIST_ID || ''
```

**檔案:** `packages/e-info/pages/api/newsletter/subscribe.ts`

```typescript
// 根據 frequency 選擇 Audience ID
function getListId(frequency: NewsletterFrequency): string {
  return frequency === 'daily' ? MAILCHIMP_LIST_ID_DAILY : MAILCHIMP_LIST_ID_WEEKLY
}

// 使用 merge fields 儲存格式偏好
const mailchimpData = {
  email_address: email,
  status: 'subscribed',
  merge_fields: {
    FORMAT: format,  // 'standard' | 'styled'
  },
}

// 更新現有訂閱者的格式偏好
async function updateMemberMergeFields(
  email: string,
  listId: string,
  format: NewsletterFormat
): Promise<{ success: boolean }>
```

---

## 測試檢查清單

### 新訂閱測試

- [ ] 訂閱每日報 + 一般版 → 加入 DAILY Audience，Tag: 一般版
- [ ] 訂閱每日報 + 美化版 → 加入 DAILY Audience，Tag: 美化版
- [ ] 訂閱一週回顧 + 一般版 → 加入 WEEKLY Audience，Tag: 一般版
- [ ] 訂閱一週回顧 + 美化版 → 加入 WEEKLY Audience，Tag: 美化版

### 更新偏好測試

- [ ] 已訂閱每日報一般版 → 更新為美化版
- [ ] 已訂閱一週回顧一般版 → 更新為美化版

### 跨 Audience 測試

- [ ] 同一 Email 可分別訂閱每日報和一週回顧
- [ ] 修改每日報格式不影響一週回顧設定

### 錯誤處理測試

- [ ] 無效 Email 格式 → 顯示錯誤訊息
- [ ] 缺少必要欄位 → 顯示錯誤訊息
- [ ] Mailchimp API 錯誤 → 顯示通用錯誤訊息

### CMS 同步測試

- [ ] 已登入使用者訂閱後，CMS member 資料更新
- [ ] 未登入使用者訂閱（不應同步 CMS）
- [ ] CMS 同步失敗不影響 Mailchimp 訂閱結果

### 向後相容測試

- [ ] 只設定 `MAILCHIMP_LIST_ID`（舊設定）仍可運作
- [ ] 設定新變數後覆蓋舊設定

---

## 監控與日誌

### 日誌格式

```typescript
// 成功訂閱
console.log('[Newsletter] Successfully subscribed:', {
  email: '***@***.com', // 遮蔽部分
  frequency,
  format,
  listId
})

// 更新 Tags
console.log('[Newsletter] Updated member tags:', {
  email: '***@***.com',
  tags,
  listId
})

// Mailchimp 錯誤
console.error('[Newsletter] Mailchimp error:', {
  error: data.title,
  email: '***@***.com',
  listId
})

// CMS 同步成功
console.log('[Newsletter] Member subscription synced:', { memberId })

// CMS 同步失敗
console.error('[Newsletter] Member sync error:', { error, memberId })
```

### 建議監控指標

| 指標 | 計算方式 | 警示閾值 |
|------|----------|----------|
| 訂閱成功率 | 成功數 / 總請求數 | < 95% |
| 更新成功率 | Tag 更新成功數 / "Member Exists" 數 | < 90% |
| API 錯誤率 | Mailchimp 錯誤數 / 總請求數 | > 5% |
| CMS 同步成功率 | 同步成功數 / 已登入訂閱數 | < 90% |

---

## 安全性考量

### API Key 保護

- `MAILCHIMP_API_KEY` 只在伺服器端使用
- 不應暴露至前端或日誌

### Email 驗證

```typescript
// 基本格式驗證
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email)) {
  return res.status(400).json({
    success: false,
    error: '請輸入有效的 Email 地址',
  })
}
```

### Rate Limiting

目前未實作 rate limiting，建議未來加入：
- 同一 IP 每分鐘最多 10 次請求
- 同一 Email 每小時最多 3 次請求

---

## 相關文件

- [Newsletter 內容 API 規格](./newsletter-api-spec.md) - 電子報內容 GraphQL API
- [Homepage API 規格](./homepage-api-spec.md) - 首頁 JSON API 規格
- [Header/Footer API 規格](./header-footer-api-spec.md) - Header/Footer JSON API 規格

---

## 變更記錄

### 2026-02-05 (v2)
- **實作雙 Audience 架構**：`MAILCHIMP_LIST_ID_DAILY` / `MAILCHIMP_LIST_ID_WEEKLY`
- **格式改用 Merge Fields**：移除 Tags，改用 `merge_fields.FORMAT` 儲存格式偏好
- 更新文件反映實際實作

### 2026-02-05
- 更新格式代碼：`'beautified'` → `'styled'`
- 更新 CMS Member 同步機制：使用 `MemberSubscription` 關聯結構
- 新增 `updateMemberSubscriptions` API 文件
- 新增群組互斥邏輯說明

### 2026-02-02
- 初版文件建立
- 記錄現有單一 Audience 實作
- 規劃雙 Audience 架構變更
- 定義環境變數與 API 調整計畫
- 新增測試檢查清單
