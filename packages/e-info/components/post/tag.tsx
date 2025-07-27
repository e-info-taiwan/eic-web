import NextLink from 'next/link'
import styled from 'styled-components'

import type { GenericTag } from '~/types/common'
import * as gtag from '~/utils/gtag'

const TagWrapper = styled.ul`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  max-width: 600px;

  > li {
    font-size: 16px;
    line-height: 1.5;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #8BC890;
    color: #8BC890;
    margin: 0 8px 12px 0;

    &:hover {
      color: #7f8493;
    }
  }

  a {
    display: inline-block;
    padding: 8px;
    cursor: pointer;
  }

  ${({ theme }) => theme.breakpoint.md} {
    max-width: 336px;
    padding: 0;
    margin: 0;
  }
`

type PostTag = Pick<GenericTag, 'id' | 'name'>

type TagProps = {
  tags: PostTag[]
}

export default function PostTag({ tags }: TagProps): JSX.Element {
  return (
    <TagWrapper>
      {tags.map((tag) => {
        return (
          <li
            key={tag.id}
            onClick={() => gtag.sendEvent('post', 'click', `post-${tag.name}`)}
          >
            <NextLink href={`/tag/${tag.name}`} target="_blank">
              {tag.name}
            </NextLink>
          </li>
        )
      })}
    </TagWrapper>
  )
}
