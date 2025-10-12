import { Eic } from '@eic-web/draft-renderer'
import { useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'

import Adsense from '~/components/ad/google-adsense/adsense-ad'
import SideIndex from '~/components/post/side-index'
import MediaLinkList from '~/components/shared/media-link'
import { PostDetail } from '~/graphql/query/post'
import { ValidPostContentType, ValidPostStyle } from '~/types/common'
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

//重點摘要
const Summary = styled.article`
  padding: 20px 24px;
  border-width: 16px 2px 2px 2px;
  border-style: solid;
  border-color: #0b2163;
  border-radius: 2px;
  ${defaultMarginBottom}

  .title {
    font-size: 14px;
    line-height: 21px;
    color: #0b2163;
    margin-bottom: 4px;
  }

  ${({ theme }) => theme.breakpoint.md} {
    padding: 32px 48px;
  }
`

//內文
const Content = styled.article`
  ${defaultMarginBottom}
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
  margin-bottom: 48px;
  max-width: 600px;
  border-radius: 2px;
  width: calc(100% + 40px);
  transform: translateX(-20px);

  ${({ theme }) => theme.breakpoint.md} {
    width: 100%;
    transform: none;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: 60px;
  }

  .title {
    font-size: 18px;
    font-weight: 700;
    line-height: 27px;
    letter-spacing: 0.03em;
    color: #eee500;
    text-align: center;
    background-color: #0b2163;
    padding: 8px 0;

    ${({ theme }) => theme.breakpoint.md} {
      font-size: 20px;
      line-height: 29px;
    }
  }

  .content {
    background-color: #f5f0ff;
    padding: 12px 24px;

    ${({ theme }) => theme.breakpoint.md} {
      padding: 16px 32px;
    }
  }
`

const StyledAdsense_E1 = styled(Adsense)`
  margin-bottom: 48px;

  ${({ theme }) => theme.breakpoint.sm} {
    margin-bottom: 60px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    transform: translateX(-20px);
  }
`

const StyledAdsense_AT = styled(Adsense)`
  margin: 30px auto;

  ${({ theme }) => theme.breakpoint.xl} {
    transform: translateX(-20px);
  }
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

  // Debug: Log content structure to check image data
  if (typeof window !== 'undefined' && contentToRender) {
    console.log('=== DEBUG: Post Content Structure ===')
    console.log('Post ID:', postData?.id)
    console.log('Full content:', JSON.stringify(contentToRender, null, 2))

    // Find and log image entities
    if (contentToRender.entityMap) {
      Object.entries(contentToRender.entityMap).forEach(
        ([key, entity]: [string, any]) => {
          if (entity.type === 'IMAGE') {
            console.log(
              `Image entity ${key}:`,
              JSON.stringify(entity.data, null, 2)
            )
          }
        }
      )
    }
  }

  const shouldShowSummary = hasContentInRawContentBlock(briefToRender)
  const shouldShowContent = hasContentInRawContentBlock(contentToRender)
  // Note: actionList and citation fields are removed in new API
  const shouldShowActionList = false
  const shouldShowCitation = !!postData?.citations

  //WORKAROUND：
  //when article type is `frame`, and has `summary` or first block of `content` is not an "EMBEDDEDCODE" , `<Container>` requires "padding-top".
  const shouldPaddingTop =
    articleType === ValidPostStyle.FRAME &&
    (shouldShowSummary ||
      (!shouldShowSummary &&
        getFirstBlockEntityType(contentToRender) !== 'EMBEDDEDCODE'))

  const articleRef = useRef<HTMLElement>(null)

  //Draft Style: add IntersectionObserver to detect side-index titles.
  //`BLANK` type: hide side-index-block
  useEffect(() => {
    if (articleType === ValidPostStyle.BLANK) {
      return
    }

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

  // Note: New API uses category (singular) instead of categories (plural)
  const categorySlug = 'breakingnews' // Default since new API structure changed
  const blocksLength = getBlocksCount(contentToRender)

  return (
    <Container shouldPaddingTop={shouldPaddingTop} ref={articleRef}>
      <SideIndex
        rawContentBlock={contentToRender}
        currentIndex={currentSideIndex}
        isAside={false}
      />

      {shouldShowSummary && (
        <Summary>
          <div>
            <p className="title">報導重點摘要</p>
            <DraftRenderer
              rawContentBlock={briefToRender}
              contentType={ValidPostContentType.SUMMARY}
            />
          </div>
        </Summary>
      )}

      {shouldShowContent && (
        <Content>
          <DraftRenderer
            rawContentBlock={contentToRender}
            contentType={ValidPostContentType.NORMAL}
            disabledImageLazyLoad={false}
          />

          {blocksLength > 5 && (
            <>
              <StyledAdsense_AT pageKey={categorySlug} adKey="AT1" />
              <DraftRenderer
                rawContentBlock={copyAndSliceDraftBlock(contentToRender, 5, 10)}
                contentType={ValidPostContentType.NORMAL}
              />
            </>
          )}

          {blocksLength > 10 && (
            <>
              <StyledAdsense_AT pageKey={categorySlug} adKey="AT2" />
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

      <StyledAdsense_E1 pageKey={categorySlug} adKey="E1" />

      <MobileMediaLink />

      {shouldShowCitation && (
        <Citation>
          <p className="title">引用資料</p>
          <div className="content">
            {/* Note: citations is now a string field, not draft-js */}
            <p>{postData?.citations}</p>
          </div>
        </Citation>
      )}
    </Container>
  )
}
