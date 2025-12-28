# Draft Renderer 樣式修改紀錄

> 最後更新：2025-12-28

## 設計主色調

| 顏色名稱 | 色碼 | 用途 |
|---------|------|------|
| 主綠色 | `#2d7a4f` | H2 標題、連結、邊框、圖示 |
| 深綠色 (hover) | `#1e5a38` | 連結 hover 狀態 |
| 淺綠背景 | `#f0f9f4` | infobox、blockquote、表格表頭 |
| 淺灰背景 | `#f5f5f5` | sideindex、colorbox 預設 |
| 文字色 | `rgba(0, 9, 40, 0.87)` | 主要內文 |
| 次要文字 | `rgba(0, 9, 40, 0.5)` | 圖片說明、caption |
| 邊框色 | `#e0e0e0` | 分隔線、表格邊框 |

---

## 已修改的元件

### 1. 基礎文字樣式 (`shared-style/index.ts`)

| 樣式 | 修改前 | 修改後 |
|------|--------|--------|
| **H2 標題** | 黑色 `#000000`, font-weight: 500 | 綠色 `#2d7a4f`, font-weight: 700 |
| **引言 (blockquote)** | 灰色文字, 無背景 | 綠色左邊框 `4px solid #2d7a4f`, 淺綠背景 `#f0f9f4`, padding: 16px 20px |
| **連結** | 黃色底線 `#ebf02c` | 綠色文字 `#2d7a4f`, text-decoration: underline |
| **列表 (ul/ol)** | padding-left: 1.2rem | padding-left: 1.5rem, margin-left: 0.5rem |

### 2. backgroundimage (`block-renderers/background-image-block.tsx`)

| 修改前 | 修改後 |
|--------|--------|
| `width: 100vw` (破版) | `width: 100%` |
| `margin: calc(50% - 50vw)` | `margin: 32px 0 0` |
| `min-height: 100vh` | `min-height: 60vh` |
| 背景圖 `height: 100vh` | `height: 100%` + `object-fit: cover` |

### 3. sideindex (`block-renderers/side-index-block.tsx`)

| 修改前 | 修改後 |
|--------|--------|
| 無背景 | 淺灰背景 `#f5f5f5` |
| 無邊框 | 綠色左邊框 `4px solid #2d7a4f` |
| 無 padding | `padding: 16px 20px` (mobile), `20px 24px` (md) |

### 4. infobox (`block-renderers/info-box-block.tsx`)

| 修改前 | 修改後 |
|--------|--------|
| 淺紫背景 `#f6f6fb` | 淺綠背景 `#f0f9f4` |
| 深藍左邊框 `#04295e` | 移除左邊框 |
| 標題深藍色 `#000928` | 標題綠色 `#2d7a4f` |
| 破版 `transform: translateX(-20px)` | 正常寬度 `width: 100%` |
| `fontSize.sm` | `fontSize.md`, `line-height: 1.8` |

### 5. divider (`block-renderers/divider-block.tsx`)

| 修改前 | 修改後 |
|--------|--------|
| `border-style: inset` | `border: none; border-top: 1px solid #e0e0e0` |

### 6. table (`block-renderers/table-block.tsx`)

| 修改前 | 修改後 |
|--------|--------|
| `overflow: scroll` | `overflow-x: auto` |
| `width: 95%` | `width: 100%` |
| 無表頭樣式 | 第一行淺綠背景 `#f0f9f4`, font-weight: 600 |
| 無斑馬紋 | 偶數行 `#fafafa` |
| `padding: 10px` | `padding: 12px 16px` |
| 邊框 `#e1e5e9` | 邊框 `#e0e0e0` |

### 7. slideshow (`block-renderers/slideshow-block.tsx`)

| 修改前 | 修改後 |
|--------|--------|
| `width: calc(100% + 40px)` (破版) | `width: 100%` |
| `transform: translateX(-20px)` | 移除 |
| `filter: brightness(15%)` (太暗) | `filter: brightness(0.85)` |
| 箭頭使用圖片 `arrowDown` | 改用 CSS `content: '▼'` |
| 展開按鈕顏色 `#000928` | `rgba(36, 36, 36, 0.7)` |

### 8. video (`block-renderers/video-block.tsx`)

| 修改前 | 修改後 |
|--------|--------|
| 無背景 | `background-color: #000` |

### 9. embeddedcode (`block-renderers/embedded-code-block.tsx`)

| 修改前 | 修改後 |
|--------|--------|
| 無 margin | 加入 `theme.margin.default` |
| caption `padding: 15px 15px 0 15px` | `padding: 8px 0 0 0` |
| caption `color: #808080` | `color: rgba(0, 9, 40, 0.5)` |
| 無 | 新增 `iframe { max-width: 100% }` |

### 10. colorbox (`block-renderers/color-box-block.tsx`)

| 修改前 | 修改後 |
|--------|--------|
| 預設白色 `#FFFFFF` | 預設淺灰 `#f5f5f5` |
| `padding: 12px 24px` | `padding: 20px 24px` (mobile), `24px 32px` (md) |
| 間距 `32px` | 間距 `16px` |
| 無字體設定 | `fontSize.md`, `line-height: 1.8` |

### 11. annotation (`entity-decorators/annotation-decorator.tsx`)

| 修改前 | 修改後 |
|--------|--------|
| 箭頭使用圖片 `annotationArrow` | 改用 CSS `content: '▼'`, 綠色 `#2d7a4f` |

