# Plan: 串接 Section / Category Listing JSON API（含 GraphQL fallback）

## Context

首頁已實作 JSON 優先、GraphQL fallback 的機制（`homepage-api.ts`）。現在要將同樣策略套用到 section 與 category listing 頁面的前 5 頁。JSON 檔案由後端依 `section-listing-api-spec.md` / `category-listing-api-spec.md` 規格產生，放置在 GCS 上。

## 修改概覽

```
constants/config.ts        ── 新增 LISTING_API_BASE
constants/layout.ts        ── 新增 MAX_JSON_PAGES = 5
utils/listing-api.ts       ── 新建：JSON fetch + fallback 邏輯
pages/section/[slug].tsx   ── 改用 listing-api，JSON 優先
pages/category/[id].tsx    ── 改用 listing-api，JSON 優先
```

---

## Step 1：新增常數

### `packages/e-info/constants/config.ts`

在 `let` 宣告區新增 `LISTING_API_BASE`，在 switch 內設值，在 export 加上：

```typescript
let LISTING_API_BASE = ''

// switch 內：
case 'prod':
  LISTING_API_BASE = 'https://storage.googleapis.com/statics-e-info-prod/json/listing'
  ...
case 'dev':
default:
  LISTING_API_BASE = 'https://storage.googleapis.com/statics-e-info-dev/json/listing'
  ...

export { ..., LISTING_API_BASE }
```

### `packages/e-info/constants/layout.ts`

新增一行：

```typescript
/** JSON 預生成頁面數上限 (前 N 頁使用 JSON API) */
export const MAX_JSON_PAGES = 5
```

---

## Step 2：建立 `packages/e-info/utils/listing-api.ts`

比照 `homepage-api.ts` 的模式，但更簡潔（不需 in-memory cache、不需 transform）。

### 型別定義

直接對應 spec 文件中的 JSON 結構：

```typescript
import type { CategoryPostForListing, SectionForListing, SectionListingCategory, SectionPageCategory, SectionPageData } from '~/graphql/query/section'

/** Default 樣式 section JSON 回應 */
export interface SectionListingDefaultJson {
  section: SectionForListing
  categories: SectionListingCategory[]
  posts: CategoryPostForListing[]
  totalPosts: number
  currentPage: number
  totalPages: number
}

/** Column 樣式 section JSON 回應 */
export interface SectionListingColumnJson {
  section: SectionPageData
  categories: SectionPageCategory[]
}

/** Category JSON 回應 */
export interface CategoryListingJson {
  category: { id: string; slug: string; name: string; postsCount: number }
  section: {
    id: string; slug: string; name: string; style: string | null
    heroImage: { ... } | null
    categories: SectionListingCategory[]
  }
  categories: SectionListingCategory[]
  posts: CategoryPostForListing[]
  totalPosts: number
  currentPage: number
  totalPages: number
}
```

### 核心函式

```typescript
/**
 * 通用 JSON fetch（頁碼超過 MAX_JSON_PAGES 時直接回傳 null）
 */
export async function fetchListingJson<T>(
  type: 'section' | 'category',
  idOrSlug: string,
  page: number
): Promise<T | null>
```

邏輯：
1. `if (page < 1 || page > MAX_JSON_PAGES) return null`
2. 組合 URL：`${LISTING_API_BASE}/${type}/${idOrSlug}/page-${page}.json`
3. `fetch(url, { signal: controller.signal })`，timeout = `API_TIMEOUT_MS`（10s）
4. 成功 → `console.log('[Listing] Fetched JSON: ${type}/${idOrSlug}/page-${page}')` → 回傳 parsed JSON
5. 失敗 → `console.warn('[Listing] JSON failed for ${type}/${idOrSlug}/page-${page}: ...')` → 回傳 `null`

不做 in-memory cache（key space 太大）。

---

## Step 3：修改 `packages/e-info/pages/section/[slug].tsx`

### 現行流程

```
getServerSideProps:
  1. parallel: fetchHeaderData() + sectionBySlug(GraphQL)
  2. if default → sectionPostsForListing(GraphQL)
  3. if column → sectionPageBySlug(GraphQL)
```

### 新流程

```
getServerSideProps:
  page = query.page || 1

  ── JSON 嘗試 ──
  jsonData = fetchListingJson('section', slug, page)

  if (jsonData 成功) {
    headerData = fetchHeaderData()  // 仍需 fetch header

    if (jsonData.section.style === 'default') {
      // JSON 有完整的 listing 資料
      posts = jsonData.posts.map(postConvertFunc)
      return props (pageType: 'default', ...)
    } else {
      // Column 樣式：JSON 有 section + categories（含 featured + posts）
      return props (pageType: 'column', ...)
    }
  }

  ── JSON 失敗，fallback 到 GraphQL（原本的邏輯完全不動）──
  [headerData, sectionResult] = Promise.all([fetchHeaderData(), sectionBySlug])
  ...（現行程式碼不變）
```

