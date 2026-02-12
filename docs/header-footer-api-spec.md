# Header/Footer JSON API 規格文件

## 概述

本文件定義 Header 與 Footer 所需的統一 JSON API，用於取代目前分散的 5 個 GraphQL 查詢，以提升效能並減少網路請求次數。

此 API 與 Homepage API 類似，採用 JSON API 優先、GraphQL fallback 的機制。

## API Endpoint

建議路徑：
- **開發環境**: `https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/header`
- **正式環境**: `https://eic-info-cms-gql-prod-1090198686704.asia-east1.run.app/api/header`

## HTTP 規格

- **Method**: `GET`
- **Content-Type**: `application/json`
- **Cache-Control**: 建議 `public, max-age=60` (60 秒，與前端 in-memory cache TTL 一致)

---

## Response 結構

```typescript
interface HeaderFooterApiResponse {
  // Header 導覽列區塊 (showInHeader = true)
  sections: HeaderNavSection[]

  // 精選標籤 (isFeatured = true)
  featuredTags: HeaderNavTag[]

  // 深度專題 (published + 有文章，取前 6 筆)
  topics: HeaderNavTopic[]

  // 熱門話題跑馬燈 (category slug = "hottopic")
  newsBarPicks: NewsBarPick[]

  // 網站設定 (state = "active")
  // 包含：公益勸募字號、捐款連結 等
  siteConfigs: SiteConfig[]
}
```

---

## 各欄位詳細規格

### 1. sections (Header 導覽列)

Header 主導覽列的區塊與分類資料。

**查詢條件**:
- `showInHeader = true`
- 依 `sortOrder` 升冪排序
- Categories 依 `sortOrder` 升冪排序

**GraphQL 等效查詢**:
```graphql
query {
  sections(
    where: { showInHeader: { equals: true } }
    orderBy: { sortOrder: asc }
  ) {
    id
    slug
    name
    categories(orderBy: { sortOrder: asc }, take: 10) {
      id
      slug
      name
    }
  }
}
```

**TypeScript 型別**:
```typescript
interface HeaderNavCategory {
  id: string
  slug: string
  name: string
}

interface HeaderNavSection {
  id: string
  slug: string
  name: string
  categories: HeaderNavCategory[]
}
```

---

### 2. featuredTags (精選標籤)

Header 顯示的精選標籤列表。

**查詢條件**:
- `isFeatured = true`
- 依 `sortOrder` 升冪排序

**GraphQL 等效查詢**:
```graphql
query {
  tags(
    where: { isFeatured: { equals: true } }
    orderBy: { sortOrder: asc }
  ) {
    id
    name
  }
}
```

**TypeScript 型別**:
```typescript
interface HeaderNavTag {
  id: string
  name: string
}
```

---

### 3. topics (深度專題)

Header 深度專題下拉選單的選項。

**查詢條件**:
- `status = "published"`
- 必須有關聯文章 (`posts: { some: {} }`)
- 依 `sortOrder` 升冪排序
- 取前 6 筆

**GraphQL 等效查詢**:
```graphql
query {
  topics(
    where: { status: { equals: "published" }, posts: { some: {} } }
    orderBy: { sortOrder: asc }
    take: 6
  ) {
    id
    title
  }
}
```

**TypeScript 型別**:
```typescript
interface HeaderNavTopic {
  id: string
  title: string
}
```

---

### 4. newsBarPicks (熱門話題跑馬燈)

Header 熱門話題跑馬燈的內容，輕量版只包含標題與連結。

**查詢條件**:
- Category slug: `"hottopic"`
- 依 `sortOrder` 升冪排序

**GraphQL 等效查詢**:
```graphql
query {
  homepagePicks(
    where: { category: { slug: { equals: "hottopic" } } }
    orderBy: { sortOrder: asc }
  ) {
    id
    customUrl
    customTitle
    posts {
      id
      title
    }
  }
}
```

**TypeScript 型別**:
```typescript
interface NewsBarPick {
  id: string
  customUrl: string | null
  customTitle: string | null
  posts: {
    id: string
    title: string
  } | null
}
```

