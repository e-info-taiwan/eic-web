# Section Listing JSON API 規格文件

## 概述

本文件定義 Section listing 頁面所需的 JSON API，用於取代 GraphQL 查詢以提升前五頁的載入效能。

**重要**：Section 有兩種樣式，查詢內容不同：
- **Default 樣式** (`style = "default"`)：分頁文章列表，前 5 頁產生 JSON
- **Column 樣式** (`style ≠ "default"`)：分類格狀展示，僅產生 1 頁 JSON（無分頁）

## JSON 檔案路徑

```
{GCS_BUCKET}/json/listing/section/{slug}/page-{page}.json
```

- **開發環境**: `https://storage.googleapis.com/statics-e-info-dev/json/listing/section/{slug}/page-{page}.json`
- **正式環境**: `https://storage.googleapis.com/statics-e-info-prod/json/listing/section/{slug}/page-{page}.json`

### 產生規則

| 樣式 | 產生頁數 | 說明 |
|------|----------|------|
| Default (`style = "default"`) | page-1 ~ page-5 | 分頁列表，每頁 12 篇 |
| Column (`style ≠ "default"`) | page-1 | 格狀展示，僅一頁（含所有分類及其文章） |

---

## A. Default 樣式 (`style = "default"`)

### Response 結構

```typescript
interface SectionListingDefaultResponse {
  /** Section 基本資訊 */
  section: {
    id: string
    slug: string
    name: string
    style: 'default'
    postsCount: number
    categories: SectionListingCategory[]
  }

  /** 同 section.categories，供前端直接取用 */
  categories: SectionListingCategory[]

  /** 分頁文章列表 */
  posts: ListingPost[]

  /** 該 section 的文章總數 */
  totalPosts: number

  /** 目前頁碼（1-based） */
  currentPage: number

  /** 總頁數 */
  totalPages: number
}
```

### 對應 GraphQL 查詢

此 JSON 合併了兩個 GraphQL 查詢的結果：

#### 查詢 1：Section 基本資訊 + Categories（`sectionBySlug`）

用於取得 section 基本資訊與分類 tab 列表。

```graphql
query sectionBySlug($slug: String!) {
  sections(where: { slug: { equals: $slug } }) {
    id
    slug
    name
    style
    postsCount
    categories(orderBy: { sortOrder: asc }) {
      id
      slug
      name
      sortOrder
      postsCount
    }
  }
}
```

**查詢條件**：
- 依 `slug` 篩選 section
- Categories 依 `sortOrder` 升冪排序

#### 查詢 2：分頁文章列表（`sectionPostsForListing`）

跨該 section 所有 categories 聚合文章，依發布時間排序分頁。

```graphql
query sectionPostsForListing(
  $sectionSlug: String!
  $take: Int = 12
  $skip: Int = 0
) {
  posts(
    where: { category: { section: { slug: { equals: $sectionSlug } } } }
    take: $take
    skip: $skip
    orderBy: { publishTime: desc }
  ) {
    id
    title
    style
    publishTime
    contentPreview
    heroImage {
      resized {
        original
        w480
        w800
      }
      resizedWebp {
        original
        w480
        w800
      }
    }
    ogImage {
      resized {
        original
        w480
        w800
      }
      resizedWebp {
        original
        w480
        w800
      }
    }
    tags {
      id
      name
    }
  }
  postsCount(
    where: { category: { section: { slug: { equals: $sectionSlug } } } }
  )
}
```

**查詢條件**：
- 篩選該 section slug 下所有 categories 的文章
- Posts 依 `publishTime` 降冪排序
- 每頁 12 篇（`take: 12`）
- `skip` = (page - 1) × 12
- **圖片尺寸**: Card (original, w480, w800)

### 分頁計算

```
totalPages = Math.ceil(totalPosts / 12)
currentPage = 當前頁碼
skip = (currentPage - 1) * 12
```

---

## B. Column 樣式 (`style ≠ "default"`)

### Response 結構

```typescript
interface SectionListingColumnResponse {
  /** Section 完整資訊（含 heroImage） */
  section: {
    id: string
    slug: string
    name: string
    style: string            // 非 "default"，例如 "column"
    description: string | null
    heroImage: {
      resized: ResizedImages | null     // 完整尺寸（hero 大圖用）
      resizedWebp: ResizedImages | null
    } | null
    categories: SectionPageCategory[]
  }

  /** 同 section.categories，供前端直接取用 */
  categories: SectionPageCategory[]
}
```

**注意**：Column 樣式無 `posts`、`totalPosts`、`currentPage`、`totalPages` 欄位，因為文章是包在各 category 內的。

### 對應 GraphQL 查詢（`sectionPageBySlug`）

一次取得 section 完整資訊、所有分類與其文章。

