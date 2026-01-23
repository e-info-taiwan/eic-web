import styled, { css, useTheme } from 'styled-components'

import Adsense from '~/components/ad/google-adsense/adsense-ad'
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

const StyledAsense_FT = styled(Adsense)`
  margin-top: 18px;

  ${({ theme }) => theme.breakpoint.xl} {
    margin-top: 0px;
  }
`

type ArticleListsProps = {
  posts?: ArticleCard[]
  AdPageKey: string
  defaultImage?: string
}

export default function ArticleLists({
  posts,
  AdPageKey,
  defaultImage,
}: ArticleListsProps): JSX.Element {
  const theme = useTheme()
  const itemsBeforeAd = posts?.slice(0, 12).map((article) => {
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

  const itemsAfterAd = posts?.slice(12).map((article) => {
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

  const shouldShowAd = Boolean(posts && posts?.length > 12)

  return (
    <>
      <ItemList>{itemsBeforeAd}</ItemList>
      {shouldShowAd && <StyledAsense_FT pageKey={AdPageKey} adKey="FT" />}
      <ItemList>{itemsAfterAd}</ItemList>
    </>
  )
}
