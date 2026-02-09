# GA4 追蹤清單

> 最後更新：2026-02-06

## 一、基礎設定

| 頁面/功能 | 檔案位置 | 說明 |
|----------|---------|------|
| App 進入點 | `pages/_app.tsx:37` | GA4 初始化 |
| GA 工具函數 | `utils/gtag.ts` | 所有追蹤函數定義 |

---

## 二、頁面瀏覽追蹤

| 頁面/功能 | 檔案位置 | 事件名稱 | 追蹤內容 |
|----------|---------|----------|----------|
| 文章頁 | `pages/node/[id].tsx:45` | `page_view` | 文章瀏覽，含 article_id, article_title, article_category, article_section, article_tags |

---

## 三、閱讀行為追蹤

| 頁面/功能 | 檔案位置 | 事件名稱 | 追蹤內容 |
|----------|---------|----------|----------|
| 文章頁（一般版型） | `components/post/article-type/news.tsx:160` | `scroll_depth` | 閱讀進度 25%/50%/75%/100% |
| 文章頁（一般版型） | `components/post/article-type/news.tsx:156` | `post > scroll` | 滾動到底部 |
| 文章內容區 | `components/post/post-content.tsx:296` | `outbound_click` | 外部連結點擊 |

---

## 四、文章頁互動追蹤

| 頁面/功能 | 檔案位置 | Category > Action | Label |
|----------|---------|-------------------|-------|
| 社群分享按鈕 | `components/shared/media-link.tsx:103` | `post > click` | `post-share-fb` |
| 社群分享按鈕 | `components/shared/media-link.tsx:110` | `post > click` | `post-share-twitter` |
| 社群分享按鈕 | `components/shared/media-link.tsx:117` | `post > click` | `post-share-line` |
| 書籤按鈕 | `components/shared/media-link.tsx:122` | `post > click` | `post-bookmark` |
| 文章標籤連結 | `components/post/tag.tsx:58` | `post > click` | `post-{標籤名稱}` |
| 相關文章區塊 | `components/post/related-post.tsx:101` | `post > click` | `post-related-{文章標題}` |
| 訂閱電子報按鈕 | `components/post/subscribe-button.tsx:19` | `post > click` | `post-mailsubscribe` |

---

## 五、首頁追蹤

| 頁面/功能 | 檔案位置 | Category > Action | Label |
|----------|---------|-------------------|-------|
| 首頁 | `pages/index.tsx:135` | `homepage > scroll` | `scroll to end` |
| 最新文章列表 | `components/index/category-list.tsx:77` | `homepage > click` | `latest-{文章標題}` |

---

## 六、專題頁追蹤

| 頁面/功能 | 檔案位置 | Category > Action | Label |
|----------|---------|-------------------|-------|
| 專題內頁 | `pages/feature/[id].tsx:436` | `topic > click` | `page-{頁碼}` |
| 專題內頁 | `pages/feature/[id].tsx:542` | `topic > click` | `article-{文章標題}` |
| 專題列表頁 | `pages/feature/index.tsx:370` | `featured-topics > click` | 專題點擊 |
| 專題列表頁 | `pages/feature/index.tsx:395` | `featured-topics > click` | 專題點擊 |
| 專題列表頁 | `pages/feature/index.tsx:424` | `featured-topics > click` | 專題點擊 |
| 專題列表頁 | `pages/feature/index.tsx:447` | `featured-topics > click` | `enter-{專題標題}` |

---

## 七、文章列表頁追蹤

| 頁面/功能 | 檔案位置 | Category > Action | Label |
|----------|---------|-------------------|-------|
| 文章列表元件（通用） | `components/shared/article-lists.tsx:66` | `listing > click` | `listing-{文章標題}` |

---

## 八、活動頁追蹤

| 頁面/功能 | 檔案位置 | Category > Action | Label |
|----------|---------|-------------------|-------|
| 活動列表頁 | `pages/event/index.tsx:431` | `events > click` | `pagination-page-{頁碼}` |
| 活動列表頁 | `pages/event/index.tsx:491` | `events > filter` | `location-{地點}` |
| 活動列表頁 | `pages/event/index.tsx:511` | `events > filter` | `date-{日期}` |
| 活動列表頁 | `pages/event/index.tsx:525` | `events > click` | `submit-event` |
| 活動列表頁 | `pages/event/index.tsx:540` | `events > click` | `{活動名稱}` |

---

## 九、工作頁追蹤

| 頁面/功能 | 檔案位置 | Category > Action | Label |
|----------|---------|-------------------|-------|
| 工作列表頁 | `pages/job/index.tsx:355` | `jobs > click` | `pagination-page-{頁碼}` |
| 工作列表頁 | `pages/job/index.tsx:408` | `jobs > click` | `submit-job` |
| 工作列表頁 | `pages/job/index.tsx:426` | `jobs > click` | `{工作標題}` |

---

## 十、轉換目標追蹤

| 頁面/功能 | 檔案位置 | 轉換類型 | 說明 |
|----------|---------|----------|------|
| 電子報訂閱彈窗 | `components/shared/newsletter-modal.tsx:450` | `newsletter_subscribe` | 訂閱成功 |
| 捐款彈窗 | `components/shared/donation-modal.tsx:144` | `donation_complete` | 捐款完成 |

---

## 十一、會員行為追蹤

| 頁面/功能 | 檔案位置 | Action | Label |
|----------|---------|--------|-------|
| 登入結果頁 | `pages/auth/login-result.tsx:32` | `login` | - |
| 註冊結果頁 | `pages/auth/register-result.tsx:34` | `register` | - |
| 登出功能 | `contexts/auth-context.tsx:263` | `logout` | - |
| 書籤按鈕 | `components/shared/media-link.tsx:158` | `bookmark` | {postId} |
| 書籤按鈕 | `components/shared/media-link.tsx:146` | `unbookmark` | {postId} |

---

## 十二、可用但尚未使用的追蹤

| 函數 | 用途 |
|------|------|
| `sendConversion('share_complete')` | 分享完成轉換 |
| `sendConversion('external_link_click')` | 外部連結點擊轉換 |
