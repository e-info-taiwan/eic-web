import SharedImage from '@readr-media/react-image'
import styled from 'styled-components'

import { DEFAULT_POST_IMAGE_PATH } from '~/constants/constant'
import type { Post } from '~/graphql/fragments/post'
import * as gtag from '~/utils/gtag'
import { getHref } from '~/utils/post'

const Wrapper = styled.div`
  width: 100%;
  max-width: 568px;
  margin: 48px auto 0;

  ${({ theme }) => theme.breakpoint.xl} {
    max-width: none;
  }
`

const Header = styled.h2`
  font-weight: 700;
  font-size: 20px;
  line-height: 1.5;
  color: #000;
  margin-bottom: 24px;
  padding: 0 20px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 24px;
    padding: 0;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 0 20px;

  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 0;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    grid-template-columns: repeat(3, 1fr);
  }
`

const Card = styled.a`
  display: block;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  margin-bottom: 12px;
  background-color: #f0f0f0;
`

const Title = styled.h3`
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;
  color: #000;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
  }
`

type RelatedPostProps = {
  relatedPosts?: Post[]
  latestPosts?: Post[]
}

export default function RelatedPost({
  relatedPosts,
  latestPosts,
}: RelatedPostProps): JSX.Element {
  const renderPostCard = (post: Post, type: 'related' | 'latest') => {
    const href = getHref({
      style: post.style,
      id: post.id,
    })
    const image = post.ogImage?.resized || post.heroImage?.resized

    return (
      <Card
        key={post.id}
        href={href}
        onClick={() =>
          gtag.sendEvent('post', 'click', `post-${type}-${post.title}`)
        }
      >
        <ImageWrapper>
          {image && (
            <SharedImage
              images={image}
              imagesWebP={
                post.ogImage?.resizedWebp || post.heroImage?.resizedWebp
              }
              defaultImage={DEFAULT_POST_IMAGE_PATH}
              alt={post.title}
              priority={false}
              rwd={{
                mobile: '100vw',
                tablet: '50vw',
                desktop: '33vw',
                default: '400px',
              }}
            />
          )}
        </ImageWrapper>
        <Title>{post.title}</Title>
      </Card>
    )
  }

  const hasRelatedPosts = Array.isArray(relatedPosts) && relatedPosts.length > 0
  const hasLatestPosts = Array.isArray(latestPosts) && latestPosts.length > 0

  if (!hasRelatedPosts && !hasLatestPosts) {
    return <></>
  }

  return (
    <>
      {hasRelatedPosts && (
        <Wrapper>
          <Header>相關文章</Header>
          <Grid>
            {relatedPosts.map((post) => renderPostCard(post, 'related'))}
          </Grid>
        </Wrapper>
      )}
      {hasLatestPosts && (
        <Wrapper>
          <Header>最新文章</Header>
          <Grid>
            {latestPosts.map((post) => renderPostCard(post, 'latest'))}
          </Grid>
        </Wrapper>
      )}
    </>
  )
}
