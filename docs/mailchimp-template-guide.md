# Mailchimp 電子報模板操作指南

## 概述

本文件說明如何在 Mailchimp 中建立、設定及使用電子報 HTML 模板。

### 相關檔案

| 檔案 | 說明 |
|------|------|
| `public/newsletter_template.html` | 標準版模板 (standard) |
| `public/newsletter_styled_template.html` | 美化版模板 (styled)，大字體、隱藏次要資訊 |
| `public/icons/facebook.png` | Facebook 社群圖示 |
| `public/icons/x.png` | X (Twitter) 社群圖示 |
| `public/icons/line.png` | LINE 社群圖示 |

### 架構

```
Mailchimp Account
├── Audience: 每日報 (MAILCHIMP_LIST_ID_DAILY)
│   └── Merge Field: FORMAT = 'standard' | 'styled'
│
└── Audience: 一週回顧 (MAILCHIMP_LIST_ID_WEEKLY)
    └── Merge Field: FORMAT = 'standard' | 'styled'
```

每個 Audience 的訂閱者都有 `FORMAT` merge field，決定收到哪個版本的電子報。發送 campaign 時使用 **Segment** 功能，依 `FORMAT` 值分組發送對應模板。

---

## 模板結構

兩個模板共用相同的 HTML 結構（table-based），差異僅在 CSS 樣式。

### 區塊總覽

```
┌─────────────────────────────────┐
│  Banner 圖片                    │  ← 模板固定區域
├─────────────────────────────────┤
│  ===== 系統產出內容 開始 =====    │
│                                 │
│  00-Header (訂閱人數/日期/標題)   │
│  01-Content (本期內容目錄)        │
│  Articles (文章區塊)             │
│  02-Highlight (焦點話題)         │
│  03-Ranking (閱讀排名)           │
│  Ads (廣告)                     │
│  04-Events (近期活動)            │
│  05-Jobs (環境徵才)              │
│  06-Comment (推薦讀者回應)        │
│  07-Poll (心情互動)              │
│                                 │
│  ===== 系統產出內容 結束 =====    │
├─────────────────────────────────┤
│  08-Referral (推薦狀態)          │  ← 模板固定區域
│  09-Footer                      │  ← 模板固定區域
│  - 社群圖示                      │
│  - 退訂 / 更新資料連結            │
│  - 版權聲明                      │
└─────────────────────────────────┘
```

### 系統產出區域 vs 模板固定區域

| 區域 | 內容來源 | 更新方式 |
|------|---------|---------|
| Banner 圖片 | 固定模板 | 不需更新 |
| 00 ~ 07 (系統區域) | 系統自動產生 | 編輯複製系統產出的 HTML 整段貼入 |
| 08-Referral | 固定模板 | 不需更新（由 Mailchimp merge tags 動態帶入） |
| 09-Footer | 固定模板 | 不需更新 |

---

## 標準版 vs 美化版差異

兩個模板 HTML 結構完全一致，差異僅在 `<style>` 區塊的 CSS 值：

| 元素 | 標準版 | 美化版 |
|------|--------|--------|
| 電子報標題 | 22px | 36px |
| 訂閱人數 | 15px | 18px |
| 日期 | 16px | 20px |
| 本期內容標題 | 18px | 24px |
| 目錄項目 | 14px | 20px |
| 綠色區塊標題 | 18px | 22px |
| 文章標題 | 20px | 26px |
| 文章摘要 | 14px (顯示) | **隱藏** |
| 焦點/排名標題 | 18px | 22px |
| 閱讀更多 | 14px | 20px |
| 活動/徵才日期 | 15px | 26px |
| 活動/徵才標題 | 17px | 22px |
| 主辦單位 | 14px (顯示) | **隱藏** |
| 讀者回應引言 | 20px | 26px |
| 回應來源標題 | 16px (顯示) | **隱藏** |
| 閱讀全文 | 16px | 22px |
| 社群圖示 | 30px | 48px |
| Footer 文字 | 14px | 18px |
| Footer 連結 | 15px | 22px |

