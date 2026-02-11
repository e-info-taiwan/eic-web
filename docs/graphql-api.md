# EIC GraphQL API 文件

> 最後更新：2026-01-16

## API Endpoint

| 環境 | Endpoint |
|------|----------|
| Dev | `https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql` |
| Production | `https://eic-info-cms-gql-prod-1090198686704.asia-east1.run.app/api/graphql` |

---

## 目錄

1. [Query 列表總覽](#query-列表總覽)
2. [Post 文章](#1-post-文章)
3. [Section 大分類](#2-section-大分類)
4. [Category 中分類](#3-category-中分類)
5. [Topic 專題](#4-topic-專題)
6. [Tag 標籤](#5-tag-標籤)
7. [Author 作者](#6-author-作者)
8. [Event 活動](#7-event-活動)
9. [Job 工作機會](#8-job-工作機會)
10. [HomepagePick 首頁精選](#9-homepagepick-首頁精選)
11. [InfoGraph 資訊圖表](#10-infograph-資訊圖表)
12. [Newsletter 電子報](#11-newsletter-電子報)
13. [Poll 投票](#12-poll-投票)
14. [Ad 廣告](#13-ad-廣告)
15. [Donation 捐款](#14-donation-捐款)
16. [Photo 圖片](#15-photo-圖片)
17. [首頁查詢範例](#首頁查詢範例)
18. [測試資料](#測試資料)
19. [與舊 API 差異](#與舊-api-差異)

---

## Query 列表總覽

| Query | 單筆查詢 | Count | 說明 | Dev 資料狀態 |
|-------|---------|-------|------|-------------|
| `posts` | `post` | `postsCount` | 文章列表 | ✅ 有資料 |
| `sections` | `section` | `sectionsCount` | 大分類 | ✅ 1 筆 |
| `categories` | `category` | `categoriesCount` | 中分類 | ✅ 1 筆 |
| `topics` | `topic` | `topicsCount` | 專題 | ✅ 1 筆 |
| `tags` | `tag` | `tagsCount` | 標籤 | ✅ 有資料 |
| `authors` | `author` | `authorsCount` | 作者 | ✅ 有資料 |
| `events` | `event` | `eventsCount` | 活動 | ✅ 5+ 筆 |
| `jobs` | `job` | `jobsCount` | 工作機會 | ✅ 5+ 筆 |
| `homepagePicks` | `homepagePick` | `homepagePicksCount` | 首頁精選 | ⚠️ 0 筆 |
| `infoGraphs` | `infoGraph` | `infoGraphsCount` | 資訊圖表 | ⚠️ 0 筆 |
| `newsletters` | `newsletter` | `newslettersCount` | 電子報 | ⚠️ 0 筆 |
| `polls` | `poll` | `pollsCount` | 投票 | ✅ 有資料 |
| `ads` | `ad` | `adsCount` | 廣告 | ⚠️ 0 筆 |
| `donations` | `donation` | `donationsCount` | 捐款 | ✅ 有資料 |
| `photos` | `photo` | `photosCount` | 圖片 | ✅ 有資料 |
| `videos` | `video` | `videosCount` | 影片 | - |
| `locations` | `location` | `locationsCount` | 地點 | - |
| `classifies` | `classify` | `classifiesCount` | 小分類 | - |
| `timelines` | `timeline` | `timelinesCount` | 時間軸 | - |
| `timelineItems` | `timelineItem` | `timelineItemsCount` | 時間軸項目 | - |

---

## 1. Post (文章)

### Schema

```graphql
type Post {
  # 基本資訊
  id: ID!
  title: String
  subtitle: String
  state: String                    # "published", "draft", "scheduled", "archived"
  publishTime: DateTime
  style: String                    # "default", "news", "report", "embedded", etc.

  # 圖片
  heroImage: Photo
  heroCaption: String
  ogImage: Photo

  # 作者 (最多 3 位 + 其他)
  author1: Author
  author2: Author
  author3: Author
  otherByline: String

  # 分類系統
  section: Section                 # 大分類
  category: Category               # 中分類
  classify: Classify               # 小分類
  topic: Topic                     # 專題
  tags: [Tag]
  tagsCount: Int

  # 內容
  brief: JSON                      # 摘要 (Legacy draft-js 格式)
  briefApiData: JSON               # 摘要 (新 API 格式)
  content: String                  # 內文 (Legacy draft-js 格式)
  contentApiData: JSON             # 內文 (新 API 格式)
  citations: String                # 引用來源 (HTML 字串)

  # 關聯內容
  relatedPosts: [Post]
  relatedPostsCount: Int
  locations: [Location]
  locationsCount: Int
  attachments: [Attachment]
  attachmentsCount: Int

  # 廣告 & 互動
  ad1: Ad
  ad2: Ad
  poll: Poll
  pollResults: [PollResult]
  aiPollHelper: String
  aiPollHelperResult: String

  # RSS & 電子報
  rssTargets: [String]
  isNewsletter: Boolean

  # 系統欄位
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}
```

### Post Style 類型

| Style | 說明 |
|-------|------|
| `default` | 預設文章 |
| `editor` | 編輯精選 |
| `news` | 新聞 |
| `frame` | 框架式 |
| `blank` | 空白 |
| `scrollablevideo` | 滾動影片 |
| `embedded` | 嵌入式 |
| `project3` | 專題3 |
| `report` | 報導 |

### 查詢範例

```graphql
# 取得最新 10 篇已發布文章
query GetLatestPosts {
  posts(
    take: 10
    skip: 0
    where: { state: { equals: "published" } }
    orderBy: { publishTime: desc }
  ) {
    id
    title
    subtitle
    style
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
      }
    }
    category {
      id
      slug
      name
    }
    tags {
      id
      name
    }
  }
}

# 取得單篇文章詳情
query GetPost($id: ID!) {
  post(where: { id: $id }) {
    id
    title
    subtitle
    state
    publishTime
    style
    heroImage {
      resized {
        original
        w480
        w800
        w1200
      }
      resizedWebp {
        original
        w480
        w800
      }
    }
    heroCaption
    ogImage {
      resized {
        original
      }
    }
    author1 {
      id
      name
    }
    author2 {
      id
      name
    }
    author3 {
      id
      name
    }
    otherByline
    section {
      id
      slug
      name
    }
    category {
      id
      slug
      name
    }
    topic {
      id
      title
    }
    tags {
      id
      name
    }
    brief
    briefApiData
    contentApiData
    citations
    relatedPosts(
      take: 4
      where: { state: { equals: "published" } }
      orderBy: { publishTime: desc }
    ) {
      id
      title
      publishTime
      heroImage {
        resized {
          w480
        }
      }
    }
  }
}

# 依分類取得文章
query GetPostsByCategory($categoryId: ID!, $take: Int = 10) {
  posts(
    take: $take
    where: {
      state: { equals: "published" }
      category: { id: { equals: $categoryId } }
    }
    orderBy: { publishTime: desc }
  ) {
    id
    title
    publishTime
    heroImage {
      resized {
        w480
      }
    }
  }
}

# 依標籤取得文章
query GetPostsByTag($tagName: String!, $take: Int = 10) {
  posts(
    take: $take
    where: {
      state: { equals: "published" }
      tags: { some: { name: { equals: $tagName } } }
    }
    orderBy: { publishTime: desc }
  ) {
    id
    title
    publishTime
  }
}

# 依作者取得文章
query GetPostsByAuthor($authorId: ID!, $take: Int = 10) {
  posts(
    take: $take
    where: {
      state: { equals: "published" }
      OR: [
        { author1: { id: { equals: $authorId } } }
        { author2: { id: { equals: $authorId } } }
        { author3: { id: { equals: $authorId } } }
      ]
    }
    orderBy: { publishTime: desc }
  ) {
    id
    title
    publishTime
  }
}
```

---

## 2. Section (大分類)

### Schema

```graphql
type Section {
  id: ID!
  slug: String
  name: String
  style: String                    # "default"
  heroImage: Photo
  heroImageCaption: String
  showInHeader: Boolean            # 是否顯示在 Header
  sortOrder: Int
  categories: [Category]           # 包含的中分類
  categoriesCount: Int
  posts: [Post]                    # 直接關聯的文章
  postsCount: Int
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}
```

### 查詢範例

```graphql
# 取得所有大分類 (含中分類)
query GetSections {
  sections(orderBy: { sortOrder: asc }) {
    id
    slug
    name
    style
    showInHeader
    sortOrder
    categoriesCount
    categories(orderBy: { sortOrder: asc }) {
      id
      slug
      name
      postsCount
    }
    postsCount
  }
}

# 取得顯示在 Header 的大分類
query GetHeaderSections {
  sections(
    where: { showInHeader: { equals: true } }
    orderBy: { sortOrder: asc }
  ) {
    id
    slug
    name
    categories {
      id
      slug
      name
    }
  }
}
```

### 現有資料 (Dev)

```json
{
  "id": "2",
  "slug": "testsection",
  "name": "測試大分類",
  "style": "default",
  "showInHeader": false,
  "sortOrder": 1,
  "categoriesCount": 1
}
```

---

## 3. Category (中分類)

### Schema

```graphql
type Category {
  id: ID!
  slug: String
  name: String                     # ⚠️ 注意：欄位名稱是 name，不是 title
  sortOrder: Int
  heroImage: Photo
  heroImageCaption: String
  section: Section                 # 所屬大分類
  posts: [Post]                    # 關聯文章 (依發布時間排序)
  postsCount: Int
  featuredPosts: [Post]            # 精選文章 (依加入時間排序)
  featuredPostsInInputOrder: [Post] # 精選文章 (依 CMS 輸入順序排序)
  classifies: [Classify]           # 包含的小分類
  classifiesCount: Int
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}
```

### 查詢範例

```graphql
# 取得所有中分類
query GetCategories {
  categories(orderBy: { sortOrder: asc }) {
    id
    slug
    name
    sortOrder
    postsCount
    section {
      id
      slug
      name
    }
  }
}

# 取得分類及其最新文章
query GetCategoryWithPosts($slug: String!, $postsLimit: Int = 5) {
  categories(where: { slug: { equals: $slug } }) {
    id
    slug
    name
    heroImage {
      resized {
        original
        w800
      }
    }
    posts(
      take: $postsLimit
      where: { state: { equals: "published" } }
      orderBy: { publishTime: desc }
    ) {
      id
      title
      publishTime
      heroImage {
        resized {
          w480
        }
      }
    }
    postsCount
  }
}

# 取得分類及其精選文章 (用於首頁區塊)
# featuredPostsInInputOrder: 依照 CMS 中輸入的順序排列
# 首頁顯示邏輯：精選文章優先顯示，再補上一般文章 (去重複)
query GetCategoryWithFeaturedPosts($slug: String!) {
  categories(where: { slug: { equals: $slug } }) {
    id
    slug
    name
    featuredPostsInInputOrder(
      where: { state: { equals: "published" } }
    ) {
      id
      title
      publishTime
      heroImage {
        resized {
          w480
        }
      }
    }
    posts(
      take: 10
      where: { state: { equals: "published" } }
      orderBy: { publishTime: desc }
    ) {
      id
      title
      publishTime
      heroImage {
        resized {
          w480
        }
      }
    }
  }
}
```

### 現有資料 (Dev)

```json
{
  "id": "2",
  "slug": "testcategory",
  "name": "測試中分類",
  "sortOrder": 1,
  "postsCount": 1,
  "section": {
    "id": "2",
    "slug": "testsection",
    "name": "測試大分類"
  }
}
```

---

## 4. Topic (專題)

### Schema

```graphql
type Topic {
  id: ID!
  title: String
  status: String                   # "published", "draft"
  content: String                  # 專題描述/摘要
  heroImage: Photo
  posts: [Post]                    # 關聯文章
  postsCount: Int
  tags: [Tag]                      # 關聯標籤
  tagsCount: Int
  isPinned: Boolean                # 是否置頂
  sortOrder: Int                   # 排序順序 (首頁使用此欄位排序)
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}
```

### 查詢範例

```graphql
# 取得所有已發布專題 (依 sortOrder 排序)
# 首頁顯示邏輯 (前端排序):
#   1. isPinned = true 的 topics 優先，依 sortOrder 升冪
#   2. isPinned = false 的 topics，依 sortOrder 升冪
#   3. 取前 4 筆
query GetTopics {
  topics(
    where: { status: { equals: "published" } }
    orderBy: { sortOrder: asc }
  ) {
    id
    title
    status
    content
    isPinned
    sortOrder
    postsCount
    tagsCount
    heroImage {
      resized {
        original
        w480
        w800
      }
    }
  }
}

# 取得單一專題詳情 (含文章列表)
query GetTopic($id: ID!) {
  topic(where: { id: $id }) {
    id
    title
    status
    content
    isPinned
    heroImage {
      resized {
        original
        w800
        w1200
      }
    }
    posts(
      take: 20
      where: { state: { equals: "published" } }
      orderBy: { publishTime: desc }
    ) {
      id
      title
      publishTime
      heroImage {
        resized {
          w480
        }
      }
    }
    postsCount
    tags {
      id
      name
    }
  }
}

# 取得置頂專題
query GetPinnedTopics {
  topics(
    where: {
      status: { equals: "published" }
      isPinned: { equals: true }
    }
  ) {
    id
    title
    content
    heroImage {
      resized {
        w800
      }
    }
    postsCount
  }
}
```

### 現有資料 (Dev)

```json
{
  "id": "2",
  "title": "測試用專題",
  "status": "published",
  "content": "這個專題裡面可以有超多不同的文章，來測試看看會發生什麼事情",
  "isPinned": false,
  "postsCount": 2,
  "tagsCount": 2,
  "heroImage": {
    "resized": {
      "original": "https://statics-readr-tw-dev.readr.tw/images/325fb5e1-e20d-45ed-a529-8eef15b222b1.jpg"
    }
  }
}
```

---

## 5. Tag (標籤)

### Schema

```graphql
type Tag {
  id: ID!
  name: String
  brief: String                    # 標籤描述
  heroImage: Photo
  isFeatured: Boolean              # 是否為精選標籤
  sortOrder: Int
  posts: [Post]
  postsCount: Int
  topics: [Topic]
  topicsCount: Int
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}
```

### 查詢範例

```graphql
# 取得所有標籤
query GetTags {
  tags(orderBy: { sortOrder: asc }) {
    id
    name
    brief
    isFeatured
    postsCount
    topicsCount
  }
}

# 取得精選標籤
query GetFeaturedTags {
  tags(
    where: { isFeatured: { equals: true } }
    orderBy: { sortOrder: asc }
  ) {
    id
    name
    brief
    heroImage {
      resized {
        w480
      }
    }
    postsCount
  }
}

# 取得標籤及其文章
query GetTagWithPosts($name: String!, $postsLimit: Int = 10) {
  tags(where: { name: { equals: $name } }) {
    id
    name
    brief
    heroImage {
      resized {
        w800
      }
    }
    posts(
      take: $postsLimit
      where: { state: { equals: "published" } }
      orderBy: { publishTime: desc }
    ) {
      id
      title
      publishTime
      heroImage {
        resized {
          w480
        }
      }
    }
    postsCount
  }
}
```

---

## 6. Author (作者)

### Schema

```graphql
type Author {
  id: ID!
  name: String
  image: Photo
  bio: String                      # 作者簡介
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}
```

### 查詢範例

```graphql
# 取得作者資訊
query GetAuthor($id: ID!) {
  author(where: { id: $id }) {
    id
    name
    bio
    image {
      resized {
        w480
      }
    }
  }
}

# 取得所有作者
query GetAuthors {
  authors {
    id
    name
    image {
      resized {
        w480
      }
    }
  }
}
```

---

## 7. Event (活動)

### Schema

```graphql
type Event {
  id: ID!
  name: String                     # 活動名稱
  heroImage: Photo
  organizer: String                # 主辦單位
  contactInfo: String              # 聯絡資訊
  eventType: String                # "physical", "online", "hybrid"
  startDate: DateTime
  endDate: DateTime
  location: String                 # 活動地點
  fee: String                      # 費用
  registrationUrl: String          # 報名連結
  content: String                  # 活動內容 (HTML)
  isApproved: Boolean              # 是否審核通過
  showOnHomepage: Boolean          # 是否顯示在首頁
  sortOrder: Int
  state: String                    # "published", "draft"
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}
```

### Event Type 類型

| Type | 說明 |
|------|------|
| `physical` | 實體活動 |
| `online` | 線上活動 |
| `hybrid` | 混合式活動 |

### 查詢範例

```graphql
# 取得即將舉辦的活動
query GetUpcomingEvents($today: DateTime!, $take: Int = 10) {
  events(
    where: {
      state: { equals: "published" }
      startDate: { gte: $today }
    }
    orderBy: { startDate: asc }
    take: $take
  ) {
    id
    name
    eventType
    startDate
    endDate
    location
    fee
    registrationUrl
    heroImage {
      resized {
        w480
        w800
      }
    }
  }
}

# 取得首頁顯示的活動
query GetHomepageEvents {
  events(
    where: {
      state: { equals: "published" }
      showOnHomepage: { equals: true }
    }
    orderBy: { sortOrder: asc }
  ) {
    id
    name
    startDate
    endDate
    location
    heroImage {
      resized {
        w480
      }
    }
  }
}

# 取得活動詳情
query GetEvent($id: ID!) {
  event(where: { id: $id }) {
    id
    name
    organizer
    contactInfo
    eventType
    startDate
    endDate
    location
    fee
    registrationUrl
    content
    heroImage {
      resized {
        original
        w800
        w1200
      }
    }
  }
}
```

### 現有資料範例 (Dev)

```json
{
  "id": "238591",
  "name": "【台灣環境資訊協會】閒來無塑，一起來彰化濕地文化體驗吧！",
  "eventType": "physical",
  "startDate": "2024-03-31T00:00:00.000Z",
  "endDate": "2024-03-31T00:00:00.000Z",
  "showOnHomepage": false
}
```

---

## 8. Job (工作機會)

### Schema

```graphql
type Job {
  id: ID!
  title: String                    # 職缺標題
  company: String                  # 公司名稱
  jobDescription: String           # 工作描述 (HTML)
  requirements: String             # 條件要求
  salary: String                   # 薪資
  bonus: String                    # 獎金/福利
  applicationMethod: String        # 應徵方式
  startDate: DateTime              # 刊登開始日
  endDate: DateTime                # 刊登結束日
  isApproved: Boolean              # 是否審核通過
  showOnHomepage: Boolean          # 是否顯示在首頁
  sortOrder: Int
  state: String                    # "published", "draft"
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}
```

### 查詢範例

```graphql
# 取得工作列表
query GetJobs($take: Int = 10) {
  jobs(
    where: { state: { equals: "published" } }
    orderBy: { startDate: desc }
    take: $take
  ) {
    id
    title
    company
    salary
    startDate
    endDate
  }
}

# 取得工作詳情
query GetJob($id: ID!) {
  job(where: { id: $id }) {
    id
    title
    company
    jobDescription
    requirements
    salary
    bonus
    applicationMethod
    startDate
    endDate
  }
}

# 取得首頁顯示的工作
query GetHomepageJobs {
  jobs(
    where: {
      state: { equals: "published" }
      showOnHomepage: { equals: true }
    }
    orderBy: { sortOrder: asc }
  ) {
    id
    title
    company
    salary
  }
}
```

---

## 9. HomepagePick (首頁精選)

### Schema

```graphql
type HomepagePick {
  id: ID!
  category: Category               # 關聯分類
  posts: [Post]                    # 關聯文章
  postsCount: Int
  topics: [Topic]                  # 關聯專題
  topicsCount: Int
  customUrl: String                # 自訂連結
  customImage: Photo               # 自訂圖片
  customTitle: String              # 自訂標題
  customDescription: String        # 自訂描述
  sortOrder: Int
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}
```

### 查詢範例

```graphql
# 取得首頁精選區塊
query GetHomepagePicks {
  homepagePicks(orderBy: { sortOrder: asc }) {
    id
    sortOrder
    customUrl
    customTitle
    customDescription
    customImage {
      resized {
        w480
        w800
      }
    }
    category {
      id
      slug
      name
    }
    posts(take: 5) {
      id
      title
      publishTime
      heroImage {
        resized {
          w480
        }
      }
    }
    topics(take: 3) {
      id
      title
    }
  }
}
```

---

## 10. InfoGraph (資訊圖表)

### Schema

```graphql
type InfoGraph {
  id: ID!
  name: String
  title: String
  description: String
  image: Photo
  youtubeUrl: String
  state: String                    # "published", "draft"
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}
```

### 查詢範例

```graphql
# 取得資訊圖表列表
query GetInfoGraphs {
  infoGraphs(
    where: { state: { equals: "published" } }
    orderBy: { createdAt: desc }
  ) {
    id
    name
    title
    description
    youtubeUrl
    image {
      resized {
        original
        w480
        w800
      }
    }
  }
}
```

---

## 11. Newsletter (電子報)

### Schema

```graphql
type Newsletter {
  id: ID!
  title: String
  heroImage: Photo
  sendDate: DateTime
  showMenu: Boolean
  showReadingRank: Boolean
  focusPosts: [Post]               # 焦點文章
  focusPostsCount: Int
  relatedPosts: [Post]             # 相關文章
  relatedPostsCount: Int
  ads: [Ad]
  adsCount: Int
  events: [Event]
  eventsCount: Int
  poll: Poll
  readerResponseTitle: String
  readerResponseLink: String
  readerResponseText: String
  standardHtml: String             # 標準版 HTML
  beautifiedHtml: String           # 美化版 HTML
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}
```

### 查詢範例

```graphql
# 取得最新電子報
query GetLatestNewsletters($take: Int = 5) {
  newsletters(
    orderBy: { sendDate: desc }
    take: $take
  ) {
    id
    title
    sendDate
    heroImage {
      resized {
        w480
      }
    }
    focusPostsCount
    relatedPostsCount
  }
}

# 取得電子報詳情
query GetNewsletter($id: ID!) {
  newsletter(where: { id: $id }) {
    id
    title
    sendDate
    showMenu
    showReadingRank
    heroImage {
      resized {
        original
        w800
      }
    }
    focusPosts {
      id
      title
      publishTime
    }
    relatedPosts {
      id
      title
    }
    events {
      id
      name
      startDate
    }
    standardHtml
    beautifiedHtml
  }
}
```

---

## 12. Poll (投票)

### Schema

```graphql
type Poll {
  id: ID!
  name: String
  content: String                  # 投票說明
  option1: String
  option1Image: Photo
  option2: String
  option2Image: Photo
  option3: String
  option3Image: Photo
  option4: String
  option4Image: Photo
  option5: String
  option5Image: Photo
  posts: [Post]                    # 關聯文章
  postsCount: Int
  status: String
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}
```

### 查詢範例

```graphql
# 取得投票
query GetPoll($id: ID!) {
  poll(where: { id: $id }) {
    id
    name
    content
    option1
    option1Image {
      resized {
        w480
      }
    }
    option2
    option2Image {
      resized {
        w480
      }
    }
    option3
    option4
    option5
    status
  }
}
```

---

## 13. Ad (廣告)

### Schema

```graphql
type Ad {
  id: ID!
  name: String
  showOnHomepage: Boolean
  image: Photo
  imageUrl: String                 # 點擊連結
  state: String                    # "published", "draft"
  sortOrder: Int
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}
```

### 查詢範例

```graphql
# 取得首頁廣告
query GetHomepageAds {
  ads(
    where: {
      state: { equals: "published" }
      showOnHomepage: { equals: true }
    }
    orderBy: { sortOrder: asc }
  ) {
    id
    name
    imageUrl
    image {
      resized {
        original
        w800
      }
    }
  }
}
```

---

## 14. Donation (捐款)

### Schema

```graphql
type Donation {
  id: ID!
  name: String
  donationType: String
  title: String
  subtitle: String
  description: String
  image: Photo
  state: String                    # "published", "draft"
  donationUrl: String              # 捐款連結
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}
```

### 查詢範例

```graphql
# 取得捐款資訊
query GetDonations {
  donations(where: { state: { equals: "published" } }) {
    id
    name
    donationType
    title
    subtitle
    description
    donationUrl
    image {
      resized {
        w480
        w800
      }
    }
  }
}
```

---

## 15. Photo (圖片)

### Schema

```graphql
type Photo {
  id: ID!
  name: String
  description: String
  imageFile: ImageFieldOutput
  resized: ResizedImages
  resizedWebp: ResizedWebPImages
  file: FileFieldOutput
  posts: [Post]
  postsCount: Int
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}

type ResizedImages {
  original: String
  w480: String
  w800: String
  w1200: String
  w1600: String
  w2400: String
}

type ResizedWebPImages {
  original: String
  w480: String
  w800: String
  w1200: String
  w1600: String
  w2400: String
}
```

### 圖片尺寸說明

| 尺寸 | 用途 |
|------|------|
| `original` | 原始尺寸 |
| `w480` | 縮圖、卡片 |
| `w800` | 文章列表、中型圖 |
| `w1200` | 文章內文 |
| `w1600` | 大型展示 |
| `w2400` | 全螢幕、Hero |

### 使用範例

```graphql
# 圖片欄位查詢模式
heroImage {
  resized {
    original
    w480
    w800
    w1200
  }
  resizedWebp {
    original
    w480
    w800
  }
}
```

---

## 首頁查詢範例

### 完整首頁資料查詢

```graphql
query GetHomepageData {
  # 最新文章
  latestPosts: posts(
    take: 10
    where: { state: { equals: "published" } }
    orderBy: { publishTime: desc }
  ) {
    id
    title
    style
    publishTime
    heroImage {
      resized {
        w480
        w800
      }
      resizedWebp {
        w480
      }
    }
    category {
      id
      slug
      name
    }
  }

  # 大分類 (含中分類與文章)
  # 首頁各區塊使用 featuredPostsInInputOrder 取得精選文章
  # 顯示邏輯：精選文章優先，再補上一般文章 (去重複)
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
      # 精選文章 (依 CMS 輸入順序)
      featuredPostsInInputOrder(
        where: { state: { equals: "published" } }
      ) {
        id
        title
        publishTime
        heroImage {
          resized {
            w480
          }
        }
      }
      # 一般文章 (依發布時間)
      posts(
        take: 10
        where: { state: { equals: "published" } }
        orderBy: { publishTime: desc }
      ) {
        id
        title
        publishTime
        heroImage {
          resized {
            w480
          }
        }
      }
    }
  }

  # 專題 (依 sortOrder 排序)
  topics(
    where: { status: { equals: "published" } }
    orderBy: { sortOrder: asc }
    take: 4
  ) {
    id
    title
    content
    isPinned
    sortOrder
    postsCount
    heroImage {
      resized {
        w480
        w800
      }
    }
  }

  # 活動
  events(
    where: { state: { equals: "published" } }
    orderBy: { startDate: desc }
    take: 5
  ) {
    id
    name
    eventType
    startDate
    endDate
    location
    heroImage {
      resized {
        w480
      }
    }
  }

  # 工作機會
  jobs(
    where: { state: { equals: "published" } }
    orderBy: { startDate: desc }
    take: 5
  ) {
    id
    title
    company
    salary
  }
}
```

---

## 測試資料

### Dev 環境測試 ID

| 類型 | ID | 說明 |
|------|-----|------|
| Post | `238659` | 完整測試文章 (有 section/category/topic/tags) |
| Post | `238652` | 白海豚新聞 |
| Post | `238651` | 有 citations 的文章 |
| Section | `2` | 測試大分類 (slug: `testsection`) |
| Category | `2` | 測試中分類 (slug: `testcategory`) |
| Topic | `2` | 測試用專題 |
| Tag | `13` | 中國新聞 |
| Tag | `12` | 深度報導 |
| Tag | `16` | 回顧與前瞻 |
| Author | `200001` | 彭瑞祥 |
| Author | `200002` | 詹嘉紋 |
| Author | `200003` | 陳文姿 |

### cURL 測試範例

```bash
# 測試 Posts 查詢
cat > /tmp/query.json << 'EOF'
{
  "query": "{ posts(take: 5, where: { state: { equals: \"published\" } }, orderBy: { publishTime: desc }) { id title publishTime category { name } } }"
}
EOF
curl -s -X POST "https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql" \
  -H "Content-Type: application/json" \
  -d @/tmp/query.json | jq '.'

# 測試單篇文章
cat > /tmp/query.json << 'EOF'
{
  "query": "{ post(where: { id: \"238659\" }) { id title category { name } topic { title } tags { name } } }"
}
EOF
curl -s -X POST "https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql" \
  -H "Content-Type: application/json" \
  -d @/tmp/query.json | jq '.'

# 測試 Sections
cat > /tmp/query.json << 'EOF'
{
  "query": "{ sections { id slug name categories { id slug name } } }"
}
EOF
curl -s -X POST "https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql" \
  -H "Content-Type: application/json" \
  -d @/tmp/query.json | jq '.'

# 測試 Topics
cat > /tmp/query.json << 'EOF'
{
  "query": "{ topics { id title status postsCount heroImage { resized { w480 } } } }"
}
EOF
curl -s -X POST "https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql" \
  -H "Content-Type: application/json" \
  -d @/tmp/query.json | jq '.'
```

---

## 與舊 API 差異

### 欄位名稱變更

| 類型 | 舊 API | 新 API |
|------|--------|--------|
| Category | `title` | `name` |
| Category | `state: { equals: "true" }` | 無 state 欄位 |
| Category | `relatedPost` | `posts` |
| Category | `ogDescription` | 不存在 |
| Category | `ogImage` | `heroImage` |

### 不存在的 Query

以下 Query 在新 API 中不存在，需要重新設計或移除：

| Query | 說明 | 替代方案 |
|-------|------|----------|
| `editorChoices` | 編輯精選 | 使用 `homepagePicks` 或自訂邏輯 |
| `features` | 精選報導 | 使用 `posts` + 特定條件 |
| `collaborations` | 協作專案 | 不存在，需移除 |
| `quotes` | 引言 | 不存在，需移除 |
| `dataSets` | 開放資料 | 不存在，需移除 |

### 新增的 Query

| Query | 說明 |
|-------|------|
| `homepagePicks` | 首頁精選區塊 |
| `infoGraphs` | 資訊圖表 |
| `newsletters` | 電子報 |
| `polls` | 投票 |
| `donations` | 捐款 |
| `timelines` | 時間軸 |

---

## GraphQL Filter 語法

### 常用 Where 條件

```graphql
# 等於
where: { state: { equals: "published" } }

# 不等於
where: { state: { not: { equals: "draft" } } }

# 包含 (字串)
where: { title: { contains: "環境" } }

# 開頭
where: { slug: { startsWith: "test" } }

# 大於/小於 (日期)
where: { publishTime: { gte: "2024-01-01" } }
where: { publishTime: { lt: "2024-12-31" } }

# IN 查詢
where: { style: { in: ["news", "default"] } }

# OR 條件
where: {
  OR: [
    { author1: { id: { equals: "1" } } }
    { author2: { id: { equals: "1" } } }
  ]
}

# AND 條件 (預設)
where: {
  state: { equals: "published" }
  category: { id: { equals: "2" } }
}

# 關聯查詢
where: {
  tags: { some: { name: { equals: "環境" } } }
}
where: {
  category: { slug: { equals: "news" } }
}
```

### 排序

```graphql
# 單一欄位排序
orderBy: { publishTime: desc }
orderBy: { sortOrder: asc }

# 多欄位排序
orderBy: [{ sortOrder: asc }, { createdAt: desc }]
```

### 分頁

```graphql
# 取前 N 筆
posts(take: 10)

# 跳過前 N 筆
posts(skip: 10, take: 10)
```
