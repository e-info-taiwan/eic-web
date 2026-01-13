# 首頁 JSON API 規格文件

## 概述

本文件定義首頁所需的統一 JSON API，用於取代目前分散的 7 個 GraphQL 查詢，以提升效能並減少網路請求次數。

## API Endpoint

建議路徑：
- **開發環境**: `https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/homepage`
- **Staging**: `https://readr-gql-staging-4g6paft7cq-de.a.run.app/api/homepage`
- **正式環境**: `https://readr-gql-prod-4g6paft7cq-de.a.run.app/api/homepage`

## HTTP 規格

- **Method**: `GET`
- **Content-Type**: `application/json`
- **Cache-Control**: 建議 `public, max-age=60` (可依需求調整)

---

## Response 結構

```typescript
interface HomepageApiResponse {
  // 大分類資料 (時事新聞、專欄、副刊、綠色消費)
  sections: Section[]

  // 焦點話題 (category slug = "hottopic")
  highlightPicks: HomepagePick[]

  // 首頁輪播大圖 (category slug = "homepepicks")
  carouselPicks: HomepagePick[]

  // 深度專題 (isPinned = true, status = "published")
  topics: Topic[]

  // 重要圖表 (最新一筆, state = "published")
  infoGraph: InfoGraph | null

  // 首頁廣告 - 時事新聞下方 (showOnHomepage = true, state = "active")
  ads: Ad[]

  // 首頁廣告 - 深度專題下方 (showOnHomepageDeepTopic = true, state = "active")
  deepTopicAds: Ad[]
}
```

---

## 各欄位詳細規格

### 1. sections (大分類資料)

對應目前的 `multipleSectionsWithCategoriesAndPosts` 查詢。

**查詢條件**:
- Section IDs: `['3', '4', '5', '6']`
- 每個 category 取 8 篇文章
- Categories 依 `sortOrder` 升冪排序
- Posts 依 `publishTime` 降冪排序

**GraphQL 等效查詢**:
```graphql
query {
  sections(where: { id: { in: ["3", "4", "5", "6"] } }, orderBy: { id: asc }) {
    id
    slug
    name
    categories(orderBy: { sortOrder: asc }) {
      id
      slug
      name
      sortOrder
      postsCount
      posts(take: 8, orderBy: { publishTime: desc }) {
        id
        title
        publishTime
        brief
        contentApiData
        heroImage {
          resized {
            original
            w480
            w800
            w1200
            w1600
            w2400
          }
          resizedWebp {
            original
            w480
            w800
            w1200
            w1600
            w2400
          }
        }
      }
    }
  }
}
```

**Section ID 對應**:
| ID | Slug | Name | 用途 |
|----|------|------|------|
| 3 | latestnews | 時事新聞 | NewsSection |
| 4 | column | 專欄 | SpecialColumnSection |
| 5 | sub | 副刊 | SupplementSection |
| 6 | green | 綠色消費 | GreenConsumptionSection |

**TypeScript 型別**:
```typescript
interface Section {
  id: string
  slug: string
  name: string
  categories: SectionCategory[]
}

interface SectionCategory {
  id: string
  slug: string
  name: string
  sortOrder: number | null
  postsCount: number
  posts: SectionPost[]
}

interface SectionPost {
  id: string
  title: string
  publishTime: string  // ISO 8601 格式
  brief: string | object | null
  contentApiData: ContentApiDataBlock[] | null
  heroImage: {
    resized: ResizedImages | null
    resizedWebp: ResizedImages | null
  } | null
}

interface ContentApiDataBlock {
  id: string
  type: string
  content?: string[]
  styles?: Record<string, unknown>
  alignment?: string
}
```

---

### 2. highlightPicks (焦點話題)

