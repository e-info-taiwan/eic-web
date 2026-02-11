# Plan: 移植 Preview Mode（獨立部署方式）

## Context

參考 Adam 專案（mirror-media-next）的 preview 功能，為 eic-web 加入 preview mode。目的是讓編輯人員能預覽尚未發布的草稿文章。

**Adam 的做法**：build-time flag `IS_PREVIEW_MODE` 控制 Apollo Client 指向不同的 CMS endpoint（preview server），部署為獨立 Cloud Run service。GraphQL query 本身不修改，由後端決定是否回傳草稿內容。

**eic-web 的差異**：eic-web 的 CMS 是 Keystone.js，GraphQL API 會嚴格遵守 query 中的 `state: { equals: "published" }` 篩選。因此除了切換 endpoint 外，還需要在 preview mode 下移除此篩選條件，才能取得草稿文章。另外 post 頁面使用 `getStaticProps` + ISR（300s），preview mode 下需要降低快取時間。

### 待釐清事項

- [x] Preview API endpoint 確認：`https://eic-cms-preview-dev-1090198686704.asia-east1.run.app/api/graphql` — **已驗證可用**，需要 IAM 認證（Bearer token）。連接同一個 dev 資料庫（111,822 篇文章）。
- [x] 移除 `state: published` 篩選後，preview endpoint 是否回傳所有狀態的文章？ — **API 嚴格遵守 query filter**，不含 state filter 時會回傳所有狀態的文章。目前 dev 環境尚無 draft 文章，但機制正確。
- [x] 是否需要 prod 環境的 preview endpoint？ — **需要**，使用環境變數 `NEXT_PUBLIC_PREVIEW_API_ENDPOINT` 讓各環境的 Cloud Build trigger 自行設定對應的 preview CMS endpoint。
- [x] Preview server 的 Cloud Run service name 與部署觸發方式 — 使用 Cloud Build trigger，`_IS_PREVIEW_MODE=true`，Cloud Run service 會自動建立。

---

## Step 1: 新增 `IS_PREVIEW_MODE` 設定

**修改** `constants/config.ts`

```typescript
const IS_PREVIEW_MODE =
  process.env.NEXT_PUBLIC_IS_PREVIEW_MODE === 'true'

// 在 switch 之後，如果是 preview mode 且有指定 preview endpoint 則覆蓋
const PREVIEW_API_ENDPOINT = process.env.NEXT_PUBLIC_PREVIEW_API_ENDPOINT || ''
if (IS_PREVIEW_MODE && PREVIEW_API_ENDPOINT) {
  API_ENDPOINT = PREVIEW_API_ENDPOINT
}

export { API_ENDPOINT, IS_PREVIEW_MODE, ... }
```

- `NEXT_PUBLIC_IS_PREVIEW_MODE`：build-time 環境變數，`'true'` 啟用
- `NEXT_PUBLIC_PREVIEW_API_ENDPOINT`：build-time 環境變數，preview CMS 的 GraphQL endpoint
  - dev: `https://eic-cms-preview-dev-1090198686704.asia-east1.run.app/api/graphql`
  - prod: 日後建立對應 CMS preview service 後設定
- 各環境的 Cloud Build trigger 透過 substitution variable 各自設定 endpoint，程式碼無需硬編碼

## Step 2: 新增 state filter 工具函式

**新增** `utils/preview.ts`

提供 helper 讓 GraphQL query 條件式地包含 `state: published` 篩選：

```typescript
import { IS_PREVIEW_MODE } from '~/constants/config'

// 用於 gql template literal 內的條件式插值
export const publishedStateFilter = IS_PREVIEW_MODE
  ? ''
  : 'state: { equals: "published" }'
```

因為 `IS_PREVIEW_MODE` 是 build-time 常數，`gql` 在 module load 時解析 template，所以條件式插值在 build 階段就已確定。

## Step 3: 修改核心 GraphQL queries

在以下檔案中，將 `state: { equals: "published" }` 替換為 `${publishedStateFilter}`：

### `graphql/query/post.ts`（6 處）
- `post` query — 文章詳情頁
- `relatedPosts` 的 where 條件
- `latestPosts` query
- `authorPosts` query
- `authorPostsWithCount` query（2 處：posts + postsCount）

### `graphql/query/tag.ts`（3 處）
- `tags` query
- `tagPostsForListing` query（posts + postsCount）

### `graphql/query/section.ts`（1 處）
- `infoGraphs` query

### `graphql/query/category.ts`（2 處）
- posts 和 reports 的 where 條件

**暫不修改**的 queries（非文章內容，有獨立審核流程）：
- `event.ts`（活動，有 `isApproved` 額外篩選）
- `job.ts`（職缺，有 `isApproved` 額外篩選）
- `collaboration.ts`（合作，有 `isBanner` 篩選）
- `editor-choice.ts`（編輯精選）
- `quote.ts`（引言）
- `dataset.ts`（資料集）