---

## Mailchimp 設定步驟

### Step 1：建立 Merge Field

在每個 Audience 中建立 `FORMAT` merge field（如尚未建立）：

1. 進入 **Audience** → **All contacts**
2. 點擊 **Settings** → **Audience fields and *|MERGE|* tags**
3. 新增欄位：
   - **Field label**: Format
   - **Merge tag**: `FORMAT`
   - **Field type**: Text
   - **Default value**: `standard`
4. 儲存

### Step 2：建立 Email Templates

需要建立兩個模板：

#### 2-1. 建立標準版模板

1. 進入 **Campaigns** → **Email templates**
2. 點擊 **Create Template**
3. 選擇 **Code your own** → **Paste in code**
4. 將 `newsletter_template.html` 的完整 HTML 貼入
5. **重要**：將圖片路徑改為完整 URL（見 [圖片路徑處理](#圖片路徑處理)）
6. 命名為 `電子報 - 標準版`
7. 儲存

#### 2-2. 建立美化版模板

1. 重複上述步驟
2. 貼入 `newsletter_styled_template.html` 的 HTML
3. 命名為 `電子報 - 美化版`
4. 儲存

### Step 3：圖片路徑處理

模板中的相對路徑需替換為完整 URL。有兩種方式：

**方式 A：使用網站 URL（推薦）**

將社群圖示上傳至網站 public 目錄後，路徑如下：

```
/icons/facebook.png → https://e-info.org.tw/icons/facebook.png
/icons/x.png        → https://e-info.org.tw/icons/x.png
/icons/line.png     → https://e-info.org.tw/icons/line.png
```

Banner 圖片：
```
目前路徑：https://eic-web-dev-1090198686704.asia-east1.run.app/newsletter-banner.png
正式環境請替換為正式域名的 URL
```

**方式 B：上傳至 Mailchimp Content Studio**

1. 進入 **Content** → **My files**
2. 上傳 `facebook.png`、`x.png`、`line.png`、`newsletter-banner.png`
3. 取得各檔案的 Mailchimp CDN URL
4. 替換模板中的圖片路徑

### Step 4：設定 Footer 動態連結

將模板中的 `#` placeholder 替換為 Mailchimp merge tags：

```html
<!-- 更新資料 -->
<a class="footer-link" href="*|UPDATE_PROFILE|*">更新資料</a>

<!-- 退訂電子報 -->
<a class="footer-link" href="*|UNSUB|*">退訂電子報</a>
```

### Step 5：設定 Referral 區塊動態內容（選用）

若有整合推薦系統，可在 08-Referral 區塊使用 merge tags：

```html
<p class="referral-desc">
  你總共有 <span class="referral-highlight">*|REFERRAL_COUNT|*</span> 個推薦。
  邀請 <span class="referral-highlight">*|REFERRAL_NEEDED|*</span> 個朋友訂閱來獲得點數。
</p>
```

---

## 發送 Campaign 流程

### 每期發送步驟

#### 1. 取得系統產出的 HTML

系統會自動產出 00-Header（訂閱人數、日期、標題）到 07-Poll 區塊的完整 HTML 內容。

#### 2. 建立 Campaign

1. 進入 **Campaigns** → **Create Campaign** → **Email**
2. 選擇對應的 Audience（每日報 或 一週回顧）

#### 3. 設定收件人 Segment

為每種格式建立獨立的 campaign 或使用 Segment：

**標準版收件人：**
```
Merge Field: FORMAT is "standard"
```

**美化版收件人：**
```
Merge Field: FORMAT is "styled"
```

#### 4. 選擇模板

- 標準版 Segment → 選擇 `電子報 - 標準版` 模板
- 美化版 Segment → 選擇 `電子報 - 美化版` 模板

#### 5. 編輯內容

1. 在模板編輯器中，找到系統產出區域的位置
   （位於 `<!-- ===== SYSTEM: 這裡以下是電子報儲存的內容 ===== -->` 和 `<!-- ===== SYSTEM: 這裡以上是電子報儲存的內容 ===== -->` 之間）
2. 將系統產出的 HTML 整段替換進去（已包含訂閱人數、日期、標題，無需手動修改）

#### 6. 預覽與測試

1. 點擊 **Preview and Test**
2. 發送測試信到編輯群組信箱
3. 確認各區塊顯示正常
4. 確認連結正確

#### 7. 發送

確認無誤後排程或立即發送。

---

## 使用條件式內容（進階）

如果不想為每種格式建立獨立 campaign，可使用 Mailchimp 的 **Conditional Merge Tag Blocks** 在單一 campaign 中切換樣式：

```html
*|IF:FORMAT=styled|*
  <!-- 美化版的 <style> 區塊 -->
  <style>
    .header-title { font-size: 36px; }
    .article-excerpt { font-size: 0; color: transparent; }
    /* ... 美化版 CSS ... */
  </style>
*|ELSE:|*
  <!-- 標準版的 <style> 區塊 -->
  <style>
    .header-title { font-size: 22px; }
    .article-excerpt { font-size: 14px; color: #333; }
    /* ... 標準版 CSS ... */
  </style>
*|END:IF|*
```

**注意**：此方式較複雜，且 Mailchimp CSS inliner 可能無法正確處理條件式 `<style>` 區塊。建議優先使用 Segment + 獨立模板的方式。

---

## 常見問題

### Q: CSS 需要寫成 inline style 嗎？

不用。Mailchimp 在發送時會自動將 `<style>` 區塊中的 CSS inline 到 HTML 元素上，所以我們的模板使用 class-based CSS 即可。

### Q: 兩個模板的 HTML 結構一樣嗎？

是的。兩個模板共用完全相同的 HTML 結構（table-based layout），差異僅在 `<style>` 區塊中的 CSS 值（字體大小、是否隱藏特定元素等）。這意味著系統產出的 HTML 內容可以同時用於兩個模板。

### Q: 為什麼使用 table 排版？

Email 客戶端（尤其是 Outlook）對 CSS 支援有限，不支援 flexbox、grid 等現代 CSS 排版。table-based layout 是目前 email HTML 的業界標準做法，確保在所有客戶端中正確顯示。

### Q: 社群圖示為什麼用 PNG 而非 SVG？

Outlook 不支援 SVG 渲染，使用 PNG 確保所有 email 客戶端都能正確顯示社群圖示。

### Q: `*|LIST:SUBSCRIBERS|*` 等 merge tag 是什麼？

Mailchimp 在發送時會自動將 merge tags 替換為實際值：

| Merge Tag | 說明 |
|-----------|------|
| `*|LIST:SUBSCRIBERS|*` | 該 Audience 的訂閱人數 |
| `*|UPDATE_PROFILE|*` | 訂閱者更新偏好頁面連結 |
| `*|UNSUB|*` | 退訂連結 |
| `*|CURRENT_YEAR|*` | 當前年份 |
| `*|FORMAT|*` | 訂閱者的格式偏好值 |

### Q: 每次都要手動更新系統產出區域嗎？

是的。目前的工作流程是：
1. 系統產出當期電子報 HTML（00-Header ~ 07-Poll，含訂閱人數、日期、標題）
2. 編輯複製該 HTML
3. 在 Mailchimp campaign 編輯器中貼入對應位置（整段替換即可，不需手動改標題或日期）

未來可考慮透過 Mailchimp API 自動化此流程。

---

## 相關文件

- [Newsletter 訂閱功能規格](./newsletter-subscription-spec.md) — API、Mailchimp 整合、CMS 同步
- [Newsletter 內容 API 規格](./newsletter-api-spec.md) — 電子報內容 GraphQL API
