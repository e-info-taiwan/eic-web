# Newsletter API 規格文件

## 概述

Newsletter（電子報）是獨立於 Post 的內容類型，用於管理和發送電子報。電子報內容主要存放在 `standardHtml` 欄位中，以 HTML 格式儲存。

## GraphQL API Endpoint

- **Development**: `https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql`
- **Staging**: `https://readr-gql-staging-4g6paft7cq-de.a.run.app/api/graphql`
- **Production**: `https://readr-gql-prod-4g6paft7cq-de.a.run.app/api/graphql`

## Newsletter Type

### 基本欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | ID! | 電子報 ID |
| `title` | String | 標題（格式：YYMMDD電子報｜主標題） |
| `sendDate` | DateTime | 發送日期 |
| `heroImage` | Photo | 主視覺圖片 |
| `showMenu` | Boolean | 是否顯示選單 |
| `showReadingRank` | Boolean | 是否顯示閱讀排行 |
| `originalUrl` | String | 原始網址（如 `https://e-info.org.tw/node/242721`） |
| `createdAt` | DateTime | 建立時間 |
| `updatedAt` | DateTime | 更新時間 |
| `createdBy` | User | 建立者 |
| `updatedBy` | User | 更新者 |

### 內容關聯欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| `focusPosts` | [Post!] | 焦點文章列表 |
| `focusPostsCount` | Int | 焦點文章數量 |
| `relatedPosts` | [Post!] | 相關文章列表 |
| `relatedPostsCount` | Int | 相關文章數量 |
| `ads` | [Ad!] | 廣告列表 |
| `adsCount` | Int | 廣告數量 |
| `events` | [Event!] | 活動列表 |
| `eventsCount` | Int | 活動數量 |
| `poll` | Poll | 投票 |

### 讀者回應欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| `readerResponseTitle` | String | 推薦讀者回應的文章標題 |
| `readerResponseLink` | String | 讀者回應連結（通常為 Facebook 留言連結） |
| `readerResponseText` | String | 讀者回應內容 |

### HTML 內容欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| `standardHtml` | String | 標準版 HTML（**主要使用**） |
| `beautifiedHtml` | String | 美化版 HTML（目前大多為空） |

## 關聯類型

### Ad（廣告）

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | ID! | 廣告 ID |
| `name` | String | 廣告名稱 |
| `image` | Photo | 廣告圖片 |
| `imageUrl` | String | 廣告連結網址 |
| `showOnHomepage` | Boolean | 是否顯示於首頁 |
| `showOnHomepageDeepTopic` | Boolean | 是否顯示於首頁深度專題 |
| `state` | String | 狀態 |
| `sortOrder` | Int | 排序順序 |

### Event（活動）

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | ID! | 活動 ID |
| `name` | String | 活動名稱 |
| `heroImage` | Photo | 活動主視覺 |
| `organizer` | String | 主辦單位 |
| `contactInfo` | String | 聯絡資訊 |
| `eventType` | String | 活動類型 |
| `startDate` | DateTime | 開始日期 |
| `endDate` | DateTime | 結束日期 |
| `location` | String | 活動地點 |
| `fee` | String | 費用 |
| `registrationUrl` | String | 報名網址 |
| `content` | String | 活動內容 |
| `isApproved` | Boolean | 是否已審核 |
| `showOnHomepage` | Boolean | 是否顯示於首頁 |
| `sortOrder` | Int | 排序順序 |
| `state` | String | 狀態 |

### Poll（投票）

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | ID! | 投票 ID |
| `name` | String | 投票名稱 |
| `content` | String | 投票說明 |
| `option1` | String | 選項 1 |
| `option1Image` | Photo | 選項 1 圖片 |
| `option2` | String | 選項 2 |
| `option2Image` | Photo | 選項 2 圖片 |
| `option3` | String | 選項 3 |
| `option3Image` | Photo | 選項 3 圖片 |
| `option4` | String | 選項 4 |
| `option4Image` | Photo | 選項 4 圖片 |
| `option5` | String | 選項 5 |
| `option5Image` | Photo | 選項 5 圖片 |
| `posts` | [Post!] | 相關文章 |
| `postsCount` | Int | 相關文章數量 |
| `status` | String | 狀態 |

## 查詢範例

### 查詢電子報列表（依日期範圍）

```graphql
query GetNewslettersByMonth($startDate: DateTime!, $endDate: DateTime!) {
  newsletters(
    where: { sendDate: { gte: $startDate, lte: $endDate } }
    orderBy: { sendDate: asc }
  ) {
    id
    title
    sendDate
    heroImage {
      resized {
        original
        w480
        w800
      }
    }
  }
}
```

### 查詢單一電子報詳細資料

