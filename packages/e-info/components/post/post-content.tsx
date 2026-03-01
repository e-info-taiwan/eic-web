import { Eic } from '@eic-web/draft-renderer'
import type { RawDraftContentState } from 'draft-js'
import { useEffect, useMemo, useRef } from 'react'
import styled, { css } from 'styled-components'

import PostAdContent from '~/components/post/post-ad'
import PostAttachments from '~/components/post/post-attachments'
import PostFootnotes, {
  extractFootnotesFromContent,
} from '~/components/post/post-footnotes'
import PostPoll from '~/components/post/post-poll'
import MediaLinkList from '~/components/shared/media-link'
import { PostDetail } from '~/graphql/query/post'
import useOutboundLinkTracking from '~/hooks/useOutboundLinkTracking'
import { ValidPostContentType } from '~/types/common'
import { copyAndSliceDraftBlock, getBlocksCount } from '~/utils/post'

const defaultMarginBottom = css`
  margin-bottom: 32px;
`

type StyleProps = {
  shouldPaddingTop: boolean
}

const MobileMediaLink = styled(MediaLinkList)`
  margin: 0 auto 48px;
  justify-content: center;

  ${({ theme }) => theme.breakpoint.md} {
    display: none;
  }
`

const Container = styled.article<StyleProps>`
  width: 100%;
  max-width: 568px;
  margin: 0 auto;
  padding: ${(props) =>
    props.shouldPaddingTop ? '32px 20px 0px' : '0px 20px'};

  ${({ theme }) => theme.breakpoint.md} {
    padding: ${(props) => (props.shouldPaddingTop ? '32px 0px 0px' : '0px')};
  }

  ${({ theme }) => theme.breakpoint.xl} {
    width: 100%;
    max-width: none;
    margin: 0;
  }
`

//重點摘要（前言）
const Summary = styled.article`
  ${defaultMarginBottom}

  && p,
  && span {
    font-size: 16px !important;
    font-weight: 700 !important;
    line-height: 1.5 !important;
    color: ${({ theme }) => theme.colors.primary[20]} !important;
  }
`

//內文
const Content = styled.article`
  ${defaultMarginBottom}

  /* Add spacing between split DraftRenderer segments */
  > * + * {
    margin-top: 32px;
  }

  /* Timeline styles for embeddedcode */
  .timeline-title {
    color: ${({ theme }) => theme.colors.secondary[0]};
    font-size: 18px;
    line-height: 1.5;
    font-weight: 500;
    margin-bottom: 28px;
  }

  .timeline {
    position: relative;
    padding-left: 40px;
  }

  .timeline-item {
    position: relative;
    padding-bottom: 40px;
    display: grid;
    grid-template-columns: 1fr 200px;
    gap: 30px;

    &:last-child {
      padding-bottom: 0;
    }

    /* Orange dot */
    &::before {
      content: '';
      position: absolute;
      left: -40px;
      top: 0;
      width: 20px;
      height: 20px;
      background-color: ${({ theme }) => theme.colors.secondary[0]};
      border-radius: 50%;
      z-index: 1;
    }

    /* Vertical line */
    &::after {
      content: '';
      position: absolute;
      left: -30px;
      top: 32px;
      bottom: 40px;
      width: 1px;
      background-color: ${({ theme }) => theme.colors.secondary[0]};
    }

    &:last-child::after {
      bottom: 0;
    }
  }

  .timeline-content {
    flex: 1;
  }

  .timeline-date {
    color: ${({ theme }) => theme.colors.secondary[0]};
    font-size: 16px;
    line-height: 1.5;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .timeline-headline {
    color: ${({ theme }) => theme.colors.secondary[0]};
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 12px;
    line-height: 1.5;
  }

  .timeline-body {
    color: ${({ theme }) => theme.colors.grayscale[20]};
    font-size: 15px;
    line-height: 1.8;
  }

  .timeline-image {
    flex-shrink: 0;
    width: 200px;

    img {
      width: 100%;
      height: auto;
    }
  }

  .timeline-image-caption {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.grayscale[20]};
    margin-top: 8px;
    line-height: 1.25;
  }

  /* Responsive */
  @media (max-width: 600px) {
    .timeline-item {
      grid-template-columns: 1fr;
    }

    .timeline-image {
      width: 100%;
      max-width: 300px;
    }
  }
`

//延伸議題
const ActionList = styled.article`
  ${defaultMarginBottom};

  .title {
    font-weight: 700;
    font-size: 24px;
    line-height: 1.5;
    letter-spacing: 0.032em;
    color: #212944;
    margin-bottom: 16px;

    ${({ theme }) => theme.breakpoint.md} {
      font-size: 28px;
    }
  }
`

//引用數據
const Citation = styled.article`
  margin-bottom: 32px;
  border-top: 1px solid ${({ theme }) => theme.colors.grayscale[40]};
  padding-top: 36px;

  ${({ theme }) => theme.breakpoint.md} {
    padding-top: 52px;
  }

  .content {
    padding: 0;
    overflow-wrap: break-word;
    word-break: break-word;

    ul {
      list-style: disc;
      padding-left: 20px;
      margin: 0;

      li {
        font-size: 16px;
        line-height: 1.8;
        color: #000;
        margin-bottom: 8px;

        ${({ theme }) => theme.breakpoint.md} {
          font-size: 18px;
        }
      }
    }

    a {
      color: ${({ theme }) => theme.colors.primary[20]};
      text-decoration: underline;
      border-bottom: none;
      padding-bottom: 0;

      &:hover {
        color: ${({ theme }) => theme.colors.primary[0]};
        border-bottom: none;
      }
    }
  }
`

const CitationTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[20]};
  margin-bottom: 16px;
`

type PostProps = {
  postData: PostDetail
  articleType: string
  currentSideIndex?: string
  setCurrentSideIndex?: (id: string) => void
}

export default function PostContent({
  postData,
  articleType,
  currentSideIndex = '',
  setCurrentSideIndex = () => {},
}: PostProps): JSX.Element {
  const {
    DraftRenderer,
    hasContentInRawContentBlock,
    getFirstBlockEntityType,
  } = Eic

  // Note: contentApiData is array format, not compatible with DraftRenderer
  // Use original content field (Draft.js format)
  const contentToRender = postData?.content
  const briefToRender = postData?.brief
  const isBriefPlainText = typeof briefToRender === 'string'

  const shouldShowSummary = isBriefPlainText
    ? briefToRender.trim().length > 0
    : hasContentInRawContentBlock(briefToRender)
  const shouldShowContent = hasContentInRawContentBlock(contentToRender)
  // Note: actionList and citation fields are removed in new API
  const shouldShowActionList = false
  const shouldShowCitation =
    typeof postData?.citations === 'string'
      ? postData.citations.trim().length > 0
      : hasContentInRawContentBlock(
          postData?.citations as unknown as RawDraftContentState
        )

  // Extract footnotes from content
  const footnotes = useMemo(
    () => extractFootnotesFromContent(contentToRender),
    [contentToRender]
  )
  const shouldShowFootnotes = footnotes.length > 0

  const shouldPaddingTop = false

  const articleRef = useRef<HTMLElement>(null)

  // Track clicks on external links within article content
  useOutboundLinkTracking(articleRef)

  //Draft Style: add IntersectionObserver to detect side-index titles.
  useEffect(() => {
    if (!articleRef.current) {
      return
    }

    const selectorIdBeginWithHeader = '[id^="header"]'
    const targets = [
      ...articleRef.current.querySelectorAll(selectorIdBeginWithHeader),
    ]

    const indexObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (isIntersecting) {
            setCurrentSideIndex(target.id)
          }
        })
      },
      {
        threshold: 1,
        rootMargin: `150px 0px 0px 0px`,
      }
    )
    targets.forEach((element) => {
      indexObserver.observe(element)
    })
    return () => {
      indexObserver.disconnect()
    }
  }, [articleRef, articleType, setCurrentSideIndex])

  const blocksLength = getBlocksCount(contentToRender)

  return (
    <Container shouldPaddingTop={shouldPaddingTop} ref={articleRef}>
      {shouldShowSummary && (
        <Summary>
          {isBriefPlainText ? (
            <p>{briefToRender}</p>
          ) : (
            <DraftRenderer
              rawContentBlock={briefToRender}
              contentType={ValidPostContentType.SUMMARY}
            />
          )}
        </Summary>
      )}

      {shouldShowContent && (
        <Content>
          {blocksLength <= 5 ? (
            // Short content: render all at once
            <DraftRenderer
              rawContentBlock={contentToRender}
              contentType={ValidPostContentType.NORMAL}
              disabledImageLazyLoad={false}
            />
          ) : blocksLength <= 10 ? (
            // Medium content: split at block 5
            <>
              <DraftRenderer
                rawContentBlock={copyAndSliceDraftBlock(contentToRender, 0, 5)}
                contentType={ValidPostContentType.NORMAL}
                disabledImageLazyLoad={false}
              />
              <DraftRenderer
                rawContentBlock={copyAndSliceDraftBlock(contentToRender, 5)}
                contentType={ValidPostContentType.NORMAL}
              />
            </>
          ) : (
            // Long content: split at blocks 5 and 10
            <>
              <DraftRenderer
                rawContentBlock={copyAndSliceDraftBlock(contentToRender, 0, 5)}
                contentType={ValidPostContentType.NORMAL}
                disabledImageLazyLoad={false}
              />
              <DraftRenderer
                rawContentBlock={copyAndSliceDraftBlock(contentToRender, 5, 10)}
                contentType={ValidPostContentType.NORMAL}
              />
              <DraftRenderer
                rawContentBlock={copyAndSliceDraftBlock(contentToRender, 10)}
                contentType={ValidPostContentType.NORMAL}
              />
            </>
          )}
        </Content>
      )}

      {/* Note: actionList is not available in new API */}
      {shouldShowActionList && (
        <ActionList>
          <p className="title">如果你關心這個議題</p>
          {/* actionList content removed */}
        </ActionList>
      )}

      <MobileMediaLink postId={postData?.id} />

      {shouldShowFootnotes && <PostFootnotes footnotes={footnotes} />}

      {shouldShowCitation && (
        <Citation>
          <CitationTitle>參考資料</CitationTitle>
          <div className="content">
            {typeof postData?.citations === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: postData.citations }} />
            ) : (
              <DraftRenderer
                rawContentBlock={
                  postData?.citations as unknown as RawDraftContentState
                }
              />
            )}
          </div>
        </Citation>
      )}

      <PostAdContent ad={postData?.ad} />

      <PostAttachments attachments={postData?.attachments || []} />

      {postData?.poll && <PostPoll poll={postData.poll} postId={postData.id} />}
    </Container>
  )
}
