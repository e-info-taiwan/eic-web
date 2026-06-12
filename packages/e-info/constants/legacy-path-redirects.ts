/**
 * 舊站文章 path alias 轉址對應表
 *
 * 來源：Drupal 舊站的根層級網址別名（例如 /malcolm、/spatial_planning2020），
 * 過去直接對應到一篇文章。
 * 目標：新站對應的 /node/{id} 文章頁。
 *
 * 與 taxonomy-redirects.ts 相同，在 next.config.mjs 的 redirects() 中被展開，
 * 產生 308 永久轉址（permanent: true）。
 *
 * 注意：
 * - 多個舊網址可指向同一篇 node（例如 215095 對應兩個別名）。
 * - 含非 ASCII 字元的路徑（例如 /2017環境線上影展），瀏覽器會送出
 *   percent-encoded 形式；getLegacyPathRedirects() 會同時產生原字串與
 *   編碼後兩種 source，確保兩種請求都能正確轉址。
 */

export type LegacyPathRedirect = {
  /** 舊站網址路徑（以 / 開頭，保留原始大小寫） */
  path: string
  /** 新站對應的 CMS 文章 ID */
  nodeId: string
  /** 說明（僅供參考，不影響功能） */
  description?: string
}

export const legacyPathRedirects: LegacyPathRedirect[] = [
  { path: '/spatial_planning2020', nodeId: '223555' },
  { path: '/ChinaGreenPeople', nodeId: '215095' },
  { path: '/Environmentalist-China', nodeId: '215095' },
  { path: '/malcolm', nodeId: '104228' },
  { path: '/2017環境線上影展', nodeId: '203778' },
]

/**
 * 對路徑做 percent-encoding，但保留路徑分隔的斜線。
 */
function encodePath(p: string): string {
  return p
    .split('/')
    .map((segment, index) =>
      index === 0 ? segment : encodeURIComponent(segment)
    )
    .join('/')
}

/**
 * 將對應表轉換為 Next.js redirects() 格式（308 永久轉址）。
 * 對含非 ASCII 字元的路徑，額外產生 percent-encoded 的 source 版本。
 */
export function getLegacyPathRedirects() {
  const redirects: { source: string; destination: string; permanent: true }[] =
    []

  for (const { path, nodeId } of legacyPathRedirects) {
    const destination = `/node/${nodeId}`
    redirects.push({ source: path, destination, permanent: true })

    const encoded = encodePath(path)
    if (encoded !== path) {
      redirects.push({ source: encoded, destination, permanent: true })
    }
  }

  return redirects
}
