import ga4 from 'react-ga4'

import { GA_TRACKING_ID } from '~/constants/environment-variables'

export const init = () =>
  ga4.initialize(GA_TRACKING_ID, {
    gaOptions: { send_page_view: false },
  })

export const sendEvent = (category: string, action: string, label?: string) =>
  ga4.event({
    category,
    action,
    label,
  })

// 帶有自訂維度的事件追蹤（使用 gtag 直接呼叫）
export const sendEventWithDimensions = (
  category: string,
  action: string,
  label?: string,
  dimensions?: Record<string, string | number | undefined>
) =>
  ga4.gtag('event', action, {
    event_category: category,
    event_label: label,
    ...dimensions,
  })

export const sendPageview = (path: string) =>
  ga4.send({
    hitType: 'pageview',
    page: path,
  })

// 文章頁面瀏覽追蹤（含分類維度）
export const sendArticlePageview = (
  path: string,
  articleData: {
    articleId?: string
    articleTitle?: string
    articleCategory?: string
    articleSection?: string
    articleTags?: string[]
  }
) =>
  ga4.gtag('event', 'page_view', {
    page_path: path,
    article_id: articleData.articleId,
    article_title: articleData.articleTitle,
    article_category: articleData.articleCategory,
    article_section: articleData.articleSection,
    article_tags: articleData.articleTags?.join(','),
  })

// 轉換目標追蹤
export const sendConversion = (
  conversionType:
    | 'newsletter_subscribe'
    | 'donation_complete'
    | 'share_complete'
    | 'external_link_click',
  value?: string | number
) =>
  ga4.event({
    category: 'Conversion',
    action: conversionType,
    label: value?.toString(),
  })

// 會員行為追蹤
export const sendMemberEvent = (
  action: 'login' | 'register' | 'logout' | 'bookmark' | 'unbookmark',
  label?: string
) =>
  ga4.event({
    category: 'Member',
    action,
    label,
  })

// 閱讀進度追蹤（使用 gtag 直接呼叫以支援自訂維度）
export const sendReadingProgress = (
  progress: 25 | 50 | 75 | 100,
  articleId?: string,
  articleCategory?: string
) =>
  ga4.gtag('event', 'scroll_depth', {
    event_category: 'Reading',
    event_label: `${progress}%`,
    article_id: articleId,
    article_category: articleCategory,
  })

// 外部連結點擊追蹤（使用 gtag 直接呼叫以支援自訂維度）
export const sendOutboundClick = (url: string, linkText?: string) =>
  ga4.gtag('event', 'outbound_click', {
    event_category: 'Outbound',
    event_label: url,
    link_text: linkText,
  })