```graphql
query sectionPageBySlug($slug: String!, $postsPerCategory: Int = 3) {
  sections(where: { slug: { equals: $slug } }) {
    id
    slug
    name
    style
    description
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
    categories(orderBy: { sortOrder: asc }) {
      id
      slug
      name
      sortOrder
      postsCount
      featuredPostsInInputOrder {
        id
        title
        publishTime
        contentPreview
        heroImage {
          resized {
            original
            w480
            w800
          }
          resizedWebp {
            original
            w480
            w800
          }
        }
      }
      posts(take: $postsPerCategory, orderBy: { publishTime: desc }) {
        id
        title
        publishTime
        contentPreview
        heroImage {
          resized {
            original
            w480
            w800
          }
          resizedWebp {
            original
            w480
            w800
          }
        }
      }
    }
  }
}
```

**查詢條件**：
- 依 `slug` 篩選 section
- Section heroImage 使用**完整尺寸**（original ~ w2400），因為是頁面 hero 大圖
- Categories 依 `sortOrder` 升冪排序
- 每個 category 取 `featuredPostsInInputOrder`（精選文章，依 CMS 輸入順序）
- 每個 category 另取 3 篇一般文章（`posts`，依 `publishTime` 降冪排序）
- Category 內的文章圖片使用 **Card 尺寸**（original, w480, w800）

**前端顯示邏輯**：
- 精選文章 (`featuredPostsInInputOrder`) 優先顯示
- 再補上一般文章 (`posts`)，去除重複（以 post id 判斷）
- 每個 category 最多顯示 3 篇（1 大卡 + 2 小卡）

---

## 共用型別

### SectionListingCategory

用於 Default 樣式的分類 tab 列表。

```typescript
interface SectionListingCategory {
  id: string
  slug: string
  name: string
  sortOrder: number | null
  postsCount: number
}
```

### SectionPageCategory

用於 Column 樣式的分類格狀展示，包含文章。

```typescript
interface SectionPageCategory {
  id: string
  slug: string
  name: string
  sortOrder: number | null
  postsCount: number
  featuredPostsInInputOrder: SectionPost[]  // 精選文章（依 CMS 輸入順序）
  posts: SectionPost[]                       // 一般文章（依 publishTime 降冪）
}
```

### ListingPost

分頁列表中的文章，含 ogImage 與 tags（供列表卡片顯示）。

```typescript
interface ListingPost {
  id: string
  title: string
  style: string              // 文章樣式，例如 "news", "column", "editor"
  publishTime: string        // ISO 8601 格式
  contentPreview: string | null
  heroImage: {
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
  } | null
  ogImage: {
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
  } | null
  tags: { id: string; name: string }[]
}
```

### SectionPost

Column 樣式中各 category 內的文章（較精簡，不含 ogImage/tags）。

```typescript
interface SectionPost {
  id: string
  title: string
  publishTime: string        // ISO 8601 格式
  contentPreview: string | null
  heroImage: {
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
  } | null
}
```

### ResizedImagesCard（Card 尺寸）

用於文章卡片縮圖。

```typescript
interface ResizedImagesCard {
  original: string
  w480: string
  w800: string
}
```

### ResizedImages（完整尺寸）

僅用於 Column 樣式的 section heroImage。

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

## 兩種樣式差異對照

| | Default 樣式 | Column 樣式 |
|---|---|---|
| **判斷條件** | `section.style === "default"` | `section.style !== "default"` |
| **頁面佈局** | 文章列表 + 分頁 | Hero 大圖 + 分類格狀 |
| **GraphQL 查詢** | `sectionBySlug` + `sectionPostsForListing` | `sectionPageBySlug` |
| **JSON 頁數** | page-1 ~ page-5 | 僅 page-1 |
| **文章來源** | 跨 categories 聚合，統一分頁 | 各 category 獨立取 3 篇 |
| **精選文章** | 無 | 有 (`featuredPostsInInputOrder`) |
| **Section heroImage** | 不需要 | 需要（完整尺寸） |
| **Section description** | 不需要 | 需要 |
| **文章 ogImage** | 需要 | 不需要 |
| **文章 tags** | 需要 | 不需要 |
| **文章 style 欄位** | 需要 | 不需要 |
| **postsCount** | Section 層級（totalPosts） | Category 層級 |

---

## Section 參考資料

### 目前各 Section 的樣式設定

| ID | Slug | Name | Style | 說明 |
|----|------|------|-------|------|
| 1 | news | 時事新聞 | default | 分頁列表，產生 page-1 ~ page-5 |
| 2 | column | 專欄 | column | 格狀展示，僅產生 page-1 |
| 3 | supplement | 副刊 | column | 格狀展示，僅產生 page-1 |
| 4 | opinion | 評論 | *(待確認)* | |
| 5 | greenconsumption | 綠色消費 | *(待確認)* | |
| 6 | event | 活動 | *(待確認)* | |

---

## 完整 Response 範例

### Default 樣式範例（`section/news/page-1.json`）

