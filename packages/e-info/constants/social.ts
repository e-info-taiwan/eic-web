// 官方社群連結
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/enc.teia',
  x: 'https://x.com/e_info',
  instagram: 'https://www.instagram.com/enc.teia/',
  line: 'https://line.me/R/ti/p/@e-info',
}

// 分享 URL pattern（帶入 url 參數即可使用）
export const SHARE_URL = {
  facebook: (url: string) => `https://www.facebook.com/share.php?u=${url}`,
  x: (url: string) => `https://twitter.com/intent/tweet?url=${url}`,
  line: (url: string) =>
    `https://social-plugins.line.me/lineit/share?url=${url}`,
}
