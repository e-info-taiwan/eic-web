import NextLink from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { useAuth } from '~/hooks/useAuth'
import {
  addFavorite,
  checkPostFavorited,
  removeFavorite,
} from '~/lib/graphql/member'
import IconBookmark from '~/public/icons/bookmark.svg'
import IconBookmarkFilled from '~/public/icons/bookmark-filled.svg'
import IconFacebook from '~/public/icons/facebook.svg'
import IconLine from '~/public/icons/line.svg'
import IconX from '~/public/icons/x.svg'
import * as gtag from '~/utils/gtag'

const MediaLinkWrapper = styled.ul<{ className: string }>`
  display: flex;
  align-items: center;
  gap: 20px;

  a,
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

const BookmarkButton = styled.button<{ $isActive: boolean }>`
  svg path {
    fill: ${({ $isActive }) => ($isActive ? '#2d7a4f' : 'black')};
  }
`

type ExternalLinkItem = {
  name: string
  href: string
  svgIcon: any
  alt: string
  click: () => void
}

type MediaLinkListProps = {
  className?: string
  postId?: string
}

export default function MediaLinkList({
  className = 'media-link-list',
  postId,
}: MediaLinkListProps): JSX.Element {
  const [href, setHref] = useState('')
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteId, setFavoriteId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { member, firebaseUser } = useAuth()

  useEffect(() => {
    setHref(() => window.location.href)
  }, [])

  // Check if post is already favorited when member and postId are available
  useEffect(() => {
    const checkFavorite = async () => {
      if (member?.id && postId && firebaseUser?.uid) {
        const existingFavoriteId = await checkPostFavorited(
          member.id,
          postId,
          firebaseUser.uid
        )
        if (existingFavoriteId) {
          setIsFavorited(true)
          setFavoriteId(existingFavoriteId)
        } else {
          setIsFavorited(false)
          setFavoriteId(null)
        }
      } else {
        setIsFavorited(false)
        setFavoriteId(null)
      }
    }
    checkFavorite()
  }, [member?.id, postId, firebaseUser?.uid])

  const externalLinks: ExternalLinkItem[] = [
    {
      name: 'Facebook',
      href: `https://www.facebook.com/share.php?u=${href}`,
      svgIcon: IconFacebook,
      alt: '分享至 Facebook',
      click: () => gtag.sendEvent('post', 'click', 'post-share-fb'),
    },
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?url=${href}`,
      svgIcon: IconX,
      alt: '分享至 X',
      click: () => gtag.sendEvent('post', 'click', 'post-share-twitter'),
    },
    {
      name: 'Line',
      href: `https://social-plugins.line.me/lineit/share?url=${href}`,
      svgIcon: IconLine,
      alt: '分享至 LINE',
      click: () => gtag.sendEvent('post', 'click', 'post-share-line'),
    },
  ]

  const handleBookmarkClick = useCallback(async () => {
    gtag.sendEvent('post', 'click', 'post-bookmark')

    // Check if user is logged in
    if (!member) {
      alert('請先登入才能收藏文章')
      return
    }

    // Check if postId is available
    if (!postId) {
      console.error('postId is required for bookmark functionality')
      return
    }

    if (isLoading) return
    setIsLoading(true)

    try {
      if (isFavorited && favoriteId) {
        // Remove from favorites
        const success = await removeFavorite(favoriteId, firebaseUser!.uid)
        if (success) {
          setIsFavorited(false)
          setFavoriteId(null)
        }
      } else {
        // Add to favorites
        const newFavoriteId = await addFavorite(
          member.id,
          postId,
          firebaseUser!.uid
        )
        if (newFavoriteId) {
          setIsFavorited(true)
          setFavoriteId(newFavoriteId)
        }
      }
    } catch (error) {
      console.error('Bookmark operation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [member, firebaseUser, postId, isFavorited, favoriteId, isLoading])

  return (
    <MediaLinkWrapper className={className}>
      <li key="Bookmark">
        <BookmarkButton
          type="button"
          aria-label={isFavorited ? '取消收藏' : '加入收藏'}
          onClick={handleBookmarkClick}
          $isActive={isFavorited}
          disabled={isLoading}
        >
          {isFavorited ? <IconBookmarkFilled /> : <IconBookmark />}
        </BookmarkButton>
      </li>
      {externalLinks.map((item) => {
        return (
          <li key={item.name} aria-label={item.alt} onClick={item.click}>
            <NextLink
              href={item.href}
              target="_blank"
              rel="noopener noreferrer external nofollow"
            >
              <item.svgIcon />
            </NextLink>
          </li>
        )
      })}
    </MediaLinkWrapper>
  )
}