```graphql
query GetNewsletterById($id: ID!) {
  newsletter(where: { id: $id }) {
    id
    title
    sendDate
    heroImage {
      resized {
        original
        w480
        w800
        w1200
      }
    }
    standardHtml
    originalUrl
    readerResponseTitle
    readerResponseLink
    readerResponseText
    showMenu
    showReadingRank
    focusPosts {
      id
      title
      publishTime
      heroImage {
        resized {
          original
          w480
        }
      }
    }
    relatedPosts {
      id
      title
    }
    ads {
      id
      name
      imageUrl
      image {
        resized {
          original
        }
      }
    }
    events {
      id
      name
      startDate
      endDate
      location
    }
    poll {
      id
      name
      content
      option1
      option2
      option3
      option4
      option5
    }
  }
}
```

### 查詢電子報年份範圍

```graphql
query GetNewsletterYearRange {
  oldest: newsletters(
    orderBy: { sendDate: asc }
    take: 1
    where: { sendDate: { gte: "2000-01-01T00:00:00.000Z" } }
  ) {
    sendDate
  }
  newest: newsletters(orderBy: { sendDate: desc }, take: 1) {
    sendDate
  }
}
```

### 查詢電子報總數

```graphql
query {
  newslettersCount
}
```

## standardHtml 結構

`standardHtml` 欄位包含完整的電子報 HTML 內容，主要區塊如下：

### 1. 日期顯示
```html
<div style="text-align: right; color: #606060; font-weight: bold;">
  2025 年 12 月 18 日
</div>
```

### 2. 焦點新聞 (field-name-field-focus-news)
```html
<div class="field-name-field-focus-news">
  <table>
    <tr id="focus-row-1">
      <td class="mcnTextContent">
        <div class="news-tit">
          <a href="..."><div>新聞標題</div></a>
        </div>
        <div><a href="..."><img src="..." /></a></div>
        <div class="field-content">新聞摘要...</div>
        <div class="float-right"><a href="...">» 閱讀全文</a></div>
      </td>
    </tr>
  </table>
</div>
```

### 3. 焦點專題 (field-name-field-focus-article)
```html
<div class="field-name-field-focus-article">
  <table>
    <tr id="topic-row-1">
      <td class="mcnTextContent">
        <div class="news-tit"><a href="...">專題標題</a></div>
        <div><a href="..."><img src="..." /></a></div>
        <div class="field-content">專題內容...</div>
        <div class="float-right"><a href="...">» 閱讀全文</a></div>
      </td>
    </tr>
  </table>
</div>
```

### 4. 環境新聞掃描 (quoted-news anchor)
```html
<a name="quoted-news"></a>
<table>
  <tr>
    <td class="mcnTextContent">
      <span><a href="...">
        <div><img src="..." /></div>
        <div class="news-scan-tit">新聞標題列表</div>
      </a></span>
    </td>
  </tr>
</table>
```

### 5. 廣告區
```html
<div class="node-simpleads">
  <a href="..." target="_blank">
    <img src="..." width="250" height="80" />
  </a>
</div>
```

### 6. 近期活動 (event-list anchor)
```html
<a name="event-list"></a>
<table>
  <tr>
    <td>
      <div class="news-tit"><a href="...">近期活動 × 行動參與</a></div>
    </td>
  </tr>
  <tr>
    <td>
      <div class="field-label">近期活動</div>
      <ul>
        <li>
          <span class="date-display-single">12/31</span>
          <a href="...">活動名稱</a>
        </li>
      </ul>
    </td>
  </tr>
</table>
```

### 7. 推薦讀者回應 (recommand-msg anchor)
```html
<a name="recommand-msg"></a>
<table>
  <tr>
    <td>
      <div class="news-tit">
        推薦讀者回應｜<a href="...">文章標題</a>
      </div>
    </td>
  </tr>
  <tr>
    <td>
      <div class="views-field">讀者留言內容</div>
      <div class="float-right"><a href="...">» 閱讀全文</a></div>
    </td>
  </tr>
</table>
```

## 資料庫現況（Dev 環境）

- **總筆數**: 13,367 筆電子報
- **最新電子報**: ID `8816`（2025-12-18）
- **最早電子報**: 2000 年起

### 注意事項

1. `focusPosts`、`relatedPosts`、`ads`、`events` 等關聯欄位在現有資料中大多為空，實際內容直接嵌入在 `standardHtml` 中
2. `beautifiedHtml` 欄位目前大多為空
3. 電子報標題格式通常為：`YYMMDD電子報｜主標題`

## 測試資料

| ID | 標題 | 發送日期 |
|----|------|----------|
| 8816 | 251218電子報｜歐盟放寬2035年燃油車禁令... | 2025-12-18 |
| 8815 | 251217電子報｜南極觀光熱潮成環境危機... | 2025-12-17 |
| 8814 | 251216電子報｜中小企業也能參與的國際綠電承諾... | 2025-12-16 |

## 前端頁面

- **電子報列表**: `/newsletter`
- **電子報詳細**: `/newsletter/[id]`

---

**最後更新**: 2026-01-26
