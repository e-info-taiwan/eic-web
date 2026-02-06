import { IS_PREVIEW_MODE } from '~/constants/config'

// 用於 gql template literal 內的條件式插值
// Preview mode 下移除 state filter，讓草稿文章也能被查詢
export const publishedStateFilter = IS_PREVIEW_MODE
  ? ''
  : 'state: { equals: "published" }'
