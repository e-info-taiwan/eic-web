import { RawDraftContentState } from 'draft-js'

// eslint-disable-next-line prettier/prettier
import type { Post } from '../types'
import { hasContentInRawContentBlock, removeEmptyContentBlock } from './common'

const insertRecommendInContentBlock = (
  rawContentBlock: RawDraftContentState,
  insertRecommend: Post[]
) => {
  const relatedPostsEntityMaps = insertRecommend?.map((post: Post) => ({
    data: {
      posts: [
        {
          heroImage: post?.heroImage || {},
          id: post?.id || '',
          name: post?.title || '',
          ogImage: post?.ogImage || null,
          slug: post?.slug || '',
          subtitle: null,
        },
      ],
    },
    type: 'RELATEDPOST',
    mutability: 'IMMUTABLE',
  }))

  const insertRelatedEntities = relatedPostsEntityMaps.reduce(
    (accumulator, current) => {
      // +1000 to increase diversity to avoid `key` duplication
      const entityKey = Number(current?.data?.posts[0].id) + 1000
      return {
        ...accumulator,
        [entityKey]: current,
      }
    },
    {}
  )

  const entityMapWithInsertRecommend = {
    ...rawContentBlock.entityMap,
    ...insertRelatedEntities,
  }

  const relatedPostsBlocks = insertRecommend.map(
    (post: Post, index: number) => {
      // +1000 to increase diversity to avoid `key` duplication
      const entityKey = Number(post.id) + 1000
      return {
        key: `insertRecommend-${index}`,
        data: {},
        text: ' ', //notice: if text: '' will show error
        type: 'atomic',
        depth: 0,
        entityRanges: [{ key: entityKey, length: 1, offset: 0 }],
        inlineStyleRanges: [],
      }
    }
  )

  function insertRecommendBlocks(data: any) {
    let i = 0
    let count = 0

    // B: insert recommends based on related-posts amount
    const paragraphs = data?.filter(
      (item: any) => item?.type === 'unstyled' && item?.text.length
    )

    let divideAmount

    if (relatedPostsBlocks.length) {
      divideAmount =
        Math.round(paragraphs?.length / (relatedPostsBlocks.length + 1)) ||
        (paragraphs?.length ? 1 : 0)
    } else {
      divideAmount = 0
    }

    if (data?.length) {
      while (i < data.length && divideAmount) {
        if (data[i]?.type === 'unstyled' && data[i]?.text.length) {
          count++

          const item = relatedPostsBlocks[count / divideAmount - 1]
          if (count % divideAmount === 0 && item) {
            data.splice(i + 1, 0, item)
          }
        }
        i++
      }
    }

    // A: insert recommends each 5 paragraphs (same as READr 2.0)
    // if (data?.length) {
    //   while (i < data.length) {
    //     if (data[i]?.type === 'unstyled' && data[i]?.text.length) {
    //       count++

    //       const item = relatedPostsBlocks[count / 5 - 1]
    //       if (count % 5 === 0 && item) {
    //         data.splice(i + 1, 0, item)
    //       }
    //     }
    //     i++
    //   }
    // }
    return data
  }

  const contentWithoutEmptyBlock = removeEmptyContentBlock(rawContentBlock)

  const contentWithInsertRecommend: any = {
    blocks: insertRecommendBlocks(contentWithoutEmptyBlock?.blocks),
    entityMap: entityMapWithInsertRecommend,
  }

  return contentWithInsertRecommend
}

const getFirstBlockEntityType = (rawContentBlock: RawDraftContentState) => {
  const contentBlocks = removeEmptyContentBlock(rawContentBlock)

  if (contentBlocks) {
    return contentBlocks?.entityMap[0]?.type
  } else {
    return undefined
  }
}

// Walk blocks in document order, indexing each SIDEINDEX block as the Nth
// occurrence. The renderer (side-index-block.tsx) computes the same Nth index
// from the post-convertFromRaw ContentState — so both sides agree on
// `header-${n}` even though convertFromRaw remaps entityMap keys.
const getSideIndexEntityData = (rawContentBlock: RawDraftContentState) => {
  if (!hasContentInRawContentBlock(rawContentBlock)) {
    return []
  }
  const contentBlocks = removeEmptyContentBlock(rawContentBlock)
  if (!contentBlocks?.blocks || !contentBlocks?.entityMap) {
    return undefined
  }

  const result: Array<{
    title: string
    id: string
    href: string | null
    isActive: boolean
  }> = []

  contentBlocks.blocks.forEach((block) => {
    block.entityRanges?.forEach((range) => {
      const entity = contentBlocks.entityMap[range.key]
      if (!entity || entity.type !== 'SIDEINDEX') return
      const data = entity.data ?? {}
      const sideIndexTitle = data.sideIndexText || data.h2Text || ''
      result.push({
        title: sideIndexTitle,
        id: `header-${result.length}`,
        href: data?.sideIndexUrl || null,
        isActive: false,
      })
    })
  })

  return result
}

export {
  getFirstBlockEntityType,
  getSideIndexEntityData,
  insertRecommendInContentBlock,
}
