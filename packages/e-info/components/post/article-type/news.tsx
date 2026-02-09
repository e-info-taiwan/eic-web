import SharedImage from '@readr-media/react-image'
import { useState } from 'react'
import styled from 'styled-components'

import Header from '~/components/layout/header/header'
import PostContent from '~/components/post/post-content'
import PostCredit from '~/components/post/post-credit'
import PostDonation from '~/components/post/post-donation'
import PostTitle from '~/components/post/post-title'
import RelatedPosts from '~/components/post/related-post'
import SideIndex from '~/components/post/side-index'
import {
  DEFAULT_NEWS_IMAGE_PATH,
  DEFAULT_POST_IMAGE_PATH,
} from '~/constants/constant'
import { MAX_CONTENT_WIDTH } from '~/constants/layout'
import type { Donation } from '~/graphql/query/donation'
import type { PostDetail } from '~/graphql/query/post'
import useReadingProgress from '~/hooks/useReadingProgress'
import useScrollToEnd from '~/hooks/useScrollToEnd'
import { ValidPostStyle } from '~/types/common'
import * as gtag from '~/utils/gtag'

const NewsContainer = styled.div`
  // padding-top: 72px;

  // ${({ theme }) => theme.breakpoint.sm} {
  //   padding-top: 86px;
  // }
`
const HeroImage = styled.figure`
  width: 100%;
  max-width: ${MAX_CONTENT_WIDTH};
  margin: 0 auto;

  //shared-component of @readr-media/react-image
  .readr-media-react-image {
    max-height: 800px;
  }

  figcaption {
    font-size: 14px;
    line-height: 21px;
    color: #7f8493;
    padding: 0 20px;
    margin: 8px 0 0;

    ${({ theme }) => theme.breakpoint.md} {
      width: 568px;
      padding: 0;
      margin: 0 auto 0;
    }

    ${({ theme }) => theme.breakpoint.xl} {
      width: 1200px;
    }
  }

  ${({ theme }) => theme.breakpoint.lg} {
    margin: 0px auto 0px;
  }
`

const HiddenAnchor = styled.div`
  display: block;
  width: 100%;
  height: 0;
  padding: 0;
  margin: 0;
`

const ContentWrapper = styled.main`
  display: block;
  max-width: ${MAX_CONTENT_WIDTH};
  margin: 0 auto;

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 0 20px;
  }
`

const TitleSection = styled.section`
  width: 100%;
  max-width: 568px;
  margin: 24px auto;

  ${({ theme }) => theme.breakpoint.lg} {
    margin: 60px auto 48px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    max-width: 800px;
    margin: 28px auto 48px;
  }
`

const TwoColumnSection = styled.section`
  display: block;
  padding: 0 20px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 0;
    max-width: 568px;
    margin: 0 auto;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 80px;
    max-width: 1000px;
    margin: 0 auto;
  }
`

const LeftColumn = styled.aside`
  display: block;
  margin-bottom: 24px;

  ${({ theme }) => theme.breakpoint.xl} {
    position: sticky;
    top: 120px;
    align-self: flex-start;
    margin-bottom: 0;
  }
`

const RightColumn = styled.div`
  padding-bottom: 100px;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.grayscale[40]};
  margin: 0 20px 52px;

  ${({ theme }) => theme.breakpoint.md} {
    margin: 0 0 52px;
  }
`

const DonationWrapper = styled.div`
  padding: 0 20px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 0;
  }
`

type PostProps = {
  postData: PostDetail
  donation?: Donation | null
}

export default function News({ postData, donation }: PostProps): JSX.Element {
  const anchorRef = useScrollToEnd(() =>
    gtag.sendEvent('post', 'scroll', 'scroll to end')
  )

  // Track reading progress at 25%, 50%, 75%, 100%
  const readingProgressRef = useReadingProgress({
    articleId: postData?.id,
    articleCategory: postData?.category?.name,
    enabled: Boolean(postData?.id),
  })

  // If style is "editor" (編輯直送), always use default news image regardless of heroImage
  const isEditorStyle = postData?.style === ValidPostStyle.EDITOR
  const shouldShowHeroImage =
    isEditorStyle || Boolean(postData?.heroImage?.resized)
  const isEditorCategory = postData?.category?.slug === 'editorpick'
  // Use news default image for editor style or editor category
  const defaultImage =
    isEditorStyle || isEditorCategory
      ? DEFAULT_NEWS_IMAGE_PATH
      : DEFAULT_POST_IMAGE_PATH
  // For editor style, use default image; otherwise use actual hero image
  const heroImageToUse = isEditorStyle ? null : postData?.heroImage?.resized
  const heroImageWebpToUse = isEditorStyle
    ? null
    : postData?.heroImage?.resizedWebp

  //for Draft Style: side-index-block
  const [currentSideIndex, setCurrentSideIndex] = useState('')

  return (
    <>
      <Header />
      <NewsContainer>
        <article id="post" ref={readingProgressRef}>
          {shouldShowHeroImage && (
            <HeroImage>
              <SharedImage
                images={heroImageToUse}
                imagesWebP={heroImageWebpToUse}
                defaultImage={defaultImage}
                alt={postData?.title}
                priority={true}
              />
              {!isEditorStyle && (
                <figcaption>{postData?.heroCaption}</figcaption>
              )}
            </HeroImage>
          )}

          <ContentWrapper>
            <TitleSection>
              <PostTitle showTitle={true} postData={postData} />
            </TitleSection>

            <TwoColumnSection>
              <LeftColumn>
                <PostCredit postData={postData} />
                <SideIndex
                  rawContentBlock={postData?.content}
                  currentIndex={currentSideIndex}
                  isAside={true}
                />
              </LeftColumn>

              <RightColumn>
                <PostContent
                  postData={postData}
                  articleType={ValidPostStyle.NEWS}
                  currentSideIndex={currentSideIndex}
                  setCurrentSideIndex={setCurrentSideIndex}
                />
                <Divider />
                <DonationWrapper>
                  <PostDonation donation={donation} />
                </DonationWrapper>
                <RelatedPosts relatedPosts={postData?.relatedPosts} />
              </RightColumn>
            </TwoColumnSection>
          </ContentWrapper>
        </article>

        <HiddenAnchor ref={anchorRef} />
      </NewsContainer>
    </>
  )
}
