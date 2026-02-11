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
- **Cache-Control**: 建議 `public, max-age=300` (5 分鐘，header/footer 資料變動較少)

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

  // 快訊跑馬燈 (category slug = "flashnews")
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
    categories(orderBy: { sortOrder: asc }) {
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

### 4. newsBarPicks (快訊跑馬燈)

Header 快訊跑馬燈的內容，輕量版只包含標題與連結。

**查詢條件**:
- Category slug: `"flashnews"`
- 依 `sortOrder` 升冪排序

**GraphQL 等效查詢**:
```graphql
query {
  homepagePicks(
    where: { category: { slug: { equals: "flashnews" } } }
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
| name | 用途 | 使用欄位 |
|------|------|----------|
| 公益勸募字號 | Footer 顯示勸募許可字號 | `content` |
| 捐款連結 | Header/Footer 捐款按鈕連結 | `link` |

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
      "content": "衛部救字第1121363934號",
      "link": null,
      "state": "active"
    },
    {
      "id": "2",
      "name": "捐款連結",
      "content": null,
      "link": "https://e-info.neticrm.tw/civicrm/contribute/transact?reset=1&id=9",
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

1. **快取策略**: 建議在 CDN 層設定 5 分鐘快取（header/footer 資料變動較少）
2. **資料大小**: Header/Footer API payload 約 5-10KB，遠小於 Homepage API
3. **並行查詢**: 後端可使用 Promise.all 並行執行各個查詢
4. **壓縮**: 啟用 gzip/brotli 壓縮

---

## 完整 Response 範例檔案

完整的 JSON response 範例請參考：
- **[header-footer-api-example.json](./header-footer-api-example.json)** - 從 dev 環境 GraphQL API 實際查詢產生的完整 response

此檔案包含：
- 4 個 sections（latestnews: 9 categories, critic: 2, column: 57, green: 3）
- 4 個 featuredTags
- 4 個 topics（深度專題）
- 3 個 newsBarPicks（快訊跑馬燈）
- 3 個 siteConfigs（公益勸募字號、電子報訂閱人數、捐款連結）

檔案大小：約 12KB (474 行)

---

## 前端整合

### 現有架構

目前前端已實作 GraphQL 查詢與 in-memory 快取機制：

```typescript
// packages/e-info/utils/header-data.ts
const CACHE_TTL_MS = 60 * 1000  // 60 秒

export async function fetchHeaderData(): Promise<HeaderContextData> {
  // 1. 檢查快取是否有效
  // 2. 若快取有效，直接回傳
  // 3. 若快取過期，執行 5 個 GraphQL 查詢
  // 4. 更新快取
}
```

### 建議修改

修改 `fetchHeaderData()` 函數，採用 JSON API 優先、GraphQL fallback 的機制：

```typescript
// packages/e-info/utils/header-data.ts

const ENV = process.env.NEXT_PUBLIC_ENV || 'local'

function getHeaderApiEndpoint(): string {
  switch (ENV) {
    case 'prod':
      return 'https://eic-info-cms-gql-prod-1090198686704.asia-east1.run.app/api/header'
    case 'dev':
    default:
      return 'https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/header'
  }
}

async function fetchFromJsonApi(): Promise<HeaderContextData> {
  const endpoint = getHeaderApiEndpoint()
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 10000) // 10 秒 timeout

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    signal: controller.signal,
  })

  if (!response.ok) {
    throw new Error(`Header API returned status ${response.status}`)
  }

  return response.json()
}

async function fetchFromGraphQL(): Promise<HeaderContextData> {
  // 現有的 5 個 GraphQL 查詢邏輯
  const client = getGqlClient()
  const [sectionsResult, tagsResult, ...] = await Promise.all([...])
  return { sections, featuredTags, topics, newsBarPicks, siteConfigs }
}

export async function fetchHeaderData(): Promise<HeaderContextData> {
  const now = Date.now()

  // 快取檢查（同現有邏輯）
  if (cachedHeaderData && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedHeaderData
  }

  let data: HeaderContextData

  try {
    // 優先嘗試 JSON API
    data = await fetchFromJsonApi()
    console.log('[Header] Successfully fetched data from JSON API')
  } catch (jsonApiError) {
    // JSON API 失敗，fallback 到 GraphQL
    console.warn('[Header] JSON API failed, falling back to GraphQL:', jsonApiError)

    try {
      data = await fetchFromGraphQL()
      console.log('[Header] Successfully fetched data from GraphQL (fallback)')
    } catch (graphqlError) {
      // 兩個都失敗，嘗試回傳過期快取
      if (cachedHeaderData) {
        console.warn('[Header] Returning stale cached data due to fetch error')
        return cachedHeaderData
      }
      throw graphqlError
    }
  }

  // 更新快取
  cachedHeaderData = data
  cacheTimestamp = now

  return data
}
```

### 相關程式碼位置

- `packages/e-info/utils/header-data.ts` - API 呼叫與 fallback 邏輯
- `packages/e-info/contexts/header-context.tsx` - Header Context 定義
- `packages/e-info/graphql/query/section.ts` - GraphQL 查詢與型別定義
- `packages/e-info/components/layout/header/header.tsx` - Header 元件
- `packages/e-info/components/layout/footer.tsx` - Footer 元件

---

## 實作步驟

### Phase 1: 後端實作 (CMS)

1. 在 CMS 新增 `/api/header` endpoint
2. 實作資料查詢邏輯（參考上述 GraphQL 查詢）
3. 設定 Cache-Control headers
4. 部署至 dev 環境測試

### Phase 2: 前端整合

1. 修改 `packages/e-info/utils/header-data.ts`
   - 新增 `getHeaderApiEndpoint()` 函數
   - 新增 `fetchFromJsonApi()` 函數
   - 將現有 GraphQL 邏輯封裝為 `fetchFromGraphQL()` 函數
   - 修改 `fetchHeaderData()` 採用 JSON API 優先機制

2. 測試
   - 驗證 JSON API 正常運作
   - 驗證 fallback 機制（模擬 API 失敗）
   - 驗證 stale cache 機制

### Phase 3: 部署

1. 部署 CMS API 至 prod
2. 更新前端 endpoint 設定
3. 監控 API 健康狀態

---

## 變更記錄

### 2026-02-02
- 初版文件建立
- 定義 API 規格與型別
- 規劃前端整合方案