對應目前的 `homepagePicksByCategory` 查詢，categorySlug = `"hottopic"`。

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
    sortOrder
    customUrl
    customTitle
    customDescription
    customImage {
      resized {
        original
        w480
        w800
        w1200
        w1600
        w2400
      }
      resizedWebp {
        original
        w480
        w800
        w1200
        w1600
        w2400
      }
    }
    posts {
      id
      title
      publishTime
      heroImage {
        resized {
          original
          w480
          w800
          w1200
          w1600
          w2400
        }
        resizedWebp {
          original
          w480
          w800
          w1200
          w1600
          w2400
        }
      }
    }
    category {
      id
      slug
      name
    }
  }
}
```

**TypeScript 型別**:
```typescript
interface HomepagePick {
  id: string
  sortOrder: number
  customUrl: string | null
  customTitle: string | null
  customDescription: string | null
  customImage: {
    resized: ResizedImages | null
    resizedWebp: ResizedImages | null
  } | null
  posts: {
    id: string
    title: string
    publishTime: string
    heroImage: {
      resized: ResizedImages | null
      resizedWebp: ResizedImages | null
    } | null
  } | null
  category: {
    id: string
    slug: string
    name: string
  } | null
}
```

---

### 3. carouselPicks (首頁輪播大圖)

對應目前的 `homepagePicksForCarousel` 查詢。

**查詢條件**:
- Category slug: `"homepepicks"`
- 依 `sortOrder` 升冪排序

**GraphQL 等效查詢**:
```graphql
query {
  homepagePicks(
    where: { category: { slug: { equals: "homepepicks" } } }
    orderBy: { sortOrder: asc }
  ) {
    # 同 highlightPicks 欄位
  }
}
```

---

### 4. topics (深度專題)

對應目前的 `topicsWithPosts` 查詢。

**查詢條件**:
- `status = "published"`
- `isPinned = true`
- 依 `id` 升冪排序
- 每個 topic 取 4 篇文章
- Posts 依 `publishTime` 降冪排序

**GraphQL 等效查詢**:
```graphql
query {
  topics(
    where: { status: { equals: "published" }, isPinned: { equals: true } }
    orderBy: { id: asc }
  ) {
    id
    title
    status
    content
    heroImage {
      resized {
        original
        w480
        w800
        w1200
        w1600
        w2400
      }
      resizedWebp {
        original
        w480
        w800
        w1200
        w1600
        w2400
      }
    }
    postsCount
    posts(take: 4, orderBy: { publishTime: desc }) {
      id
      title
      publishTime
      brief
      heroImage {
        resized {
          original
          w480
          w800
          w1200
          w1600
          w2400
        }
        resizedWebp {
          original
          w480
          w800
          w1200
          w1600
          w2400
        }
      }
    }
    isPinned
  }
}
```

**TypeScript 型別**:
```typescript
interface Topic {
  id: string
  title: string
  status: string
  content: string | null
  heroImage: {
    resized: ResizedImages | null
    resizedWebp: ResizedImages | null
  } | null
  postsCount: number
  posts: TopicPost[]
  isPinned: boolean
}

