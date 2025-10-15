// 該元件作為文章資訊卡片使用

import type { Breakpoint, Rwd } from '@readr-media/react-image'
import SharedImage from '@readr-media/react-image'
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

const Link = styled.a<StyledProps>`
  display: flex;
  position: relative;
  border-radius: 2px;
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
    ${({ theme }) => theme.breakpoint.md} {
    }
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
  isReport = false,
  shouldReverseInMobile = false,
  shouldHighlightReport = false,
  shouldHideBottomInfos = false,
  shouldNotLazyload = false,
  onClick,
  rwd,
  breakpoint,
}: ArticleListCardProps): JSX.Element {
  const isReportAndShouldHighlight = isReport && shouldHighlightReport

  function clickHander(event: unknown) {
    ;(event as Event).stopPropagation()
    if (typeof onClick === 'function') {
      onClick()
    }
  }

  return (
    <Link
      href={href}
      target="_blank"
      $shouldReverseInMobile={shouldReverseInMobile}
      $shouldHighlightReport={isReportAndShouldHighlight}
      onClick={clickHander}
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
        <div className="summary">
          <p>
            {summary ||
              '核三將於本周六（17日）停機，立法院在野黨立委挾人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照規定，在「屆期前」都可提出申請、核電廠運轉年限最多再延長20年、已停機'}
          </p>
        </div>
        <PostTag
          tags={[
            { id: '1', name: '標籤1' },
            { id: '2', name: '標籤2' },
            { id: '3', name: '標籤3' },
            { id: '4', name: '標籤44' },
            { id: '5', name: '標籤5' },
            { id: '6', name: '標籤6' },
            { id: '7', name: '標籤7' },
            { id: '8', name: '標籤8' },
            { id: '9', name: '標籤9' },
            { id: '10', name: '標籤10' },
          ]}
        />
      </TextWrapper>
    </Link>
  )
}
