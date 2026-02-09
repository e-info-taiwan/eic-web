# E-Info

## 使用教學

### 開發與測試

1. 建立 `.env.local` 檔案，並參考[環境變數](#environment-variables-環境變數)和[功能開關](#feature-toggle-功能開關暫時性)資訊進行設定，設定方式參考[文件](https://nextjs.org/docs/basic-features/environment-variables)
2. 使用 `yarn install` 安裝環境依賴。
3. 安裝完畢後，使用 `yarn run mock-server` 來啟動 mock GraphQL API server，作為本地端開發使用。
4. 接著，使用 `yarn dev` 啟動服務，進行開發測試。
5. 開發完畢後，使用 `yarn build` 來建構正式環境程式，然後再使用 `yarn start` 來執行並驗證。

---

## Project Directory Explanation (專案目錄結構說明)

```
|── components/       - React 元件，共用類型的元件
|   |── layout/       - 頁面布局元件
|   |── shared/       - 共用元件
|   └── */            - 單一頁面與其相關的元件，會放置在以頁面為名稱的子資料夾底下
|── pages/            - 頁面檔
|   └── api/          - 後端 API
|── constants/        - 常數、設定
|   |── config.ts     - API 端點設定（依環境切換：dev/staging/prod）
|   |── constant.ts   - 固定常數（站名、預設圖片、文章樣式）
|   |── layout.ts     - 佈局與分頁常數（MAX_CONTENT_WIDTH、POSTS_PER_PAGE、Cache/Timeout）
|   |── social.ts     - 社群媒體 URL 與分享連結 pattern
|   └── environment-variables.ts - 建構時環境變數（GA、GTM、SITE_URL）
|── contexts/         - React Context
|── graphql/          - GraphQL request schema 檔案
|   |── fragments/    - GraphQL fragments
|   |── query/        - GraphQL queries
|   └── mutation/     - GraphQL mutations
|── hooks/            - custom React Hooks
|── styles/           - CSS 檔案、theme
|── types/            - TypeScript 使用的型別定義
|── utils/            - 工具類 function
|── public/           - 靜態資源
|   |── icons/        - SVG icons
|   └── images/       - 圖片
└── mock-server/      - mock GraphQL API server
    └── mocks/        - mock data 定義
```

---

## Environment Variables (環境變數)

| 變數名稱             | 資料型態 | 初始值      | 變數說明                              |
| -------------------- | -------- | ----------- | ------------------------------------- |
| NEXT_PUBLIC_ENV      | 字串     | 'localhost' | 環境設定                              |
| USE_MOCK_SERVER      | 字串     | 'false'     | 使用 mock server 來拿取 GraphQL 資料  |
| MOCK_API_SERVER_PORT | 整數     | '4000'      | mock GraphQL API server 所使用的 port |

### Firebase Authentication (會員登入功能)

| 變數名稱                                 | 資料型態 | 初始值 | 變數說明                     |
| ---------------------------------------- | -------- | ------ | ---------------------------- |
| NEXT_PUBLIC_FIREBASE_API_KEY             | 字串     | ''     | Firebase API Key             |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN         | 字串     | ''     | Firebase Auth Domain         |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID          | 字串     | ''     | Firebase Project ID          |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET      | 字串     | ''     | Firebase Storage Bucket      |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | 字串     | ''     | Firebase Messaging Sender ID |
| NEXT_PUBLIC_FIREBASE_APP_ID              | 字串     | ''     | Firebase App ID              |

> **設定步驟**：
>
> 1. 前往 [Firebase Console](https://console.firebase.google.com/) 建立專案
> 2. 在專案設定中取得上述設定值
> 3. 啟用 Authentication 並開啟所需的登入方式（Email/Password、Google、Facebook、Apple）
> 4. 設定 Firestore Database 並配置安全規則

### Mailchimp (電子報訂閱)

| 變數名稱                 | 資料型態 | 初始值 | 變數說明                                       |
| ------------------------ | -------- | ------ | ---------------------------------------------- |
| MAILCHIMP_API_KEY        | 字串     | ''     | Mailchimp API Key（格式：`<key>-<dc>`）        |
| MAILCHIMP_LIST_ID_DAILY  | 字串     | ''     | 每日報 Audience ID                             |
| MAILCHIMP_LIST_ID_WEEKLY | 字串     | ''     | 一週回顧 Audience ID                           |
| MAILCHIMP_SERVER_PREFIX  | 字串     | ''     | Mailchimp Server Prefix（從 API Key 自動取得） |

> **說明**：採用雙 Audience 架構，每日報和一週回顧使用獨立的 Mailchimp Audience。
> 格式偏好（一般版/美化版）透過 Merge Field `FORMAT` 儲存。

### Cloudflare Turnstile (Bot 保護)

| 變數名稱              | 資料型態 | 初始值 | 變數說明                             |
| --------------------- | -------- | ------ | ------------------------------------ |
| TURNSTILE_SITE_KEY    | 字串     | ''     | Turnstile Site Key（前端 widget 用） |
| TURNSTILE_SECRET_KEY  | 字串     | ''     | Turnstile Secret Key（後端驗證用）   |

> **說明**：Turnstile 用於保護公開表單（活動建立、徵才建立）免受機器人攻擊。
> 若未設定 key，系統會自動跳過驗證（graceful degradation）。

### Firebase Admin SDK (後端驗證)

| 變數名稱                            | 資料型態 | 初始值 | 變數說明                                        |
| ----------------------------------- | -------- | ------ | ----------------------------------------------- |
| FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH | 字串     | ''     | Service Account JSON 檔案路徑（二選一）         |
| FIREBASE_ADMIN_PROJECT_ID           | 字串     | ''     | Firebase Project ID（個別設定方式，三者需同時） |
| FIREBASE_ADMIN_CLIENT_EMAIL         | 字串     | ''     | Service Account Client Email                    |
| FIREBASE_ADMIN_PRIVATE_KEY          | 字串     | ''     | Service Account Private Key                     |

> **說明**：Firebase Admin SDK 用於後端驗證會員身份，保護會員相關的 API 操作（收藏、閱讀紀錄等）。
> 若未設定，系統會自動跳過驗證（graceful degradation），適用於本地開發環境。
>
> **設定方式**（二選一）：
>
> 1. **Service Account 檔案**：設定 `FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH` 為 JSON 檔案路徑
> 2. **個別環境變數**：同時設定 `FIREBASE_ADMIN_PROJECT_ID`、`FIREBASE_ADMIN_CLIENT_EMAIL`、`FIREBASE_ADMIN_PRIVATE_KEY`
>
> **取得 Service Account**：
>
> 1. 前往 [Firebase Console](https://console.firebase.google.com/) → 專案設定 → 服務帳戶
> 2. 點擊「產生新的私密金鑰」下載 JSON 檔案

## Feature Toggle (功能開關，暫時性)

| 變數名稱 | 資料型態 | 初始值 | 變數說明 |
| -------- | -------- | ------ | -------- |

環境變數設定與使用請參閱： [Basic Features: Environment Variables | Next.js](https://nextjs.org/docs/basic-features/environment-variables)

---

## 部屬

目前採用 Cloud Build 進行自動化部署，共有 dev、staging、prod 三個分支，須以發 PR 的方式合併分支。

當功能已在 feature branch 開發完畢，即可發 PR 並 merge 進 dev 分支，便會觸發自動化部署並更新測試機。 若要將專案推到正式機，須與 PM（產品經理）確認，再從 dev 分支發 PR merge 到 staging 分支，確認 staging 功能正常後，接著再發 PR 至 prod 分支。其中，正式機的部署目前需要手動核准。

---

## 部屬環境資訊

### Dev

- [Cloud Build | sachiel-readr-dev](https://console.cloud.google.com/cloud-build/triggers;region=global/edit/7029a598-d081-4cac-a86a-108c6898ad8a?project=mirrorlearning-161006)
- [Cloud Run | readr-next-dev](https://console.cloud.google.com/run/detail/asia-east1/readr-next-dev/metrics?project=mirrorlearning-161006)

### Staging

- [Cloud Build | sachiel-readr-staging](https://console.cloud.google.com/cloud-build/triggers;region=global/edit/1f92c2c5-b83b-4b69-82b0-c68d132b1ded?authuser=1&hl=zh-tw&project=mirrorlearning-161006)
- [Cloud Run | readr-next-staging](https://console.cloud.google.com/run/detail/asia-east1/readr-next-staging/metrics?authuser=1&hl=zh-tw&project=mirrorlearning-161006)

### Prod

- [Cloud Build | sachiel-readr-prod](https://console.cloud.google.com/cloud-build/triggers;region=global/edit/f488e871-56b1-473e-8dd8-9089dc817f88?authuser=1&hl=zh-tw&project=mirrorlearning-161006)
- [Cloud Run | readr-next-prod](https://console.cloud.google.com/run/detail/asia-east1/readr-next-prod/metrics?authuser=1&hl=zh-tw&project=mirrorlearning-161006)

---

## 備註

- `/pages/post/[postId]` 頁面透過 `yarn dev` 查看時，如果文章內容含有 embedded-code 內容，出現 Hydration Error 的警示訊息為正常狀況。如希望在 `local` 端查看 embedded-code 文章內容，需透過 `yarn build` + `yarn start` 啟動服務，進行開發測試。