### 具體改動

在 `getServerSideProps` 的 `try` block 最前面插入 JSON 嘗試：

```typescript
const page = Math.max(1, parseInt(query.page as string, 10) || 1)

// JSON API 嘗試（前 5 頁）
const jsonData = await fetchListingJson<
  SectionListingDefaultJson | SectionListingColumnJson
>('section', slug, page)

if (jsonData) {
  const headerData = await fetchHeaderData()
  const isDefault = jsonData.section.style === 'default'

  if (isDefault && 'posts' in jsonData) {
    const data = jsonData as SectionListingDefaultJson
    const posts = data.posts.map((p) =>
      postConvertFunc(p as Parameters<typeof postConvertFunc>[0])
    )
    return {
      props: {
        pageType: 'default',
        section: data.section,
        categories: data.categories,
        posts,
        totalPosts: data.totalPosts,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        headerData,
      },
    }
  } else {
    const data = jsonData as SectionListingColumnJson
    return {
      props: {
        pageType: 'column',
        section: data.section,
        categories: data.categories,
        headerData,
      },
    }
  }
}

// ── 以下為原本的 GraphQL fallback（完全不動）──
```

注意：原本 default 樣式的 `page` 變數解析要往上移到 JSON 嘗試之前（目前在 `isDefaultStyle` 分支內才解析）。

---

## Step 4：修改 `packages/e-info/pages/category/[id].tsx`

### 現行流程

```
getServerSideProps:
  1. parallel: fetchHeaderData() + categoryByIdWithSection(GraphQL)
  2. 檢查隱藏 category
  3. categoryPostsForListing(GraphQL)
```

### 新流程

```
getServerSideProps:
  ── JSON 嘗試 ──
  jsonData = fetchListingJson('category', categoryId, page)

  if (jsonData 成功) {
    檢查隱藏 category (slug in HIDDEN_CATEGORY_SLUGS → notFound)
    headerData = fetchHeaderData()
    posts = jsonData.posts.map(postConvertFunc)
    return props
  }

  ── JSON 失敗，fallback 到 GraphQL（原本的邏輯完全不動）──
```

### 具體改動

在 `try` block 最前面插入：

```typescript
// JSON API 嘗試（前 5 頁）
const jsonData = await fetchListingJson<CategoryListingJson>(
  'category', categoryId, page
)

if (jsonData) {
  // 隱藏 category 檢查
  const HIDDEN_CATEGORY_SLUGS = ['homepagegraph', 'breakingnews', 'hottopic']
  if (HIDDEN_CATEGORY_SLUGS.includes(jsonData.category.slug)) {
    return { notFound: true }
  }

  const headerData = await fetchHeaderData()
  const posts = jsonData.posts.map((p) =>
    postConvertFunc(p as Parameters<typeof postConvertFunc>[0])
  )

  return {
    props: {
      headerData,
      category: jsonData.category,
      section: {
        id: jsonData.section.id,
        slug: jsonData.section.slug,
        name: jsonData.section.name,
        style: jsonData.section.style,
        heroImage: jsonData.section.heroImage || null,
        categories: jsonData.section.categories,
      },
      categories: jsonData.categories,
      posts,
      totalPosts: jsonData.totalPosts,
      currentPage: jsonData.currentPage,
      totalPages: jsonData.totalPages,
    },
  }
}

// ── 以下為原本的 GraphQL fallback（完全不動）──
```

---

## 設計原則

1. **GraphQL 程式碼完全不動** — JSON 嘗試失敗就走原本的路徑，零風險
2. **不做 in-memory cache** — key space 太大（section × page），HTTP Cache-Control 已足夠
3. **Column 樣式 section 僅 page-1 有 JSON** — `fetchListingJson` 在 page > 5 時直接回傳 null，column 樣式 page-1 正好在範圍內
4. **型別直接複用** — JSON 結構對齊現有的 `SectionForListing`、`SectionPageData`、`CategoryPostForListing` 等型別
5. **Log 格式統一** — 使用 `[Listing]` prefix，與 `[Homepage]` 一致

---

## 驗證方式

1. `cd packages/e-info && yarn dev`
2. 訪問 `/section/news` — console 應顯示 `[Listing] Fetched JSON: section/news/page-1`
3. 訪問 `/section/column` — console 應顯示 `[Listing] Fetched JSON: section/column/page-1`（column 樣式）
4. 訪問 `/category/1` — console 應顯示 `[Listing] Fetched JSON: category/1/page-1`
5. 訪問 `/category/1?page=3` — 使用 JSON
6. 訪問 `/category/1?page=6` — console 應顯示 fallback 到 GraphQL
7. 手動讓 JSON endpoint 失敗（改壞 URL）→ 確認 fallback 正常運作
8. `yarn next lint` — 無 lint 錯誤
