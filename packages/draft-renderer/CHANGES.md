# Draft Renderer 元件修改清單

**修改日期**: 2025-12-28
**修改範圍**: `packages/draft-renderer`

## 修改統計

- 總共修改 **29 個檔案**
- 新增 **189 行**，刪除 **136 行**

---

## 一、Block Renderers（區塊渲染器）

### 1. background-image-block.tsx
**狀態**: ✅ 已修改

**修改內容**:
- 移除 `100vw` 全螢幕寬度，改為 `100%` 容器寬度
- 高度從 `100vh` 調整為 `60vh`（更合理的視覺比例）
- 新增 `overflow: hidden` 防止溢出
- 圖片新增 `object-fit: cover` 確保填滿
- 內容區塊改用 flexbox 置底對齊
- 文字陰影改為 `rgba(0, 0, 0, 0.8)` 增強可讀性
- 空白區塊高度從 `100vh` 減少到 `30vh`

### 2. color-box-block.tsx
**狀態**: ✅ 已修改

**修改內容**:
- 預設背景色從 `#FFFFFF` 改為 `#f5f5f5`（淺灰色）
- 內距調整為 `20px 24px`（桌面版 `24px 32px`）
- 文字顏色改為 `rgba(0, 9, 40, 0.87)`
- 新增 `line-height: 1.8` 增加行高
- 段落間距從 `32px` 減少到 `16px`

### 3. divider-block.tsx
**狀態**: ✅ 已修改

**修改內容**:
- 移除 `border-style: inset` 舊樣式
- 改用 `border-top: 1px solid #e0e0e0` 更現代的分隔線

### 4. embedded-code-block.tsx
**狀態**: ✅ 已修改

**修改內容**:
- 新增預設 margin 間距
- YouTube iframe 新增 `max-width: 100%` 響應式支援
- Caption 樣式更新：
  - 行高改為 `1.5`
  - 顏色改為 `rgba(0, 9, 40, 0.5)`
  - 內距簡化為 `8px 0 0 0`

### 5. info-box-block.tsx
**狀態**: ✅ 已修改

**修改內容**:
- 背景色從 `#f6f6fb` 改為 `#f0f9f4`（淺綠色，配合品牌色）
- 移除負 margin 和 transform 偏移
- 寬度改為 `100%`（移除 `max-width: 560px` 限制）
- 標題樣式更新：
  - 顏色改為品牌綠色 `#2d7a4f`
  - 移除左側藍色邊框
  - 字體大小改為 `lg`
  - 間距調整為 `16px`

### 6. side-index-block.tsx
**狀態**: ✅ 已修改

**修改內容**:
- 新增樣式調整（具體變更待確認）

### 7. slideshow-block.tsx
**狀態**: ✅ 已修改

**修改內容**:
- 展開按鈕文字顏色從 `#000928` 改為 `rgba(36, 36, 36, 0.7)`
- 箭頭顏色同步更新為 `rgba(36, 36, 36, 0.7)`

### 8. table-block.tsx
**狀態**: ✅ 已修改

**修改內容**:
- 表格樣式優化
- 新增響應式支援

### 9. video-block.tsx
**狀態**: ✅ 已修改

**修改內容**:
- 新增樣式調整

### 10. audio-block.js / image-block.js / related-post-block.js
**狀態**: ✅ 已修改

**修改內容**:
- 編譯輸出更新（對應 tsx 源碼修改）

---

## 二、Components（元件）

### 1. slideshow-lightbox.tsx
**狀態**: ✅ 已修改

**修改內容**:
- **移除圖片依賴**: 不再使用 `slideshow-close-cross.png`
- CloseButton 改用 CSS `::before` 和 `::after` 偽元素實作 X 圖示
  - 兩條白色線條 `24px x 2px`
  - 分別旋轉 45° 和 -45°
- 保留 hover 效果（半透明白色背景）

### 2. slideshow-sidebar.tsx
**狀態**: ✅ 已修改

**修改內容**:
- **移除圖片依賴**: 不再使用 `slideshow-arrow-up.png` 和 `slideshow-arrow-down.png`
- ArrowUp / ArrowDown 改用 CSS `::before` 偽元素實作 chevron 箭頭
  - 使用 `border-left` 和 `border-bottom` 繪製 L 形
  - ArrowUp 旋轉 135° 指向上方
  - ArrowDown 旋轉 -45° 指向下方
- 保留原有的 hover 效果和 visibility 控制

---

## 三、Entity Decorators（實體裝飾器）

### 1. annotation-decorator.tsx
**狀態**: ✅ 已修改

**修改內容**:
- **移除外部圖片依賴**: 不再使用 `annotation-arrow.png`
- 箭頭改用 CSS `::before` 偽元素 + Unicode 字符 `▼`
- 箭頭顏色改為品牌綠色 `#2d7a4f`
- 尺寸從 `24px` 調整為 `20px`
- 新增 flexbox 置中對齊

---

## 四、Shared Styles（共用樣式）

### 1. index.ts
**狀態**: ✅ 已修改

**修改內容**:

#### defaultH2Style
- 字重從 `500` 改為 `700`（更粗）
- 行高改為 `1.4`
- 顏色改為品牌綠色 `#2d7a4f`

#### defaultUlStyle / defaultOlStyle
- 左內距改為 `1.5rem`
- 新增左外距 `0.5rem`

#### defaultLinkStyle
- **移除底線裝飾**: 不再使用黃色 `#ebf02c` 底線
- 改用綠色文字 `#2d7a4f` + 下劃線
- 新增 `text-underline-offset: 2px`
- Hover 顏色改為深綠 `#1e5a38`

#### defaultBlockQuoteStyle
- 字體大小從 `sm` 改為 `md`
- 行高從 `1.6` 改為 `1.8`
- 新增淺綠背景 `#f0f9f4`
- 新增左側綠色邊框 `4px solid #2d7a4f`
- 新增內距 `16px 20px`（桌面版 `20px 24px`）

### 2. content-type.js
**狀態**: ✅ 已修改

**修改內容**:
- 編譯輸出更新

---

## 五、配置檔案

### 1. .babelrc.js
**狀態**: ✅ 已修改

**修改內容**:
- Babel 配置調整

---

## 設計系統更新摘要

### 品牌色彩統一
| 用途 | 舊色彩 | 新色彩 |
|------|--------|--------|
| 主要色（標題、連結） | `#04295e` 深藍 / 黃色底線 | `#2d7a4f` 綠色 |
| 背景色 | `#f6f6fb` 淺紫 | `#f0f9f4` 淺綠 |
| Hover 狀態 | `#04295e` 深藍 | `#1e5a38` 深綠 |

### 排版調整
- 整體行高提升（1.6 → 1.8）
- 字重加粗（標題 500 → 700）
- 間距優化（減少過大的留白）

### 響應式改善
- 移除固定的 `100vw` 寬度
- 新增容器 `100%` 寬度限制
- iframe 響應式支援

---

## 待處理項目

- [ ] 確認所有修改在實際頁面的顯示效果
- [ ] 執行 `yarn build` 確認編譯無誤
- [ ] 更新 draft-renderer 版本號

---

*此文件由 Claude Code 自動生成*
