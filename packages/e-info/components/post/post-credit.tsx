import Link from 'next/link'
import styled from 'styled-components'

import type { Author } from '~/graphql/fragments/author'
import type { PostDetail } from '~/graphql/query/post'

import MediaLinkList from '../shared/media-link'
import PostTag from './tag'

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
  font-weight: 400;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grayscale[40]};
`

const SectionPath = styled.div`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  margin-bottom: 8px;

  a {
    color: ${({ theme }) => theme.colors.grayscale[0]};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`

type PostProps = {
  postData: PostDetail
}

export default function PostCredit({ postData }: PostProps): JSX.Element {
  // Collect all authors (author1, author2, author3)
  const authors = [
    postData?.author1,
    postData?.author2,
    postData?.author3,
  ].filter(
    (author): author is Author => author !== null && author !== undefined
  )

  const otherWriters = postData?.otherByline
  const section = postData?.section
  const category = postData?.category

  // Build section path: section/category
  const sectionPathParts: { name: string; href: string }[] = []
  if (section) {
    sectionPathParts.push({
      name: section.name,
      href: `/section/${section.slug}`,
    })
  }
  if (category) {
    sectionPathParts.push({
      name: category.name,
      href: `/category/${category.slug}`,
    })
  }

  return (
    <PostCreditWrapper>
      {sectionPathParts.length > 0 && (
        <SectionPath>
          {sectionPathParts.map((part, index) => (
            <span key={part.href}>
              {index > 0 && '/'}
              <Link href={part.href}>{part.name}</Link>
            </span>
          ))}
        </SectionPath>
      )}
      <CreditList>
        {authors.length > 0 && (
          <li>
            <CreditName>
              作者—
              {authors.map((author, index) => (
                <span key={author.id}>
                  {index > 0 && '，'}
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
