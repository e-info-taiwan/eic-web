import styled, { css, useTheme } from 'styled-components'

import ArticleListCard from '~/components/shared/article-list-card'
import type { ArticleCard } from '~/types/component'
import * as gtag from '~/utils/gtag'

const shareStyle = css`
  width: 100%;
  ${({ theme }) => theme.breakpoint.sm} {
    width: calc((100% - 40px) / 2);
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: calc((100% - 44px) / 2);
  }
`

const Item = styled.li`
  margin: 0 0 16px;
  list-style: none;
  ${({ theme }) => theme.breakpoint.sm} {
    margin: 0 0 47px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 0 0 44px;
  }
  ${shareStyle}
`

const ItemList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`

type ArticleListsProps = {
  posts?: ArticleCard[]
  AdPageKey?: string
  defaultImage?: string
}

export default function ArticleLists({
  posts,
  defaultImage,
}: ArticleListsProps): JSX.Element {
  const theme = useTheme()
  const items = posts?.map((article) => {
    return (
      <Item key={article.id}>
        <ArticleListCard
          {...article}
          isReport={false}
          shouldHighlightReport={false}
          shouldReverseInMobile={true}
          rwd={{
            mobile: '30vw',
            tablet: '50vw',
            default: '256px',
          }}
          breakpoint={{
            mobile: `${theme.mediaSize.sm - 1}px`,
            tablet: `${theme.mediaSize.xl - 1}px`,
          }}
          onClick={() =>
            gtag.sendEvent('listing', 'click', `listing-${article.title}`)
          }
          defaultImage={defaultImage}
        />
      </Item>
    )
  })

  return <ItemList>{items}</ItemList>
}