```json
{
  "section": {
    "id": "1",
    "slug": "news",
    "name": "時事新聞",
    "style": "default",
    "postsCount": 85000,
    "categories": [
      {
        "id": "77",
        "slug": "taiwannews",
        "name": "台灣新聞",
        "sortOrder": 1,
        "postsCount": 41867
      },
      {
        "id": "82",
        "slug": "internationalnews",
        "name": "國際新聞",
        "sortOrder": 2,
        "postsCount": 43567
      }
    ]
  },
  "categories": [
    {
      "id": "77",
      "slug": "taiwannews",
      "name": "台灣新聞",
      "sortOrder": 1,
      "postsCount": 41867
    },
    {
      "id": "82",
      "slug": "internationalnews",
      "name": "國際新聞",
      "sortOrder": 2,
      "postsCount": 43567
    }
  ],
  "posts": [
    {
      "id": "242946",
      "title": "宜蘭開出首張非法旅宿百萬罰單...",
      "style": "editor",
      "publishTime": "2026-01-27T01:40:46.000Z",
      "contentPreview": "文章摘要...",
      "heroImage": {
        "resized": {
          "original": "https://storage.googleapis.com/.../image.jpg",
          "w480": "https://storage.googleapis.com/.../image-w480.jpg",
          "w800": "https://storage.googleapis.com/.../image-w800.jpg"
        },
        "resizedWebp": {
          "original": "https://storage.googleapis.com/.../image.webp",
          "w480": "https://storage.googleapis.com/.../image-w480.webp",
          "w800": "https://storage.googleapis.com/.../image-w800.webp"
        }
      },
      "ogImage": null,
      "tags": [
        { "id": "3791", "name": "能源轉型" },
        { "id": "56", "name": "核電" }
      ]
    }
  ],
  "totalPosts": 85000,
  "currentPage": 1,
  "totalPages": 7084
}
```

### Column 樣式範例（`section/column/page-1.json`）

```json
{
  "section": {
    "id": "2",
    "slug": "column",
    "name": "專欄",
    "style": "column",
    "description": "專欄簡介文字...",
    "heroImage": {
      "resized": {
        "original": "https://storage.googleapis.com/.../hero.jpg",
        "w480": "https://storage.googleapis.com/.../hero-w480.jpg",
        "w800": "https://storage.googleapis.com/.../hero-w800.jpg",
        "w1200": "https://storage.googleapis.com/.../hero-w1200.jpg",
        "w1600": "https://storage.googleapis.com/.../hero-w1600.jpg",
        "w2400": "https://storage.googleapis.com/.../hero-w2400.jpg"
      },
      "resizedWebp": null
    },
    "categories": [
      {
        "id": "5",
        "slug": "ourisland",
        "name": "我們的島",
        "sortOrder": 1,
        "postsCount": 2431,
        "featuredPostsInInputOrder": [
          {
            "id": "242001",
            "title": "精選文章標題",
            "publishTime": "2026-01-20T00:00:00.000Z",
            "contentPreview": "精選文章摘要...",
            "heroImage": {
              "resized": {
                "original": "https://storage.googleapis.com/.../img.jpg",
                "w480": "https://storage.googleapis.com/.../img-w480.jpg",
                "w800": "https://storage.googleapis.com/.../img-w800.jpg"
              },
              "resizedWebp": null
            }
          }
        ],
        "posts": [
          {
            "id": "242950",
            "title": "一般文章標題",
            "publishTime": "2026-01-25T00:00:00.000Z",
            "contentPreview": "文章摘要...",
            "heroImage": {
              "resized": {
                "original": "https://storage.googleapis.com/.../img.jpg",
                "w480": "https://storage.googleapis.com/.../img-w480.jpg",
                "w800": "https://storage.googleapis.com/.../img-w800.jpg"
              },
              "resizedWebp": null
            }
          }
        ]
      }
    ]
  },
  "categories": [
    {
      "id": "5",
      "slug": "ourisland",
      "name": "我們的島",
      "sortOrder": 1,
      "postsCount": 2431,
      "featuredPostsInInputOrder": [],
      "posts": []
    }
  ]
}
```

---

## 前端整合

前端實作 JSON 優先、GraphQL fallback 的機制：

1. 判斷頁碼是否 ≤ 5（Default 樣式）或固定第 1 頁（Column 樣式）
2. 嘗試 fetch JSON 檔案（10 秒 timeout）
3. 若成功：
   - Default 樣式：直接使用 JSON 資料渲染列表
   - Column 樣式：直接使用 JSON 資料渲染格狀展示
4. 若失敗：自動 fallback 到原本的 GraphQL 查詢

**注意**：不使用 in-memory 快取（與首頁不同），因為 listing 頁面的 key space 太大。HTTP 層級的 `Cache-Control` 已足夠。

---

## 變更記錄

### 2026-02-13
- 初版：定義 Section listing JSON API 規格
- 區分 Default 樣式與 Column 樣式的不同資料需求
