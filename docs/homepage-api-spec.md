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
  // 大分類資料 (時事新聞、專欄、副刊)
  sections: Section[]

  // 焦點話題 (category slug = "breakingnews") - 使用 card 尺寸圖片
  highlightPicks: HomepagePick[]

  // 首頁輪播大圖 (category slug = "homepagegraph") - 使用完整尺寸圖片
  carouselPicks: HomepagePickCarousel[]

  // 深度專題 (isPinned = true, status = "published") - 使用 card 尺寸圖片
  topics: Topic[]

  // 重要圖表 (最新一筆, state = "published") - 使用 card 尺寸圖片
  infoGraph: InfoGraph | null

  // 首頁廣告 - 時事新聞下方 (showOnHomepage = true, state = "active") - 使用 card 尺寸圖片
  ads: Ad[]

  // 首頁廣告 - 深度專題下方 (showOnHomepageDeepTopic = true, state = "active") - 使用 card 尺寸圖片
  deepTopicAds: Ad[]

  // Section-level posts (各大分類的跨分類文章，預設顯示用)
  newsPosts?: SectionPost[]       // 時事新聞 section 文章
  columnPosts?: SectionPost[]     // 專欄 section 文章
  supplementPosts?: SectionPost[] // 副刊 section 文章

  // 綠色消費 tag 文章 (以 tag 為資料來源，非 section/category)
  greenMain?: SectionPost[]       // 主「綠色消費」tag 文章
  greenBuy?: SectionPost[]        // 「買前必讀」tag 文章
  greenFood?: SectionPost[]       // 「食材食品」tag 文章
  greenClothing?: SectionPost[]   // 「衣著紡織」tag 文章
  greenLeisure?: SectionPost[]    // 「休閒娛樂」tag 文章
}
```

---

## 圖片尺寸策略

為了減少 API payload 大小，我們採用響應式圖片策略：

### Card 尺寸 (ResizedImagesCard)
用於：文章卡片、縮圖、列表顯示、焦點話題、深度專題、廣告等

```typescript
interface ResizedImagesCard {
  original: string | null
  w480: string | null
  w800: string | null
}
```

### 完整尺寸 (ResizedImages)
用於：首頁輪播大圖（需要在桌面版顯示較大的 hero 圖片）

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

**效益**：使用 Card 尺寸可減少約 50-60% 的 API payload 大小。

---

## 各欄位詳細規格

### 1. sections (大分類資料)

對應目前的 `multipleSectionsWithCategoriesAndPosts` 查詢。

**查詢條件**:
- Section IDs: `['1', '2', '3']`（不含綠色消費，綠色消費改為 tag-based 查詢）
- 每個 category 取 8 篇文章（精選文章 + 一般文章）
- Categories 依 `sortOrder` 升冪排序
- Posts 依 `publishTime` 降冪排序
- **精選文章**: 使用 `featuredPostsInInputOrder` 欄位取得（依 CMS 輸入順序）
- **顯示邏輯**: 精選文章優先顯示，再補上一般文章（去重複）
- **圖片尺寸**: Card (original, w480, w800)

**GraphQL 等效查詢**:
```graphql
query {
  sections(where: { id: { in: ["1", "2", "3"] } }, orderBy: { id: asc }) {
    id
    slug
    name
    categories(orderBy: { sortOrder: asc }) {
      id
      slug
      name
      sortOrder
      postsCount
      # 精選文章 (依 CMS 輸入順序)
      featuredPostsInInputOrder {
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
          }
          resizedWebp {
            original
            w480
            w800
          }
        }
      }
      # 一般文章 (依發布時間)
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

**Section ID 對應**:
| ID | Slug | Name | 用途 |
|----|------|------|------|
| 1 | news | 時事新聞 | NewsSection |
| 2 | column | 專欄 | SpecialColumnSection |
| 3 | supplement | 副刊 | SupplementSection |

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
  featuredPostsInInputOrder: SectionPost[]  // 精選文章 (依 CMS 輸入順序)
}

