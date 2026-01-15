// 該元件作為文章資訊卡片使用

import type { Breakpoint, Rwd } from '@readr-media/react-image'
import SharedImage from '@readr-media/react-image'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import PostTag from '~/components/post/tag'
import { DEFAULT_POST_IMAGE_PATH } from '~/constants/constant'
import type { ArticleCard } from '~/types/component'

import DateInfo from './date-info'
import ReportLabel from './report-label'

type StyledProps = {
  $shouldReverseInMobile: boolean
  $shouldHighlightReport: boolean
}

const CardContainer = styled.article<StyledProps>`
  display: flex;
  position: relative;
  border-radius: 2px;
  cursor: pointer;
  ${({ theme }) => theme.breakpoint.sm} {
    display: block;
  }

  ${({ $shouldReverseInMobile }) =>
    $shouldReverseInMobile &&
    `
      flex-direction: column;
      justify-content: space-between;
    `}

  ${({ theme, $shouldHighlightReport }) =>
    $shouldHighlightReport &&
    `
      background-color: #f5f0ff;
      padding: 12px 8px 12px 0;
      ${theme.breakpoint.sm} {
        padding: 0 0 12px;
      }
    `}
`

const ImageWrapper = styled.div<StyledProps>`
  display: inline-block;
  align-self: flex-start;
  width: 100%;
  margin: 0 16px 0 0;
  overflow: hidden;
  border-radius: 2px;
  > picture img {
    aspect-ratio: 16 / 10;
  }
`

const TextWrapper = styled.div<Pick<StyledProps, '$shouldHighlightReport'>>`
  .title {
    font-size: 18px;
    line-height: 1.5;
    font-weight: 500;
    text-align: left;
    margin-top: 12px;

    // Display an ellipsis (...) for titles that exceed 4 lines
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .summary {
    margin-top: 24px;
    margin-bottom: 24px;

    p {
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
      letter-spacing: 0;
      color: #373740;
    }
  }

  // custom style for <DateInfo />
  .time {
    font-size: 14px;
    line-height: 1.5;
    font-weight: 400;
    margin-top: 12px;
    color: ${({ theme }) => theme.colors.primary[40]};
  }

  ${({ theme, $shouldHighlightReport }) =>
    $shouldHighlightReport &&
    `
      position: relative;
      padding: 0 0 0 20px;
      ${theme.breakpoint.sm} {
        padding: 0 12px 0 24px;
      }
      &::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 8px;
        background-color: #eee500;
      }
    `}
`

type ArticleListCardProps = Omit<ArticleCard, 'id'> & {
  shouldReverseInMobile?: boolean
  shouldHighlightReport?: boolean
  shouldHideBottomInfos?: boolean
  shouldNotLazyload?: boolean
  onClick?: () => any
  rwd?: Rwd
  breakpoint?: Breakpoint
}

export default function ArticleListCard({
  href = '/',
  title = '',
  summary = '',
  images = {},
  imagesWebP = {},
  date = '',
  tags = [],
  isReport = false,
  shouldReverseInMobile = false,
  shouldHighlightReport = false,
  shouldHideBottomInfos = false,
  shouldNotLazyload = false,
  onClick,
  rwd,
  breakpoint,
}: ArticleListCardProps): JSX.Element {
  const router = useRouter()
  const isReportAndShouldHighlight = isReport && shouldHighlightReport

  function handleClick() {
    if (typeof onClick === 'function') {
      onClick()
    }
    router.push(href)
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <CardContainer
      $shouldReverseInMobile={shouldReverseInMobile}
      $shouldHighlightReport={isReportAndShouldHighlight}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
    >
      <ImageWrapper
        $shouldReverseInMobile={shouldReverseInMobile}
        $shouldHighlightReport={isReportAndShouldHighlight}
      >
        <picture>
          <SharedImage
            images={images}
            imagesWebP={imagesWebP}
            defaultImage={DEFAULT_POST_IMAGE_PATH}
            alt={title}
            priority={shouldNotLazyload}
            rwd={rwd}
            breakpoint={breakpoint}
          />
        </picture>
        {isReport && <ReportLabel />}
      </ImageWrapper>
      <TextWrapper $shouldHighlightReport={isReportAndShouldHighlight}>
        {!shouldHideBottomInfos && <DateInfo date={date} />}
        <div className="title">
          <p>{title}</p>
        </div>
        {summary && (
          <div className="summary">
            <p>{summary}</p>
          </div>
        )}
        {tags.length > 0 && <PostTag tags={tags} />}
      </TextWrapper>
    </CardContainer>
  )
}