---

### 12. slideshow-lightbox (`components/slideshow-lightbox.tsx`)

| 修改前 | 修改後 |
|--------|--------|
| CloseButton 使用圖片 `slideshow-close-cross.png` | 改用 CSS `::before` + `::after` 偽元素 |
| - | X 圖示：兩條白色線條 `24px x 2px`，旋轉 ±45° |

### 13. slideshow-sidebar (`components/slideshow-sidebar.tsx`)

| 修改前 | 修改後 |
|--------|--------|
| ArrowUp/Down 使用圖片 `slideshow-arrow-up.png` / `slideshow-arrow-down.png` | 改用 CSS `::before` 偽元素 |
| - | Chevron 箭頭：`border-left` + `border-bottom` 繪製 L 形，旋轉 135° / -45° |

---

## 尚未修改的元件

| 元件 | 檔案位置 | 備註 |
|------|----------|------|
| **image** | `block-renderers/image-block.tsx` | 目前樣式已符合設計 |
| **audio** | `block-renderers/audio-block.tsx` | 待確認是否需要修改 |
| **background-video** | `block-renderers/background-video-block.tsx` | 待確認是否需要修改 |
| **media-block** | `block-renderers/media-block.tsx` | 待確認是否需要修改 |
| **related-post-block** | `block-renderers/related-post-block.tsx` | 待確認是否需要修改 |
| **link-decorator** | `entity-decorators/link-decorator.tsx` | 待確認是否需要修改 |

---

## 圖片資源處理

### 問題
`babel-plugin-file-loader` 會將圖片 URL 指向 unpkg.com，本地開發時無法存取。

### 解決方案
1. **已修改 `.babelrc.js`**：本地開發時使用相對路徑
2. **已移除圖片依賴**：
   - `annotationArrow` → CSS Unicode 符號 `▼`
   - `slideshow-arrow-down.png` / `slideshow-arrow-up.png` → CSS chevron 箭頭
   - `slideshow-close-cross.png` → CSS X 圖示

### 仍使用圖片的檔案
- `slideshow-block.tsx`: `defaultImage` (預設圖片)
- `slideshow-lightbox.tsx`: `defaultImage` (預設圖片)
- `slideshow-sidebar.tsx`: `defaultImage` (預設圖片)
- `image-block.tsx`: `defaultImage` (預設圖片)
- `shared-style/content-type.ts`: `citationLink` (引用連結圖示)

---

## 檔案結構

```
packages/draft-renderer/src/website/eic/
├── assets/                          # 靜態資源
│   ├── annotation-arrow.png         # (已棄用，改用 CSS)
│   ├── citation-link.png            # 引用連結圖示
│   ├── default-og-img.png           # 預設圖片
│   └── slideshow-arrow-down-dark.png # (已棄用，改用 CSS)
├── block-renderers/                 # Block 渲染器
│   ├── background-image-block.tsx   # ✅ 已修改
│   ├── background-video-block.tsx   # ❌ 未修改
│   ├── audio-block.tsx              # ❌ 未修改
│   ├── color-box-block.tsx          # ✅ 已修改
│   ├── divider-block.tsx            # ✅ 已修改
│   ├── embedded-code-block.tsx      # ✅ 已修改
│   ├── image-block.tsx              # ⚪ 無需修改
│   ├── info-box-block.tsx           # ✅ 已修改
│   ├── media-block.tsx              # ❌ 未修改
│   ├── related-post-block.tsx       # ❌ 未修改
│   ├── side-index-block.tsx         # ✅ 已修改
│   ├── slideshow-block.tsx          # ✅ 已修改
│   ├── table-block.tsx              # ✅ 已修改
│   └── video-block.tsx              # ✅ 已修改
├── components/                      # 子元件
│   ├── slideshow-lightbox.tsx       # ✅ 已修改 (移除圖片依賴)
│   └── slideshow-sidebar.tsx        # ✅ 已修改 (移除圖片依賴)
├── entity-decorators/               # Entity 裝飾器
│   ├── annotation-decorator.tsx     # ✅ 已修改
│   ├── link-decorator.tsx           # ❌ 未修改
│   └── index.ts
├── shared-style/                    # 共用樣式
│   ├── index.ts                     # ✅ 已修改
│   └── content-type.ts              # ⚪ 無需修改
├── theme/
│   └── index.ts                     # ⚪ 無需修改
├── draft-renderer.tsx               # 主要渲染器
└── index.ts                         # 入口
```

---

## 測試

### 測試文章
- **Post ID**: `238659` (包含所有 block 類型的測試文章)
- **環境**: `https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql`

### Build 指令
```bash
cd packages/draft-renderer
yarn build
```

### 本地開發
```bash
cd packages/e-info
yarn dev
```

---

## 後續待辦

- [ ] 確認 `audio-block.tsx` 是否需要修改
- [ ] 確認 `background-video-block.tsx` 是否需要修改
- [ ] 確認 `link-decorator.tsx` 是否需要修改
- [ ] 處理 `citationLink` 圖片（目前仍使用 unpkg.com）
- [ ] 發布新版本到 npm 後，將 `.babelrc.js` 改回 production 模式
- [x] ~~確認 `slideshow-lightbox.tsx` 是否需要修改~~ (已完成 - 移除圖片依賴)
- [x] ~~確認 `slideshow-sidebar.tsx` 是否需要修改~~ (已完成 - 移除圖片依賴)
