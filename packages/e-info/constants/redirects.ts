/**
 * 頁面轉址設定
 *
 * 用於將友善的 URL 路徑對應到 CMS 文章頁面
 * 這些設定會在 next.config.mjs 中被轉換為 Next.js rewrites
 *
 * 使用方式：
 * - path: 友善的 URL 路徑（例如 /faq）
 * - postId: 對應的 CMS 文章 ID
 *
 * 範例：
 * { path: '/faq', postId: '238663' }
 * 訪問 /faq 時會顯示文章 238663 的內容（URL 保持為 /faq）
 */

export type PageRedirect = {
  /** 友善的 URL 路徑 */
  path: string
  /** 對應的 CMS 文章 ID */
  postId: string
  /** 說明（僅供參考，不影響功能） */
  description?: string
}

/**
 * 頁面轉址設定列表
 *
 * 新增轉址時，只需在此陣列中加入新的設定項目
 */
export const pageRedirects: PageRedirect[] = [
  {
    path: '/about',
    postId: '2',
    description: '關於我們',
  },
  {
    path: '/faq',
    postId: '10',
    description: '常見問題',
  },
  {
    path: '/privacy',
    postId: '11',
    description: '隱私權政策',
  },
  {
    path: '/awards',
    postId: '12',
    description: '獲獎紀錄',
  },
  {
    path: '/copyright',
    postId: '13',
    description: '網站授權條款',
  },
  {
    path: '/editorial-guidelines',
    postId: '210972',
    description: '編輯室自律公約',
  },
  {
    path: '/media-partners',
    postId: '228474',
    description: '合作媒體',
  },
  {
    path: '/sitemap',
    postId: '55973',
    description: '網站導覽',
  },
  {
    path: '/submission-guidelines',
    postId: '210973',
    description: '投稿須知',
  },
]

/**
 * 將 pageRedirects 轉換為 Next.js rewrites 格式
 */
export function getNextRewrites() {
  return pageRedirects.map(({ path, postId }) => ({
    source: path,
    destination: `/node/${postId}`,
  }))
}