interface TopicPost {
  id: string
  title: string
  publishTime: string
  brief: string | object | null
  heroImage: {
    resized: ResizedImages | null
    resizedWebp: ResizedImages | null
  } | null
}
```

---

### 5. infoGraph (重要圖表)

對應目前的 `latestInfoGraph` 查詢。

**查詢條件**:
- `state = "published"`
- 依 `createdAt` 降冪排序
- 只取 1 筆

**GraphQL 等效查詢**:
```graphql
query {
  infoGraphs(
    where: { state: { equals: "published" } }
    orderBy: { createdAt: desc }
    take: 1
  ) {
    id
    name
    title
    description
    youtubeUrl
    state
    image {
      resized {
        original
        w480
        w800
        w1200
        w1600
        w2400
      }
      resizedWebp {
        original
        w480
        w800
        w1200
        w1600
        w2400
      }
    }
  }
}
```

**TypeScript 型別**:
```typescript
interface InfoGraph {
  id: string
  name: string | null
  title: string | null
  description: string | null
  youtubeUrl: string | null
  state: string
  image: {
    resized: ResizedImages | null
    resizedWebp: ResizedImages | null
  } | null
}
```

---

### 6. ads (首頁廣告 - 時事新聞下方)

對應目前的 `homepageAds` 查詢。

**查詢條件**:
- `showOnHomepage = true`
- `state = "active"`
- 依 `sortOrder` 升冪排序

**GraphQL 等效查詢**:
```graphql
query {
  ads(
    where: { showOnHomepage: { equals: true }, state: { equals: "active" } }
    orderBy: { sortOrder: asc }
  ) {
    id
    name
    showOnHomepage
    showOnHomepageDeepTopic
    state
    sortOrder
    imageUrl
    image {
      resized {
        original
        w480
        w800
        w1200
        w1600
        w2400
      }
      resizedWebp {
        original
        w480
        w800
        w1200
        w1600
        w2400
      }
    }
  }
}
```

**TypeScript 型別**:
```typescript
interface Ad {
  id: string
  name: string | null
  showOnHomepage: boolean
  showOnHomepageDeepTopic: boolean
  state: string
  sortOrder: number | null
  imageUrl: string | null
  image: {
    resized: ResizedImages | null
    resizedWebp: ResizedImages | null
  } | null
}
```

---

### 7. deepTopicAds (首頁廣告 - 深度專題下方)

對應目前的 `homepageDeepTopicAds` 查詢。

**查詢條件**:
- `showOnHomepageDeepTopic = true`
- `state = "active"`
- 依 `sortOrder` 升冪排序

**GraphQL 等效查詢**:
```graphql
query {
  ads(
    where: { showOnHomepageDeepTopic: { equals: true }, state: { equals: "active" } }
    orderBy: { sortOrder: asc }
  ) {
    # 同 ads 欄位
  }
}
```

---

## 共用型別

### ResizedImages

```typescript
interface ResizedImages {
  original: string | null
  w480: string | null
  w800: string | null
  w1200: string | null
  w1600: string | null
  w2400: string | null
}
```

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
        {
          "id": "7",
          "slug": "taiwannews",
          "name": "台灣新聞",
          "sortOrder": 1,
          "postsCount": 100,
          "posts": [
            {
              "id": "238659",
              "title": "最新測試文章",
              "publishTime": "2025-11-23T00:00:00.000Z",
              "brief": "文章摘要...",
              "contentApiData": null,
              "heroImage": {
                "resized": {
                  "original": "https://...",
                  "w480": "https://...",
                  "w800": "https://...",
                  "w1200": "https://...",
                  "w1600": "https://...",
                  "w2400": "https://..."
                },
                "resizedWebp": {
                  "original": "https://...",
                  "w480": "https://...",
                  "w800": "https://...",
                  "w1200": "https://...",
                  "w1600": "https://...",
                  "w2400": "https://..."
                }
              }
            }
          ]
        }
      ]
    }
  ],
  "highlightPicks": [],
  "carouselPicks": [],
  "topics": [
    {
      "id": "3",
      "title": "直擊阿聯氣候新時代",
      "status": "published",
      "content": "專題描述...",
      "heroImage": null,
      "postsCount": 4,
      "posts": [],
      "isPinned": true
    }
  ],
  "infoGraph": {
    "id": "1",
    "name": "重要圖表",
    "title": "圖表標題",
    "description": "圖表描述",
    "youtubeUrl": null,
    "state": "published",
    "image": null
  },
  "ads": [
    {
      "id": "2",
      "name": "測試廣告圖",
      "showOnHomepage": true,
      "showOnHomepageDeepTopic": false,
      "state": "active",
      "sortOrder": 1,
      "imageUrl": "https://e-info.org.tw/node/242562",
      "image": {
        "resized": {
          "original": "https://storage.googleapis.com/...",
          "w480": "https://storage.googleapis.com/...",
          "w800": "https://storage.googleapis.com/...",
          "w1200": null,
          "w1600": null,
          "w2400": null
        },
        "resizedWebp": null
      }
    }
  ],
  "deepTopicAds": [
    {
      "id": "4",
      "name": "深度專題下方的廣告1",
      "showOnHomepage": false,
      "showOnHomepageDeepTopic": true,
      "state": "active",
      "sortOrder": 1,
      "imageUrl": "www.mirrormedia.mg",
      "image": {
        "resized": {
          "original": "https://storage.googleapis.com/...",
          "w480": "https://storage.googleapis.com/...",
          "w800": "https://storage.googleapis.com/...",
          "w1200": null,
          "w1600": null,
          "w2400": null
        },
        "resizedWebp": null
      }
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
    "message": "Failed to fetch homepage data"
  }
}
```

HTTP Status Codes:
- `200`: 成功
- `500`: 伺服器錯誤
- `503`: 服務暫時不可用

---

## 效能建議

1. **快取策略**: 建議在 CDN 層設定 60 秒快取
2. **資料庫查詢**: 可考慮使用 DataLoader 批次查詢，避免 N+1 問題
3. **並行查詢**: 後端可使用 Promise.all 並行執行各個查詢
4. **壓縮**: 啟用 gzip/brotli 壓縮

---

## 完整 Response 範例檔案

完整的 JSON response 範例請參考：
- **[homepage-api-example.json](./homepage-api-example.json)** - 從 dev 環境 GraphQL API 實際查詢產生的完整 response

此檔案包含：
- 4 個 sections（共 86 個 categories，每個 category 最多 8 篇文章）
- 3 個 highlightPicks
- 3 個 carouselPicks
- 4 個 topics（每個 topic 4 篇文章）
- 1 個 infoGraph
- 2 個 ads（showOnHomepage）
- 1 個 deepTopicAds（showOnHomepageDeepTopic）

---

## 前端整合

前端已實作 JSON API 優先、GraphQL fallback 的機制：

1. 優先嘗試呼叫 `/api/homepage` JSON API
2. 若失敗（網路錯誤、500 錯誤等），自動 fallback 到原本的 7 個 GraphQL 查詢
3. Fallback 機制確保服務可用性

相關程式碼位於：
- `packages/e-info/utils/homepage-api.ts` - API 呼叫與 fallback 邏輯
- `packages/e-info/pages/index.tsx` - 首頁資料獲取