**顯示邏輯**:
- 標題優先使用 `customTitle`，若無則使用 `posts.title`
- 連結優先使用 `customUrl`，若無則使用 `/node/${posts.id}`

---

### 5. siteConfigs (網站設定)

全站通用設定，用於 Header 與 Footer。

**查詢條件**:
- `state = "active"`

**GraphQL 等效查詢**:
```graphql
query {
  configs(where: { state: { equals: "active" } }) {
    id
    name
    content
    link
    state
  }
}
```

**TypeScript 型別**:
```typescript
interface SiteConfig {
  id: string
  name: string
  content: string | null
  link: string | null
  state: string | null
}
```

**常用設定項目**:
| id | name | 用途 | 前端使用欄位 |
|----|------|------|------------|
| `1` | 公益勸募字號 | Footer 顯示勸募許可字號 | `content` |
| `2` | 電子報訂閱人數 | 顯示訂閱人數 | `content` |
| `3` | 捐款連結 | Header/Footer 捐款按鈕連結 | `content` |

> **注意**: 前端以 `config.id` 而非 `config.name` 來查找設定。捐款連結的 URL 存放在 `content` 欄位中（非 `link` 欄位）。

---

## 完整 Response 範例

```json
{
  "sections": [
    {
      "id": "3",
      "slug": "latestnews",
      "name": "時事新聞",
      "categories": [
        { "id": "7", "slug": "taiwannews", "name": "台灣新聞" },
        { "id": "9", "slug": "intnews", "name": "國際新聞" },
        { "id": "10", "slug": "editor", "name": "編輯直送" }
      ]
    },
    {
      "id": "4",
      "slug": "column",
      "name": "專欄",
      "categories": [
        { "id": "14", "slug": "island", "name": "我們的島" },
        { "id": "19", "slug": "wild", "name": "與野共生" }
      ]
    }
  ],
  "featuredTags": [
    { "id": "12", "name": "深度報導" },
    { "id": "16", "name": "回顧與前瞻" }
  ],
  "topics": [
    { "id": "3", "title": "直擊阿聯氣候新時代" },
    { "id": "2", "title": "測試用專題" }
  ],
  "newsBarPicks": [
    {
      "id": "10",
      "customUrl": null,
      "customTitle": "快訊：環保署公布最新空污監測數據",
      "posts": {
        "id": "238660",
        "title": "環保署公布空污監測報告"
      }
    }
  ],
  "siteConfigs": [
    {
      "id": "1",
      "name": "公益勸募字號",
      "content": "衛部救字第1141364365號",
      "link": "",
      "state": "active"
    },
    {
      "id": "2",
      "name": "電子報訂閱人數",
      "content": "123284934",
      "link": "",
      "state": "active"
    },
    {
      "id": "3",
      "name": "捐款連結",
      "content": "https://e-info.neticrm.tw/civicrm/contribute/transact?reset=1&id=9",
      "link": "",
      "state": "active"
    }
  ]
}
```

---

## 錯誤處理

當 API 發生錯誤時，前端會自動 fallback 到原本的 GraphQL 查詢機制。

