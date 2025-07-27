// 該元件作為文章資訊卡片使用

import type { Breakpoint, Rwd } from '@readr-media/react-image'
import SharedImage from '@readr-media/react-image'
import NextLink from 'next/link'
import styled from 'styled-components'

import { DEFAULT_POST_IMAGE_PATH } from '~/constants/constant'
import type { ArticleCard } from '~/types/component'
import PostTag from '~/components/post/tag'

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
      flex-direction: row-reverse;
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
  min-width: calc((100% - 16px) * 0.2727);
  max-width: calc((100% - 16px) * 0.2727);
  margin: 0 16px 0 0;
  overflow: hidden;
  border-radius: 2px;
  ${({ theme }) => theme.breakpoint.sm} {
    min-width: unset;
    max-width: unset;
    width: 100%;
    margin: 0 0 12px;
  }

  picture {
    position: relative;
    width: 100%;
    height: 100%;
    &::after {
      content: '';
      width: 100%;
      display: block;
      padding-top: 100%;
      ${({ theme }) => theme.breakpoint.sm} {
        padding-top: 52.5%;
      }
    }

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      background-color: #d8d8d8;
      transition: all 0.3s ease;
      &:hover {
        transform: scale(1.1);
      }
    }
  }

  ${({ theme, $shouldReverseInMobile }) =>
    $shouldReverseInMobile &&
    `
      margin: 0 0 0 16px;
      ${theme.breakpoint.sm} {
        margin: 0 0 12px;
      }
    `}

  ${({ theme, $shouldHighlightReport, $shouldReverseInMobile }) =>
    $shouldHighlightReport &&
    `
      picture {
        margin: 0 8px 0 0;
        ${theme.breakpoint.sm} {
          margin: 0 0 12px;
        }

        ${$shouldReverseInMobile &&
    `
            margin: 0 0 0 8px;
            ${theme.breakpoint.sm} {
              margin: 0 0 12px;
            }
          `
    }
      }
    `}
`

const TextWrapper = styled.div<Pick<StyledProps, '$shouldHighlightReport'>>`
  .title {
    text-align: left;
    margin: 0 0 4px;
    ${({ theme }) => theme.breakpoint.sm} {
      margin: 12px 0 0;
    }
    p {
      display: inline;
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
      letter-spacing: 0.03em;
      color: #232333;
      ${({ theme }) => theme.breakpoint.md} {
        font-size: 18px;
        line-height: 27px;
      }
      &:hover {
        color: #388A48;
        border-bottom: 1.5px solid #388A48;
      }
    }

    // Display an ellipsis (...) for titles that exceed 4 lines
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
  }

  .summary {
    margin-top: 20px;
    margin-bottom: 32px;

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
    font-size: 20px;
    line-height: 28px;
    font-weight: 700;
    ${({ theme }) => theme.breakpoint.md} {
      font-size: 14px;
      line-height: 21px;
      .read {
        padding: 0 0 0 14px;
        &::before {
          top: 9px;
          left: 4px;
        }
      }
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
    ; (event as Event).stopPropagation()
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
        {!shouldHideBottomInfos && (
          <DateInfo date={date} />
        )}
        <div className="title">
          <p>{title}</p>
        </div>
        <div className="summary">
          <p>{summary || '核三將於本周六（17日）停機，立法院在野黨立委挾人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照規定，在「屆期前」都可提出申請、核電廠運轉年限最多再延長20年、已停機'}</p>
        </div>
        <PostTag tags={[
          { id: '1630', name: '微軟' },
          { id: '1629', name: '工程師' },
          { id: '1628', name: '台積電' }
        ]} />
      </TextWrapper>
    </Link>
  )
}
