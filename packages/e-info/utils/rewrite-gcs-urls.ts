import { GCS_STATICS_ORIGIN, SITE_ORIGIN } from '~/constants/config'

/**
 * 將 API 回傳資料中的 GCS 圖片 URL 替換為站台 proxy 路徑
 * e.g. https://storage.googleapis.com/statics-e-info-dev/images/xxx.jpg
 *    → https://dev.e-info.org.tw/images/xxx.jpg
 */
export function rewriteGcsUrls<T>(data: T): T {
  if (!GCS_STATICS_ORIGIN || !SITE_ORIGIN || !data) return data

  const prefix = `${GCS_STATICS_ORIGIN}/images/`
  const json = JSON.stringify(data)

  if (!json.includes(prefix)) return data

  return JSON.parse(json.replaceAll(prefix, `${SITE_ORIGIN}/images/`))
}
