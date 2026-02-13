# Category Listing JSON API 規格文件

## 概述

本文件定義 Category listing 頁面所需的 JSON API，用於取代 GraphQL 查詢以提升前五頁的載入效能。

Category 頁面的佈局會根據所屬 Section 的 `style` 欄位而有所不同（default / column），但**資料結構一致**，僅前端渲染差異。

## JSON 檔案路徑

```
{GCS_BUCKET}/json/listing/category/{id}/page-{page}.json
```

- **開發環境**: `https://storage.googleapis.com/statics-e-info-dev/json/listing/category/{id}/page-{page}.json`
- **正式環境**: `https://storage.googleapis.com/statics-e-info-prod/json/listing/category/{id}/page-{page}.json`

### 產生規則

- 每個 category 產生 **page-1 ~ page-5**（最多 5 頁）
- 若 category 文章總數不足 5 頁，僅產生實際頁數
- 每頁 12 篇文章

### 跳過的 Category（不需產生 JSON）

以下 category slug 僅供首頁使用，不需產生 listing JSON：

| Slug | 說明 |
|------|------|
| `homepagegraph` | 首頁輪播大圖用 |
| `breakingnews` | 首頁焦點話題用 |
| `hottopic` | 首頁熱門話題用 |

---

## Response 結構

```typescript
interface CategoryListingResponse {
  /** Category 基本資訊 */
  category: {
    id: string
    slug: string
    name: string
    postsCount: number
  }

  /** 所屬 Section 資訊（含 heroImage 供 column 樣式使用） */
  section: {
    id: string
    slug: string
    name: string
    style: string | null       // "default" 或其他（如 "column"）
    heroImage: {
      resized: ResizedImages | null     // 完整尺寸（hero 大圖用）
      resizedWebp: ResizedImages | null
    } | null
    categories: SectionListingCategory[]  // 同 section 下所有 categories（供 tab 切換）
  }

  /** 同 section.categories，供前端直接取用 */
  categories: SectionListingCategory[]

  /** 分頁文章列表 */
  posts: ListingPost[]

  /** 該 category 的文章總數 */
  totalPosts: number

  /** 目前頁碼（1-based） */
  currentPage: number

  /** 總頁數 */
  totalPages: number
}
```

---

## 對應 GraphQL 查詢

此 JSON 合併了兩個 GraphQL 查詢的結果：

### 查詢 1：Category + Section 資訊（`categoryByIdWithSection`）

取得 category 基本資訊、所屬 section 資訊（含 heroImage）、以及同 section 下所有 sibling categories（供 tab 切換）。

```graphql
query categoryByIdWithSection($categoryId: ID!) {
  categories(where: { id: { equals: $categoryId } }) {
    id
    slug
    name
    postsCount
    section {
      id
      slug
      name
      style
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
      }
    }
  }
}
```

**查詢條件**：
- 依 `categoryId` 篩選 category
- Section heroImage 使用**完整尺寸**（供 column 樣式頁面 hero 大圖）
- Section 下的 categories 依 `sortOrder` 升冪排序

**注意**：
- `section.heroImage` 在 default 樣式下不會用到，但為了統一 JSON 結構仍然包含
- 若 section 沒有設定 heroImage，該欄位為 `null`

### 查詢 2：分頁文章列表（`categoryPostsForListing`）

取得該 category 的分頁文章。

```graphql
query categoryPostsForListing(
  $categoryId: ID!
  $take: Int = 12
  $skip: Int = 0
) {
  categories(where: { id: { equals: $categoryId } }) {
    id
    postsCount
    posts(take: $take, skip: $skip, orderBy: { publishTime: desc }) {
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
  }
}
```

**查詢條件**：
- 依 `categoryId` 篩選
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

## 型別定義

### SectionListingCategory

Section 下的 category 列表（供 tab 切換用）。

```typescript
interface SectionListingCategory {
  id: string
  slug: string
  name: string
  sortOrder: number | null
  postsCount: number
}
```

### ListingPost

分頁列表中的文章。

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

用於 section heroImage。

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

## 前端頁面佈局差異

雖然 JSON 結構一致，但前端會依據 `section.style` 決定頁面佈局：

| | Default 樣式 (`section.style = "default"`) | Column 樣式 (`section.style ≠ "default"`) |
|---|---|---|
| **Header** | Section 名稱（可點擊連結回 section）+ category tab | Hero 大圖 + section 名稱 + category tag（高亮目前的） |
| **文章列表** | 標準兩欄文章格 | 標準兩欄文章格 |
| **用到 section.heroImage** | 否 | 是 |
| **分頁** | 有 | 有 |

---

## 完整 Response 範例

### 範例（`category/1/page-1.json`）

```json
{
  "category": {
    "id": "1",
    "slug": "editorpick",
    "name": "編輯直送",
    "postsCount": 1119
  },
  "section": {
    "id": "1",
    "slug": "news",
    "name": "時事新聞",
    "style": "default",
    "heroImage": null,
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
      },
      {
        "id": "1",
        "slug": "editorpick",
        "name": "編輯直送",
        "sortOrder": 3,
        "postsCount": 1119
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
    },
    {
      "id": "1",
      "slug": "editorpick",
      "name": "編輯直送",
      "sortOrder": 3,
      "postsCount": 1119
    }
  ],
  "posts": [
    {
      "id": "242946",
      "title": "宜蘭開出首張非法旅宿百萬罰單、印度爆發立百病毒、南韓將興建新核電廠",
      "style": "editor",
      "publishTime": "2026-01-27T01:40:46.000Z",
      "contentPreview": null,
      "heroImage": null,
      "ogImage": null,
      "tags": [
        { "id": "3791", "name": "能源轉型" },
        { "id": "60", "name": "生物多樣性" },
        { "id": "56", "name": "核電" }
      ]
    },
    {
      "id": "242940",
      "title": "另一篇文章標題...",
      "style": "news",
      "publishTime": "2026-01-26T08:00:00.000Z",
      "contentPreview": "文章摘要內容...",
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
      "ogImage": {
        "resized": {
          "original": "https://storage.googleapis.com/.../og.jpg",
          "w480": "https://storage.googleapis.com/.../og-w480.jpg",
          "w800": "https://storage.googleapis.com/.../og-w800.jpg"
        },
        "resizedWebp": null
      },
      "tags": [
        { "id": "100", "name": "氣候變遷" }
      ]
    }
  ],
  "totalPosts": 1119,
  "currentPage": 1,
  "totalPages": 94
}
```

---

## 前端整合

前端實作 JSON 優先、GraphQL fallback 的機制：

1. 判斷頁碼是否 ≤ 5
2. 嘗試 fetch JSON 檔案（10 秒 timeout）
3. 若成功：
   - 檢查是否為隱藏 category（`homepagegraph`、`breakingnews`、`hottopic`）→ 回傳 404
   - 直接使用 JSON 資料渲染頁面
4. 若失敗：自動 fallback 到原本的 GraphQL 查詢

**注意**：不使用 in-memory 快取（與首頁不同），因為 listing 頁面的 key space 太大。HTTP 層級的 `Cache-Control` 已足夠。

---

## 變更記錄

### 2026-02-13
- 初版：定義 Category listing JSON API 規格
