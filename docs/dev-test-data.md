# Dev 環境測試資料

> 最後更新：2025-12-05
>
> API Endpoint: `https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql`

---

## 目錄

1. [資料總覽](#資料總覽)
2. [Sections 大分類](#sections-大分類)
3. [Categories 中分類](#categories-中分類)
4. [Topics 專題](#topics-專題)
5. [Tags 標籤](#tags-標籤)
6. [Posts 文章](#posts-文章)
7. [Events 活動](#events-活動)
8. [Jobs 工作機會](#jobs-工作機會)
9. [Authors 作者](#authors-作者)
10. [查詢指令](#查詢指令)

---

## 資料總覽

| 類型 | 總數 | 有效資料 | 備註 |
|------|------|----------|------|
| Sections | 1 | 1 | 測試大分類 |
| Categories | 1 | 1 | 測試中分類 |
| Topics | 1 | 1 | 測試用專題 |
| Tags | 27,872 | 3 (有文章) | 大量舊資料，僅 3 個有關聯文章 |
| Posts | 多筆 | ~10 筆已發布 | 包含測試文章 |
| Events | 5+ | 5+ | 活動資料 |
| Jobs | 5+ | 5+ | 工作機會 |
| Authors | 3+ | 3+ | 作者資料 |
| HomepagePicks | 0 | 0 | 尚未建立 |
| InfoGraphs | 0 | 0 | 尚未建立 |
| Newsletters | 0 | 0 | 尚未建立 |
| Ads | 0 | 0 | 尚未建立 |

---

## Sections (大分類)

### 資料列表

| ID | Slug | Name | 顯示在 Header | 排序 | 文章數 | 中分類數 |
|----|------|------|--------------|------|--------|----------|
| 2 | `testsection` | 測試大分類 | ❌ | 1 | 1 | 1 |

### 完整資料

```json
{
  "id": "2",
  "slug": "testsection",
  "name": "測試大分類",
  "style": "default",
  "showInHeader": false,
  "sortOrder": 1,
  "categoriesCount": 1,
  "postsCount": 1
}
```

---

## Categories (中分類)

### 資料列表

| ID | Slug | Name | 所屬 Section | 排序 | 文章數 |
|----|------|------|-------------|------|--------|
| 2 | `testcategory` | 測試中分類 | 測試大分類 (ID: 2) | 1 | 1 |

### 完整資料

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

## Topics (專題)

### 資料列表

| ID | 標題 | 狀態 | 置頂 | 文章數 | 標籤數 | 有主圖 |
|----|------|------|------|--------|--------|--------|
| 2 | 測試用專題 | published | ❌ | 2 | 2 | ✅ |

### 完整資料

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
      "original": "https://statics-readr-tw-dev.readr.tw/images/325fb5e1-e20d-45ed-a529-8eef15b222b1.jpg",
      "w480": "https://statics-readr-tw-dev.readr.tw/images/325fb5e1-e20d-45ed-a529-8eef15b222b1-w480.jpg"
    }
  },
  "createdAt": "2025-11-24T02:12:04.212Z"
}
```

---

## Tags (標籤)

### 統計

- **總數**: 27,872 筆
- **精選標籤 (isFeatured)**: 0 筆
- **有關聯文章**: 3 筆
- **有關聯專題**: 2 筆

### 有文章關聯的標籤

| ID | 名稱 | 精選 | 文章數 | 專題數 |
|----|------|------|--------|--------|
| 12 | 深度報導 | ❌ | 1 | 0 |
| 13 | 中國新聞 | ❌ | 1 | 0 |
| 16 | 回顧與前瞻 | ❌ | 1 | 1 |

### 有專題關聯的標籤

| ID | 名稱 | 精選 | 文章數 | 專題數 |
|----|------|------|--------|--------|
| 5 | 台灣新聞 | ❌ | 0 | 1 |
| 16 | 回顧與前瞻 | ❌ | 1 | 1 |

### 常見標籤 (無文章關聯)

| ID | 名稱 | 類型 |
|----|------|------|
| 14 | 國際新聞 | 新聞類 |
| 24 | 社論 | 新聞類 |
| 47 | 攝影賞析 | 內容類 |
| 48 | 綠色影展 | 內容類 |
| 49 | 大地之音 | 內容類 |
| 52 | 生態工作假期 | 活動類 |
| 56 | 我們的島 | 節目類 |
| 60 | 國家公園 | 主題類 |
| 61 | 研討會 | 活動類 |
| 62 | 活動 | 活動類 |
| 63 | 課程／營隊／工作坊 | 活動類 |
| 64 | 演講／座談會 | 活動類 |
| 68 | 展覽／節目預告 | 活動類 |
| 70 | 生物簡介 | 內容類 |
| 72 | 自然書寫 | 內容類 |
| 73 | 自然人文 | 內容類 |
| 77 | 公聽會／審查會／記者會 | 活動類 |
| 89 | 環境副刊 | 內容類 |
| 91 | 環境政策 | 主題類 |
| 92 | 生活環境 | 主題類 |
| 108 | 政策 | 主題類 |
| 109 | 法律 | 主題類 |
| 110 | 議案 | 主題類 |
| 111 | 公約 | 主題類 |
| 112 | 執法 | 主題類 |

---

## Posts (文章)

### 主要測試文章

| ID | 標題 | Style | 發布時間 | 有主圖 | 分類 | 專題 |
|----|------|-------|----------|--------|------|------|
| 238659 | 偉力測試文章，所有元件套件都用上 | default | 2025-11-23 | ✅ | 測試中分類 | 測試用專題 |
| 238652 | 台灣白海豚成員再+1 少年期個體「OCA070」連續三年現蹤！ | default | 2024-03-08 | ✅ | - | - |
| 238656 | 240308電子報｜空巴、現代推新款eVTOL... | default | 2024-03-08 | ❌ | - | - |
| 238650 | 2024年躉購費率出爐 光電費率下修... | default | 2024-03-08 | ✅ | - | - |
| 238651 | 空巴、現代推新款eVTOL「空中計程車」... | default | 2024-03-08 | ✅ | - | - |

### 完整測試文章 (ID: 238659)

```json
{
  "id": "238659",
  "title": "偉力測試文章，所有元件套件都用上",
  "subtitle": "我把副標打開來看，看會怎樣",
  "state": "published",
  "publishTime": "2025-11-23T16:00:00.000Z",
  "style": "default",
  "heroCaption": "測試用的首圖圖說，必須要出現在首圖下方",
  "section": {
    "id": "2",
    "slug": "testsection",
    "name": "測試大分類"
  },
  "category": {
    "id": "2",
    "slug": "testcategory",
    "name": "測試中分類"
  },
  "topic": {
    "id": "2",
    "title": "測試用專題"
  },
  "author1": {
    "id": "200001",
    "name": "彭瑞祥"
  },
  "author2": {
    "id": "200002",
    "name": "詹嘉紋"
  },
  "author3": {
    "id": "200003",
    "name": "陳文姿"
  },
  "otherByline": "羅偉力、李又如",
  "tags": [
    { "id": "16", "name": "回顧與前瞻" },
    { "id": "13", "name": "中國新聞" },
    { "id": "12", "name": "深度報導" }
  ],
  "heroImage": {
    "resized": {
      "original": "https://statics-readr-tw-dev.readr.tw/images/09257fcb-bb0b-4e3d-885c-675de7d01347.jpg",
      "w480": "https://statics-readr-tw-dev.readr.tw/images/09257fcb-bb0b-4e3d-885c-675de7d01347-w480.jpg",
      "w800": "https://statics-readr-tw-dev.readr.tw/images/09257fcb-bb0b-4e3d-885c-675de7d01347-w800.jpg"
    }
  }
}
```

---

## Events (活動)

### 資料列表

| ID | 名稱 | 類型 | 開始日期 | 結束日期 | 首頁顯示 |
|----|------|------|----------|----------|----------|
| 238591 | 【台灣環境資訊協會】閒來無塑，一起來彰化濕地文化體驗吧！ | physical | 2024-03-31 | 2024-03-31 | ❌ |
| 238575 | 【荒野台北】3月週四見講座：粉彩外來種的美麗與哀愁—布袋蓮 | physical | 2024-03-28 | 2024-03-28 | ❌ |
| 238581 | 【荒野台北】《河岸漫遊》2024五股濕地生態園區三月份生態導覽 | physical | 2024-03-24 | 2024-03-24 | ❌ |
| 238599 | 【綠盟】貢寮走讀：踩著沙、踏著浪，一起來看核電廠 | physical | 2024-03-23 | 2024-03-23 | ❌ |
| 238564 | 【台灣環境資訊協會】2024海洋x種子講師甄選計畫 | physical | 2024-03-23 | 2024-03-23 | ❌ |

### 完整資料範例 (ID: 238599)

```json
{
  "id": "238599",
  "name": "【綠盟】貢寮走讀：踩著沙、踏著浪，一起來看核電廠",
  "organizer": "",
  "eventType": "physical",
  "startDate": "2024-03-23T00:00:00.000Z",
  "endDate": "2024-03-23T00:00:00.000Z",
  "location": "",
  "fee": "",
  "registrationUrl": "",
  "showOnHomepage": false,
  "heroImage": {
    "resized": {
      "original": "https://statics-readr-tw-dev.readr.tw/images/2879023e-4b06-447a-b341-60476e7118c8.png",
      "w480": "https://statics-readr-tw-dev.readr.tw/images/2879023e-4b06-447a-b341-60476e7118c8-w480.png"
    }
  }
}
```

---

## Jobs (工作機會)

### 資料列表

| ID | 標題 | 公司 | 審核 | 首頁顯示 |
|----|------|------|------|----------|
| 238627 | 【高雄都會公園】徵聘環境教育人員1名 | - | ✅ | ❌ |
| 238624 | 【知本自然教育中心】環境教育教師徵聘公告 | - | ✅ | ❌ |
| 238623 | 【台灣濕地保護聯盟】招募生態推廣員 | - | ✅ | ❌ |
| 238611 | 【有機農業推動中心】誠徵「專案執行」＆「專任行政助理」 | - | ✅ | ❌ |
| 238610 | 【台南市南瀛文化協會】擴大徵才！新營社區大學企畫執行 | - | ✅ | ❌ |

---

## Authors (作者)

### 資料列表

| ID | 名稱 |
|----|------|
| 200001 | 彭瑞祥 |
| 200002 | 詹嘉紋 |
| 200003 | 陳文姿 |

---

## 查詢指令

### 查詢 Sections 與 Categories

```bash
cat > /tmp/query.json << 'EOF'
{
  "query": "{ sections(orderBy: { sortOrder: asc }) { id slug name style showInHeader sortOrder categoriesCount postsCount categories(orderBy: { sortOrder: asc }) { id slug name sortOrder postsCount } } }"
}
EOF
curl -s -X POST "https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql" \
  -H "Content-Type: application/json" \
  -d @/tmp/query.json | jq '.'
```

### 查詢 Topics

```bash
cat > /tmp/query.json << 'EOF'
{
  "query": "{ topics(orderBy: { createdAt: desc }) { id title status content isPinned postsCount tagsCount heroImage { resized { original w480 } } createdAt } }"
}
EOF
curl -s -X POST "https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql" \
  -H "Content-Type: application/json" \
  -d @/tmp/query.json | jq '.'
```

### 查詢 Tags 數量

```bash
cat > /tmp/query.json << 'EOF'
{
  "query": "{ tagsCount }"
}
EOF
curl -s -X POST "https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql" \
  -H "Content-Type: application/json" \
  -d @/tmp/query.json | jq '.'
```

### 查詢前 30 個 Tags

```bash
cat > /tmp/query.json << 'EOF'
{
  "query": "{ tags(take: 30) { id name isFeatured postsCount topicsCount } }"
}
EOF
curl -s -X POST "https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql" \
  -H "Content-Type: application/json" \
  -d @/tmp/query.json | jq '.'
```

### 查詢最新文章

```bash
cat > /tmp/query.json << 'EOF'
{
  "query": "{ posts(take: 5, where: { state: { equals: \"published\" } }, orderBy: { publishTime: desc }) { id title style publishTime heroImage { resized { original w480 w800 } } category { id slug name } tags { id name } } }"
}
EOF
curl -s -X POST "https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql" \
  -H "Content-Type: application/json" \
  -d @/tmp/query.json | jq '.'
```

### 查詢單篇文章詳情

```bash
cat > /tmp/query.json << 'EOF'
{
  "query": "{ post(where: { id: \"238659\" }) { id title subtitle state publishTime style heroCaption section { id slug name } category { id slug name } topic { id title } author1 { id name } author2 { id name } author3 { id name } otherByline tags { id name } heroImage { resized { original w480 w800 } } } }"
}
EOF
curl -s -X POST "https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql" \
  -H "Content-Type: application/json" \
  -d @/tmp/query.json | jq '.'
```

### 查詢活動

```bash
cat > /tmp/query.json << 'EOF'
{
  "query": "{ events(where: { state: { equals: \"published\" } }, orderBy: { startDate: desc }, take: 5) { id name organizer eventType startDate endDate location fee registrationUrl showOnHomepage heroImage { resized { original w480 } } } }"
}
EOF
curl -s -X POST "https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql" \
  -H "Content-Type: application/json" \
  -d @/tmp/query.json | jq '.'
```

### 查詢工作機會

```bash
cat > /tmp/query.json << 'EOF'
{
  "query": "{ jobs(where: { state: { equals: \"published\" } }, orderBy: { startDate: desc }, take: 5) { id title company salary startDate endDate showOnHomepage isApproved } }"
}
EOF
curl -s -X POST "https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql" \
  -H "Content-Type: application/json" \
  -d @/tmp/query.json | jq '.'
```

---

## 備註

1. **Tags 資料**: 大量標籤是從舊系統遷移過來的，目前只有 3 個有文章關聯
2. **精選標籤**: 尚未設定任何 `isFeatured: true` 的標籤
3. **首頁精選**: `HomepagePicks` 尚未建立任何資料
4. **活動與工作**: 有資料但 `showOnHomepage` 都是 `false`
5. **圖片**: 大部分測試資料都有正確的圖片 URL