建議的錯誤回應格式：

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Failed to fetch header data"
  }
}
```

HTTP Status Codes:
- `200`: 成功
- `500`: 伺服器錯誤
- `503`: 服務暫時不可用

---

## 效能建議

1. **快取策略**: 前端 in-memory cache TTL 為 60 秒，CDN 層可設定較長快取
2. **資料大小**: Header/Footer API payload 約 5-10KB，遠小於 Homepage API
3. **並行查詢**: 後端可使用 Promise.all 並行執行各個查詢
4. **壓縮**: 啟用 gzip/brotli 壓縮

---

## 完整 Response 範例檔案

完整的 JSON response 範例請參考：
- **[header-footer-api-example.json](./header-footer-api-example.json)** - 從 dev 環境 GraphQL API 實際查詢產生的完整 response

此檔案包含：
- 5 個 sections（news: 9, opinion: 3, column: 10, supplement: 10, greenconsumption: 1）
- 4 個 featuredTags
- 6 個 topics（深度專題）
- 3 個 newsBarPicks（熱門話題跑馬燈，category slug = "hottopic"）
- 3 個 siteConfigs（公益勸募字號、電子報訂閱人數、捐款連結）

> **注意**: categories 已套用 `take: 10` 限制（例如專欄實際有 50+ 個 categories，但只回傳前 10 個）。

檔案大小：約 8KB (300 行)

---

## 前端整合（已實作）

### 架構概要

前端已實作 JSON API 優先、GraphQL fallback 的機制。

**API Endpoint 設定**: 集中管理在 `packages/e-info/constants/config.ts`，透過 `HEADER_API_ENDPOINT` 匯出，依 `NEXT_PUBLIC_ENV` 切換環境。

**快取與 Timeout 設定**: 集中管理在 `packages/e-info/constants/layout.ts`：
- `CACHE_TTL_MS` = 60 秒 (in-memory cache TTL)
- `API_TIMEOUT_MS` = 10 秒 (JSON API request timeout)
- `HEALTH_CHECK_TIMEOUT_MS` = 5 秒 (health check timeout)

### 資料流

```
fetchHeaderData()
  ├─ 1. 檢查 in-memory cache (60 秒 TTL)
  │     └─ 有效 → 直接回傳
  ├─ 2. 嘗試 JSON API (HEADER_API_ENDPOINT, 10 秒 timeout)
  │     └─ 成功 → 更新 cache，回傳
  ├─ 3. Fallback: 嘗試 GraphQL (5 個並行查詢)
  │     └─ 成功 → 更新 cache，回傳
  └─ 4. 兩者皆失敗
        ├─ 有過期 cache → 回傳過期 cache (stale)
        └─ 無 cache → 回傳空資料結構 (不拋出錯誤)
```

### 完全失敗時的空資料結構

當 JSON API 和 GraphQL 都失敗且無快取時，回傳空資料以避免頁面崩潰：

```typescript
{
  sections: [],
  featuredTags: [],
  topics: [],
  newsBarPicks: [],
  siteConfigs: [],
}
```

### Health Check

提供 `checkHeaderApiHealth()` 函數，使用 HEAD 請求檢查 JSON API 可用性（5 秒 timeout）。

### 相關程式碼位置

- `packages/e-info/utils/header-data.ts` - API 呼叫與 fallback 邏輯
- `packages/e-info/contexts/header-context.tsx` - Header Context 定義
- `packages/e-info/graphql/query/section.ts` - GraphQL 查詢與型別定義
- `packages/e-info/components/layout/header/header.tsx` - Header 元件
- `packages/e-info/components/layout/footer.tsx` - Footer 元件

---

## 實作進度

| Phase | 狀態 | 說明 |
|-------|------|------|
| Phase 1: 後端 (CMS) | **已完成** (dev) | Dev 環境 `/api/header` endpoint 已上線 |
| Phase 2: 前端整合 | **已完成** | JSON API 優先 + GraphQL fallback + health check |
| Phase 3: 部署 | **待完成** | Prod 環境 endpoint 待確認（config.ts 中有 TODO 標記） |

---

## 變更記錄

### 2026-02-12
- 根據實際程式碼更新文件，修正多處規格與實作不一致
- 修正 newsBarPicks category slug: `flashnews` → `hottopic`
- 修正 sections GraphQL 查詢: 加入 `take: 10` 限制 categories 數量
- 修正 siteConfigs: 捐款連結使用 `content` 欄位（非 `link`），補充 ID 對照表
- 修正 siteConfigs response 範例: 加入電子報訂閱人數、修正捐款連結 ID 與欄位
- 修正 Cache-Control 建議: 5 分鐘 → 60 秒（與前端 `CACHE_TTL_MS` 一致）
- 更新前端整合章節: 反映已實作的架構（config.ts endpoint、layout.ts 常數、health check）
- 更新實作步驟: 標記 Phase 1/2 已完成，Phase 3 待完成

### 2026-02-02
- 初版文件建立
- 定義 API 規格與型別
- 規劃前端整合方案