## Step 4: 調整 Post 頁面 ISR 快取

**修改** `pages/node/[id].tsx`

```typescript
import { IS_PREVIEW_MODE } from '~/constants/config'

// 在 getStaticProps return 中：
return {
  props: { ... },
  revalidate: IS_PREVIEW_MODE ? 10 : 300,
}
```

Preview mode 下 revalidate 設為 10 秒，確保草稿內容變更後能快速反映。

## Step 5: 環境變數與部署設定

**修改** `constants/environment-variables.ts`

新增 preview 環境的 `SITE_URL` 和 `GLOBAL_CACHE_SETTING`：

```typescript
case 'preview':
  SITE_URL = 'eic-web-preview-dev-1090198686704.asia-east1.run.app'
  GLOBAL_CACHE_SETTING = 'no-store'  // preview 不快取
  break
```

**修改** `cloudbuild.yaml`

1. 在 Build Image step 的 `env` 區塊加入環境變數，讓它寫入 `.env.local`：
```yaml
steps:
  - name: gcr.io/cloud-builders/docker
    id: Build Image
    env:
      - 'NEXT_PUBLIC_ENV=${BRANCH_NAME}'
      - 'NEXT_PUBLIC_IS_PREVIEW_MODE=${_IS_PREVIEW_MODE}'               # 新增
      - 'NEXT_PUBLIC_PREVIEW_API_ENDPOINT=${_PREVIEW_API_ENDPOINT}'     # 新增
```

2. 在 `substitutions` 區塊加入預設值：
```yaml
substitutions:
  _IS_PREVIEW_MODE: 'false'              # 預設關閉，preview 部署時設為 'true'
  _PREVIEW_API_ENDPOINT: ''              # 預設空，preview 部署時設定 CMS endpoint
```

### 部署方式

在 GCP Cloud Build 建立新的 Trigger（正式站 trigger 不受影響）：

```
Trigger name:     eic-web-preview
Branch:           main
Config file:      cloudbuild.yaml
Substitution variables:
  _TARGET_PACKAGE:          e-info
  _IMAGE_NAME:              eic-web-preview
  _CLOUD_RUN_SERVICE_NAMES: eic-web-preview-dev
  _ENVIRONMENT:             dev
  _IS_PREVIEW_MODE:         true
  _PREVIEW_API_ENDPOINT:    https://eic-cms-preview-dev-1090198686704.asia-east1.run.app/api/graphql
```

日後建立 prod 環境時，建立對應 trigger 並設定各自的 `_PREVIEW_API_ENDPOINT`。

`gcloud run deploy` 在目標 service 不存在時會自動建立 Cloud Run service，不需要預先在 GCP 建立。

新建的 Cloud Run service 預設需要驗證（`--no-allow-unauthenticated`），preview server 建議保持此設定，透過 GCP IAM 控制存取權限。

---

## 異動檔案清單

| 檔案 | 動作 |
|---|---|
| `constants/config.ts` | 修改（新增 `IS_PREVIEW_MODE`、preview endpoint） |
| `utils/preview.ts` | 新增（`publishedStateFilter` helper） |
| `graphql/query/post.ts` | 修改（6 處 state filter 替換） |
| `graphql/query/tag.ts` | 修改（3 處 state filter 替換） |
| `graphql/query/section.ts` | 修改（1 處 state filter 替換） |
| `graphql/query/category.ts` | 修改（2 處 state filter 替換） |
| `pages/node/[id].tsx` | 修改（ISR revalidate 條件化） |
| `constants/environment-variables.ts` | 修改（新增 preview 環境設定） |
| `cloudbuild.yaml` | 修改（新增 `_IS_PREVIEW_MODE`、`_PREVIEW_API_ENDPOINT` substitution） |

## 驗證方式

1. **本地測試（preview off）**：`yarn dev` — 確認正常行為不受影響
2. **本地測試（preview on）**：`NEXT_PUBLIC_IS_PREVIEW_MODE=true NEXT_PUBLIC_PREVIEW_API_ENDPOINT=https://eic-cms-preview-dev-1090198686704.asia-east1.run.app/api/graphql yarn dev` — 確認：
   - 可以看到草稿文章（需要 preview API endpoint 可存取）
   - Post 頁面 revalidate 縮短
3. `yarn build` — 確認兩種模式都能成功 build
4. 確認 GraphQL query 在 preview mode 下不包含 `state: published` 篩選

## 參考：Adam 專案實作

- Config: `/Users/kojima/project/Adam/packages/mirror-media-next/config/index.mjs`
- Apollo Client: `/Users/kojima/project/Adam/packages/mirror-media-next/apollo/apollo-client.js`
- Middleware: `/Users/kojima/project/Adam/packages/mirror-media-next/middleware.js`
- Next Config: `/Users/kojima/project/Adam/packages/mirror-media-next/next.config.mjs`
