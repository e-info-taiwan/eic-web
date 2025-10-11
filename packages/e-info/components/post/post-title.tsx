import styled from 'styled-components'

import PostCategory from '~/components/post/post-category'
import type { PostDetail } from '~/graphql/query/post'
import { formatPostDate, formatReadTime } from '~/utils/post'

import DateInfo from '../shared/date-info'

const Title = styled.h1`
  font-size: 28px;
  font-weight: 500;
  line-height: 36px;
  letter-spacing: 0;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  margin: 0 0 16px;
  text-align: center;
  ${({ theme }) => theme.breakpoint.md} {
    font-size: 48px;
    line-height: 1.25;
  }
`

const PostTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 20px;
  max-width: 568px;
  ${({ theme }) => theme.breakpoint.md} {
    padding: 0;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    max-width: none;
    padding: 0;
  }
`

type PostProps = {
  postData: PostDetail
  showTitle: boolean
}

export default function PostTitle({
  postData: { title, categories, publishTime, readingTime },
  showTitle = true,
}: PostProps): JSX.Element {
  const date = formatPostDate(publishTime)
  const readTimeText = formatReadTime(readingTime)

  // const shouldShowCategories = Boolean(categories?.length)

  return (
    <PostTitleWrapper>
      {/* {shouldShowCategories && <PostCategory category={categories} />} */}
      <DateInfo date={date} />
      {showTitle && <Title>{title}</Title>}
    </PostTitleWrapper>
  )
}