interface SectionPost {
  id: string
  title: string
  publishTime: string  // ISO 8601 格式
  brief: string | object | null
  contentApiData: ContentApiDataBlock[] | null
  heroImage: {
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
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

### 1.5. newsPosts / columnPosts / supplementPosts (Section-level 文章)

對應目前的 `homepageSectionPosts` 查詢。各大分類的跨分類文章，用於預設顯示（未選擇子分類 tab 時）。

**查詢條件**:
- 依 section ID 篩選：時事新聞 (1)、專欄 (2)、副刊 (3)
- 每個 section 取 8 篇文章
- Posts 依 `publishTime` 降冪排序
- **圖片尺寸**: Card (original, w480, w800)

**GraphQL 等效查詢**:
```graphql
query ($postsPerSection: Int = 8) {
  newsPosts: posts(
    where: { category: { section: { id: { equals: "1" } } } }
    take: $postsPerSection
    orderBy: { publishTime: desc }
  ) {
    id
    title
    publishTime
    brief
    contentApiData
    heroImage {
      resized { original, w480, w800 }
      resizedWebp { original, w480, w800 }
    }
  }
  columnPosts: posts(
    where: { category: { section: { id: { equals: "2" } } } }
    take: $postsPerSection
    orderBy: { publishTime: desc }
  ) {
    # 同上
  }
  supplementPosts: posts(
    where: { category: { section: { id: { equals: "3" } } } }
    take: $postsPerSection
    orderBy: { publishTime: desc }
  ) {
    # 同上
  }
}
```

---

### 1.6. greenMain / greenBuy / greenFood / greenClothing / greenLeisure (綠色消費 tag 文章)

對應目前的 `homepageGreenConsumptionPosts` 查詢。綠色消費區塊改為以 **tag** 為資料來源（不再使用 section/category 結構）。

**資料來源 (Tag 名稱)**:
| 欄位 | Tag 名稱 | 用途 |
|------|----------|------|
| greenMain | 綠色消費 | 預設顯示的主 tag 文章 |
| greenBuy | 買前必讀 | 子 tab 文章 |
| greenFood | 食材食品 | 子 tab 文章 |
| greenClothing | 衣著紡織 | 子 tab 文章 |
| greenLeisure | 休閒娛樂 | 子 tab 文章 |

**查詢條件**:
- 依 tag name 篩選（寫死 5 個 tag 名稱）
- 每個 tag 取 3 篇文章
- Posts 依 `publishTime` 降冪排序
- **圖片尺寸**: Card (original, w480, w800)

**GraphQL 等效查詢**:
```graphql
query ($postsPerTag: Int = 3) {
  greenMain: posts(
    where: { tags: { some: { name: { equals: "綠色消費" } } } }
    take: $postsPerTag
    orderBy: { publishTime: desc }
  ) {
    id
    title
    publishTime
    brief
    contentApiData
    heroImage {
      resized { original, w480, w800 }
      resizedWebp { original, w480, w800 }
    }
  }
  greenBuy: posts(
    where: { tags: { some: { name: { equals: "買前必讀" } } } }
    take: $postsPerTag
    orderBy: { publishTime: desc }
  ) {
    # 同上
  }
  greenFood: posts(
    where: { tags: { some: { name: { equals: "食材食品" } } } }
    take: $postsPerTag
    orderBy: { publishTime: desc }
  ) {
    # 同上
  }
  greenClothing: posts(
    where: { tags: { some: { name: { equals: "衣著紡織" } } } }
    take: $postsPerTag
    orderBy: { publishTime: desc }
  ) {
    # 同上
  }
  greenLeisure: posts(
    where: { tags: { some: { name: { equals: "休閒娛樂" } } } }
    take: $postsPerTag
    orderBy: { publishTime: desc }
  ) {
    # 同上
  }
}
```

**前端處理**:
- 綠色消費 tag 資料始終從 GraphQL 獲取（JSON API 不含此資料時）
- 前端在 `fetchHomepageData` 中會與主 API 請求並行查詢此資料
- 預設顯示 `greenMain`（綠色消費 tag），點擊子 tab 切換到對應 tag 文章

**TypeScript 型別**:
```typescript
interface GreenConsumptionData {
  posts: SectionPost[]           // 主「綠色消費」tag 文章（預設顯示）
  subTags: GreenConsumptionTag[] // 子 tag（買前必讀、食材食品、衣著紡織、休閒娛樂）
}

interface GreenConsumptionTag {
  name: string
  posts: SectionPost[]
}
```

---

### 2. highlightPicks (焦點話題)

對應目前的 `homepagePicksByCategory` 查詢，categorySlug = `"breakingnews"`。

**查詢條件**:
- Category slug: `"breakingnews"`
- 依 `sortOrder` 升冪排序
- **圖片尺寸**: Card (original, w480, w800)

**GraphQL 等效查詢**:
```graphql
query {
  homepagePicks(
    where: { category: { slug: { equals: "breakingnews" } } }
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
      }
      resizedWebp {
        original
        w480
        w800
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
        }
        resizedWebp {
          original
          w480
          w800
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
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
  } | null
  posts: {
    id: string
    title: string
    publishTime: string
    heroImage: {
      resized: ResizedImagesCard | null
      resizedWebp: ResizedImagesCard | null
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
- Category slug: `"homepagegraph"`
- 依 `sortOrder` 升冪排序
- **圖片尺寸**: 完整尺寸 (original, w480, w800, w1200, w1600, w2400) - 輪播需要較大圖片

**GraphQL 等效查詢**:
```graphql
query {
  homepagePicks(
    where: { category: { slug: { equals: "homepagegraph" } } }
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
interface HomepagePickCarousel {
  id: string
  sortOrder: number
  customUrl: string | null
  customTitle: string | null
  customDescription: string | null
  customImage: {
    resized: ResizedImages | null  // 完整尺寸
    resizedWebp: ResizedImages | null
  } | null
  posts: {
    id: string
    title: string
    publishTime: string
    heroImage: {
      resized: ResizedImages | null  // 完整尺寸
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

### 4. topics (深度專題)

對應目前的 `topicsWithPosts` 查詢。

**查詢條件**:
- `status = "published"`
- 依 `sortOrder` 升冪排序（CMS 可設定顯示順序）
- 每個 topic 取 4 篇文章
- Posts 依 `publishTime` 降冪排序
- **圖片尺寸**: Card (original, w480, w800)

**排序與顯示邏輯** (前端處理):
1. `isPinned = true` 的 topics 優先顯示，依 `sortOrder` 升冪排序
2. `isPinned = false` 的 topics，依 `sortOrder` 升冪排序
3. 總共取前 4 筆顯示

**GraphQL 等效查詢**:
```graphql
query {
  topics(
    where: { status: { equals: "published" } }
    orderBy: { sortOrder: asc }
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
      }
      resizedWebp {
        original
        w480
        w800
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
        }
        resizedWebp {
          original
          w480
          w800
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
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
  } | null
  postsCount: number
  posts: TopicPost[]
  isPinned: boolean
  sortOrder: number | null  // 排序順序 (用於首頁排序)
}

interface TopicPost {
  id: string
  title: string
  publishTime: string
  brief: string | object | null
  heroImage: {
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
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
- **圖片尺寸**: Card (original, w480, w800)

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
      }
      resizedWebp {
        original
        w480
        w800
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
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
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
- **圖片尺寸**: Card (original, w480, w800)

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
      }
      resizedWebp {
        original
        w480
        w800
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
    resized: ResizedImagesCard | null
    resizedWebp: ResizedImagesCard | null
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
- **圖片尺寸**: Card (original, w480, w800)

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

### ResizedImagesCard (卡片尺寸)

用於大部分元件（文章卡片、焦點話題、深度專題、廣告等）

```typescript
interface ResizedImagesCard {
  original: string | null
  w480: string | null
  w800: string | null
}
```

### ResizedImages (完整尺寸)

僅用於首頁輪播大圖

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
      "id": "1",
      "slug": "news",
      "name": "時事新聞",
      "categories": [
        {
          "id": "7",
          "slug": "taiwannews",
          "name": "台灣新聞",
          "sortOrder": 1,
          "postsCount": 100,
          "featuredPostsInInputOrder": [],
          "posts": [
            {
              "id": "238659",
              "title": "最新測試文章",
              "publishTime": "2025-11-23T00:00:00.000Z",
              "brief": "文章摘要...",
              "contentApiData": null,
              "heroImage": {
                "resized": { "original": "https://...", "w480": "https://...", "w800": "https://..." },
                "resizedWebp": { "original": "https://...", "w480": "https://...", "w800": "https://..." }
              }
            }
          ]
        }
      ]
    }
  ],
  "newsPosts": [
    {
      "id": "238665",
      "title": "時事新聞 section 文章",
      "publishTime": "2026-01-25T16:00:00.000Z",
      "brief": "...",
      "contentApiData": null,
      "heroImage": {
        "resized": { "original": "https://...", "w480": "https://...", "w800": "https://..." },
        "resizedWebp": { "original": "https://...", "w480": "https://...", "w800": "https://..." }
      }
    }
  ],
  "columnPosts": [
    {
      "id": "238618",
      "title": "專欄 section 文章",
      "publishTime": "2024-03-06T02:59:45.000Z",
      "brief": "...",
      "contentApiData": null,
      "heroImage": {
        "resized": { "original": "https://...", "w480": "https://...", "w800": "https://..." },
        "resizedWebp": null
      }
    }
  ],
  "supplementPosts": [
    {
      "id": "238621",
      "title": "副刊 section 文章",
      "publishTime": "2024-03-06T02:20:10.000Z",
      "brief": "...",
      "contentApiData": null,
      "heroImage": {
        "resized": { "original": "https://...", "w480": "https://...", "w800": "https://..." },
        "resizedWebp": null
      }
    }
  ],
  "greenMain": [
    {
      "id": "12345",
      "title": "綠色消費 tag 文章",
      "publishTime": "2025-01-15T00:00:00.000Z",
      "brief": "...",
      "contentApiData": null,
      "heroImage": {
        "resized": { "original": "https://...", "w480": "https://...", "w800": "https://..." },
        "resizedWebp": null
      }
    }
  ],
  "greenBuy": [],
  "greenFood": [],
  "greenClothing": [],
  "greenLeisure": [],
  "highlightPicks": [
    {
      "id": "1",
      "sortOrder": 1,
      "customUrl": null,
      "customTitle": "焦點話題標題",
      "customDescription": null,
      "customImage": {
        "resized": { "original": "https://...", "w480": "https://...", "w800": "https://..." },
        "resizedWebp": null
      },
      "posts": {
        "id": "12345",
        "title": "文章標題",
        "publishTime": "2025-01-15T00:00:00.000Z",
        "heroImage": null
      },
      "category": { "id": "4", "slug": "breakingnews", "name": "快訊" }
    }
  ],
  "carouselPicks": [
    {
      "id": "2",
      "sortOrder": 1,
      "customUrl": null,
      "customTitle": "輪播標題",
      "customDescription": "輪播描述",
      "customImage": {
        "resized": { "original": "https://...", "w480": "https://...", "w800": "https://...", "w1200": "https://...", "w1600": "https://...", "w2400": "https://..." },
        "resizedWebp": { "original": "https://...", "w480": "https://...", "w800": "https://...", "w1200": "https://...", "w1600": "https://...", "w2400": "https://..." }
      },
      "posts": {
        "id": "23456",
        "title": "輪播文章標題",
        "publishTime": "2025-01-14T00:00:00.000Z",
        "heroImage": {
          "resized": { "original": "https://...", "w480": "https://...", "w800": "https://...", "w1200": "https://...", "w1600": "https://...", "w2400": "https://..." },
          "resizedWebp": null
        }
      },
      "category": { "id": "6", "slug": "homepagegraph", "name": "首頁大圖" }
    }
  ],
  "topics": [
    {
      "id": "3",
      "title": "直擊阿聯氣候新時代",
      "status": "published",
      "content": "專題描述...",
      "heroImage": {
        "resized": { "original": "https://...", "w480": "https://...", "w800": "https://..." },
        "resizedWebp": null
      },
      "postsCount": 4,
      "posts": [
        {
          "id": "34567",
          "title": "專題文章標題",
          "publishTime": "2025-01-13T00:00:00.000Z",
          "brief": "文章摘要...",
          "heroImage": {
            "resized": { "original": "https://...", "w480": "https://...", "w800": "https://..." },
            "resizedWebp": null
          }
        }
      ],
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
    "image": {
      "resized": { "original": "https://...", "w480": "https://...", "w800": "https://..." },
      "resizedWebp": null
    }
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
        "resized": { "original": "https://storage.googleapis.com/...", "w480": "https://storage.googleapis.com/...", "w800": "https://storage.googleapis.com/..." },
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
        "resized": { "original": "https://storage.googleapis.com/...", "w480": "https://storage.googleapis.com/...", "w800": "https://storage.googleapis.com/..." },
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
5. **圖片尺寸**: 使用 Card 尺寸 (original, w480, w800) 可減少約 50-60% payload

---

## 完整 Response 範例檔案

完整的 JSON response 範例請參考：
- **[homepage-api-example.json](./homepage-api-example.json)** - 從 dev 環境 GraphQL API 實際查詢產生的完整 response

此檔案包含：
- 3 個 sections（時事新聞、專欄、副刊，每個 section 包含多個 categories）- **使用 Card 尺寸圖片**
- 3 組 section-level posts（newsPosts、columnPosts、supplementPosts，各 8 篇）- **使用 Card 尺寸圖片**
- 5 組綠色消費 tag 文章（greenMain、greenBuy、greenFood、greenClothing、greenLeisure，各 3 篇）- **使用 Card 尺寸圖片**
- 3 個 highlightPicks - **使用 Card 尺寸圖片**
- 3 個 carouselPicks - **使用完整尺寸圖片**
- 23 個 topics（每個 topic 最多 4 篇文章）- **使用 Card 尺寸圖片**
- 1 個 infoGraph - **使用 Card 尺寸圖片**
- 2 個 ads（showOnHomepage）- **使用 Card 尺寸圖片**
- deepTopicAds（dev 環境目前無資料）- **使用 Card 尺寸圖片**

---

## 前端整合

前端已實作 JSON API 優先、GraphQL fallback 的機制：

1. 優先嘗試呼叫 `/api/homepage` JSON API
2. 若失敗（網路錯誤、500 錯誤等），自動 fallback 到 GraphQL 查詢
3. Fallback 機制確保服務可用性
4. **綠色消費 tag 資料**始終從 GraphQL 獲取（與主 API 請求並行），因為 JSON API 不含此資料

### In-Memory 快取機制

前端實作了 in-memory 快取以減少 SSR 時的 API 請求次數：

```typescript
// 快取設定
const CACHE_TTL_MS = 60 * 1000  // 60 秒
```

**快取邏輯**：
1. 若快取存在且未過期 (< 60 秒)，直接回傳快取資料
2. 若快取過期或不存在，從 API 獲取新資料
3. 若 API 請求失敗但有過期快取，回傳過期快取（stale cache fallback，避免服務中斷）
4. 成功獲取後更新快取與時間戳記

**快取策略優點**：
- 減少同一 Node.js process 內的重複 API 請求
- 提供 stale cache fallback 確保服務可用性
- 60 秒 TTL 確保資料新鮮度與 ISR revalidate 時間一致

相關程式碼位於：
- `packages/e-info/utils/homepage-api.ts` - API 呼叫、fallback 邏輯、in-memory 快取
- `packages/e-info/pages/index.tsx` - 首頁資料獲取
- `packages/e-info/graphql/fragments/resized-images.ts` - Card 與完整尺寸 fragments
- `packages/e-info/graphql/fragments/post.ts` - PostFieldsCard 與 PostFields fragments

---

## 變更記錄

### 2026-02-10
- **綠色消費改為 tag-based 資料來源**
  - 綠色消費區塊不再使用 section/category 結構，改為以 tag 名稱篩選文章
  - 新增 `homepageGreenConsumptionPosts` GraphQL 查詢，使用 5 個 alias 一次查詢 5 個 tag 的文章
  - Tag 名稱：綠色消費（主）、買前必讀、食材食品、衣著紡織、休閒娛樂
  - 前端始終從 GraphQL 獲取此資料（與主 API 請求並行），JSON API 不含此資料
- **Section IDs 更新**
  - sections 查詢的 Section IDs 從 `['3', '4', '5', '6']` 改為 `['1', '2', '3']`
  - 移除綠色消費 section（ID 5/6），改用 tag-based 查詢
- **新增 Section-level posts**
  - 新增 `homepageSectionPosts` 查詢，提供各大分類的跨分類文章
  - 新增欄位：`newsPosts`、`columnPosts`、`supplementPosts`
  - 用於未選擇子分類 tab 時的預設顯示
- **新增 Green consumption tag 欄位**
  - 新增欄位：`greenMain`、`greenBuy`、`greenFood`、`greenClothing`、`greenLeisure`
- **修正 Category slug**
  - highlightPicks: `"hottopic"` → `"breakingnews"`（與程式碼一致）
  - carouselPicks: `"homepepicks"` → `"homepagegraph"`（與程式碼一致）
- **更新 homepage-api-example.json**
  - 從 dev 環境 GraphQL API 重新產生完整範例
  - 反映新的 section IDs、tag-based 綠色消費、正確的 category slug

### 2026-02-02
- **新增 In-Memory 快取機制文件**
  - 記錄前端 60 秒 TTL 快取機制
  - 說明 stale cache fallback 策略
- **更新 homepage-api-example.json**
  - 從 dev 環境 GraphQL API 重新產生完整範例
  - 更新資料統計：23 個 topics、2 個 deepTopicAds

### 2026-01-16
- **新增精選文章欄位 (`featuredPostsInInputOrder`)**
  - Category 新增 `featuredPostsInInputOrder` 欄位，可在 CMS 設定精選文章
  - 首頁顯示邏輯：精選文章優先顯示，再補上一般文章（去重複）
  - 影響區塊：時事新聞、專欄、副刊
- **Topics 排序邏輯更新**
  - 移除查詢條件中的 `isPinned = true` 限制，改為前端排序
  - 排序邏輯：`isPinned = true` 的 topics 優先，依 `sortOrder` 排序；其次為 `isPinned = false` 的 topics，依 `sortOrder` 排序
  - 總共取前 4 筆顯示
  - Topic 型別新增 `sortOrder` 欄位
  - 可在 CMS 設定專題顯示順序，並透過 `isPinned` 設定優先顯示

### 2025-01-15
- **新增響應式圖片尺寸策略**
  - 新增 `ResizedImagesCard` 類型（僅 original, w480, w800）
  - 大部分元件改用 Card 尺寸以減少 payload
  - 輪播 (`carouselPicks`) 保留完整尺寸（需要大圖顯示）
- **新增 `HomepagePickCarousel` 類型**
  - 與 `HomepagePick` 分開，使用完整圖片尺寸
- **預期效益**：API payload 減少約 50-60%
