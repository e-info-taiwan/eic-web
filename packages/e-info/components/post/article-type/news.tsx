import SharedImage from '@readr-media/react-image'
import { useState } from 'react'
import styled from 'styled-components'

import Header from '~/components/layout/header/header-demo'
// import HeaderGeneral from '~/components/layout/header/header-general'
import PostContent from '~/components/post/post-content'
import PostCredit from '~/components/post/post-credit'
import PostTitle from '~/components/post/post-title'
import RelatedPosts from '~/components/post/related-post'
import SideIndex from '~/components/post/side-index'
import { DEFAULT_POST_IMAGE_PATH } from '~/constants/constant'
import type { Post } from '~/graphql/fragments/post'
import type { PostDetail } from '~/graphql/query/post'
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
  max-width: 1200px;
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

  ${({ theme }) => theme.breakpoint.xl} {
    display: flex;
    justify-content: center;
    gap: 48px;
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

  ${({ theme }) => theme.breakpoint.xl} {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 148px;
    max-width: 1200px;
    margin: 0 auto;
  }
`

const Aside = styled.aside`
  display: none;

  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    // width: 100%;
    padding-bottom: 250px;
  }
`

type PostProps = {
  postData: PostDetail
  latestPosts: Post[]
}

export default function News({
  postData,
  latestPosts,
}: PostProps): JSX.Element {
  const anchorRef = useScrollToEnd(() =>
    gtag.sendEvent('post', 'scroll', 'scroll to end')
  )

  const shouldShowHeroImage = Boolean(postData?.heroImage?.resized)

  //for Draft Style: side-index-block
  const [currentSideIndex, setCurrentSideIndex] = useState('')

  return (
    <>
      <Header />
      <NewsContainer>
        <article id="post">
          {shouldShowHeroImage && (
            <HeroImage>
              <SharedImage
                images={postData?.heroImage?.resized}
                imagesWebP={postData?.heroImage?.resizedWebp}
                defaultImage={DEFAULT_POST_IMAGE_PATH}
                alt={postData?.title}
                priority={false}
              />
              <figcaption>{postData?.heroCaption}</figcaption>
            </HeroImage>
          )}

          <ContentWrapper>
            <Aside>
              <SideIndex
                rawContentBlock={postData?.content}
                currentIndex={currentSideIndex}
                isAside={true}
              />
            </Aside>
            <main>
              <TitleSection>
                <PostTitle showTitle={true} postData={postData} />
              </TitleSection>

              <TwoColumnSection>
                <PostCredit postData={postData} />

                <div>
                  <PostContent
                    postData={postData}
                    articleType={ValidPostStyle.NEWS}
                    currentSideIndex={currentSideIndex}
                    setCurrentSideIndex={setCurrentSideIndex}
                  />
                  <RelatedPosts
                    relatedPosts={postData?.relatedPosts}
                    latestPosts={latestPosts}
                  />
                </div>
              </TwoColumnSection>
            </main>
            <Aside />
          </ContentWrapper>
        </article>

        <HiddenAnchor ref={anchorRef} />
      </NewsContainer>
    </>
  )
}
