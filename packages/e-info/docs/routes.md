# EIC Web 網站路徑

> **Cache Control 說明**
> - `ISR revalidate: N` — 使用 `getStaticProps`，靜態生成 + 每 N 秒 ISR 重新驗證
> - `public, max-age=600` — 使用 `getServerSideProps` + `setCacheControl()`（prod 為 600s，dev 為 no-store）
> - `private, no-store` — 使用 `getServerSideProps` + `setPrivateCacheControl()`，不快取（會員/auth 頁面）
> - `redirect` — Server-side 302 redirect，無頁面渲染
> - `static` — 純靜態頁面（`getStaticProps` 無 revalidate），build 時生成

## 主要頁面

| Path | 說明 | 渲染方式 | Cache Control (prod) |
|------|------|----------|---------------------|
| `/` | 首頁 | ISR | `revalidate: 60` |
| `/node/[id]` | 文章頁 | ISR | `revalidate: 600`（preview: 10） |
| `/category/[id]` | 分類列表 | SSR | `public, max-age=600` |
| `/section/[slug]` | 大分類（時事新聞、專欄等） | SSR | `public, max-age=600` |
| `/tag/[name]` | 標籤列表 | SSR | `public, max-age=600` |
| `/author/[id]` | 作者文章列表 | SSR | `public, max-age=600` |
| `/feature` | 專題列表 | SSR | `public, max-age=600` |
| `/feature/[id]` | 專題頁 | SSR | `public, max-age=600` |
| `/search` | 搜尋 | SSR | `public, max-age=600` |

## 活動 & 職缺

| Path | 說明 | 渲染方式 | Cache Control (prod) |
|------|------|----------|---------------------|
| `/event` | 活動列表 | SSR | `public, max-age=600` |
| `/event/[id]` | 活動頁 | SSR | `public, max-age=600` |
| `/event/create` | 建立活動 | SSR | `public, max-age=600` |
| `/event/create/done` | 建立活動完成 | SSR | `public, max-age=600` |
| `/job` | 職缺列表 | SSR | `public, max-age=600` |
| `/job/[id]` | 職缺頁 | SSR | `public, max-age=600` |
| `/job/create` | 建立職缺 | SSR | `public, max-age=600` |
| `/job/create/done` | 建立職缺完成 | SSR | `public, max-age=600` |

## 電子報

| Path | 說明 | 渲染方式 | Cache Control (prod) |
|------|------|----------|---------------------|
| `/newsletter` | 電子報列表 | SSR | `public, max-age=600` |
| `/newsletter/[id]` | 電子報內容 | SSR | `public, max-age=600` |
| `/newsletter/subscribe` | 訂閱電子報 | redirect | 302 → `/?subscribe=newsletter` |

## 會員系統

| Path | 說明 | 渲染方式 | Cache Control (prod) |
|------|------|----------|---------------------|
| `/auth/login` | 登入 | SSR | `private, no-store` |
| `/auth/login-result` | 登入結果 | SSR | `private, no-store` |
| `/auth/register` | 註冊 | SSR | `private, no-store` |
| `/auth/register-result` | 註冊結果 | SSR | `private, no-store` |
| `/auth/password` | 密碼管理 | SSR | `private, no-store` |
| `/member` | 會員首頁 | SSR | `private, no-store` |
| `/member/edit` | 編輯個人資料 | SSR | `private, no-store` |
| `/member/bookmarks` | 收藏文章 | SSR | `private, no-store` |
| `/member/history` | 閱讀紀錄 | SSR | `private, no-store` |
| `/member/newsletter` | 電子報設定 | SSR | `private, no-store` |
| `/member/notifications` | 通知 | SSR | `private, no-store` |

## API Routes

| Path | 說明 |
|------|------|
| `/api/graphql` | GraphQL proxy |
| `/api/revalidate` | ISR revalidation |
| `/api/robots` | robots.txt |
| `/api/member/*` | 會員 CRUD |
| `/api/favorites/*` | 收藏 add/remove/check/list |
| `/api/reading-history/*` | 閱讀紀錄 |
| `/api/newsletter/*` | 電子報訂閱 |
| `/api/poll/*` | 投票 |
| `/api/donation-pv` | 捐款頁瀏覽 |
| `/api/create-event` | 建立活動 |
| `/api/create-job` | 建立職缺 |
| `/api/upload-photo` | 上傳圖片 |

## 錯誤頁

| Path | 說明 | 渲染方式 | Cache Control (prod) |
|------|------|----------|---------------------|
| `/404` | 404 頁面 | Static | build 時生成 |
| `_error` | 通用錯誤頁 | — | — |
