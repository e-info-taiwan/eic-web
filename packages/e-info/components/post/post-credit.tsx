import Link from 'next/link'
import styled, { css } from 'styled-components'

import type { Author } from '~/graphql/fragments/author'
import type { PostDetail } from '~/graphql/query/post'

import MediaLinkList from '../shared/media-link'
import PostTag from './tag'

const DotStyle = css`
  content: '';
  position: absolute;
  top: 9px;
  left: 8px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #b2b5be;
`

const LineStyle = css`
  content: '';
  position: absolute;
  top: 11px;
  left: 4px;
  width: 14px;
  height: 1px;
  background-color: #575d71;

  ${({ theme }) => theme.breakpoint.md} {
    left: 5px;
  }
`

const PostCreditWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  padding: 0px 20px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 0;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    margin-top: 0;
    padding: 0;
    max-width: 180px;
  }
`

const SnsLinksDonateBtnWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;

  .donate-btn-oval {
    margin-top: 16px;
  }
`

const TagSection = styled.div`
  margin-top: 20px;
`

const CreditList = styled.ul`
  > li {
    font-size: 14px;
    line-height: 1.5;
    display: flex;
    align-items: flex-start;

    .dataAnalysts,
    .otherWriters {
      min-width: 56px;

      ${({ theme }) => theme.breakpoint.md} {
        min-width: 64px;
      }
    }
  }

  > li + li {
    margin: 4px 0 0;
  }

  ${({ theme }) => theme.breakpoint.md} {
    margin: 0;

    > li {
      font-size: 16px;
    }
  }
`

const CreditName = styled.span`
  position: relative;
  font-weight: 400;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grayscale[40]};

  span {
    position: relative;
  }

  span + span {
    padding: 0 0 0 20px;
  }
  span + span:after {
    ${DotStyle}
    ${({ theme }) => theme.breakpoint.md} {
      top: 11px;
      left: 8px;
    }
  }
`

type PostProps = {
  postData: PostDetail
}

export default function PostCredit({ postData }: PostProps): JSX.Element {
  function renderAuthor(author: Author | null | undefined) {
    if (!author) return null
    return (
      <span key={author.id}>
        <Link href={`/author/${author.id}`}>{author.name}</Link>
      </span>
    )
  }

  // Collect all authors (author1, author2, author3)
  const authors = [
    postData?.author1,
    postData?.author2,
    postData?.author3,
  ].filter(
    (author): author is Author => author !== null && author !== undefined
  )

  const otherWriters = postData?.otherByline

  return (
    <PostCreditWrapper>
      <CreditList>
        {authors.length > 0 && (
          <li>
            <CreditName>
              作者—
              {authors.map((author, index) => (
                <span key={author.id}>
                  {index > 0 && ' '}
                  <Link href={`/author/${author.id}`}>{author.name}</Link>
                </span>
              ))}
            </CreditName>
          </li>
        )}

        {otherWriters && (
          <li>
            <CreditName>其他作者—{otherWriters}</CreditName>
          </li>
        )}
      </CreditList>

      <TagSection>
        <PostTag tags={postData?.tags} />
      </TagSection>

      <SnsLinksDonateBtnWrapper>
        <MediaLinkList />
      </SnsLinksDonateBtnWrapper>
    </PostCreditWrapper>
  )
}
