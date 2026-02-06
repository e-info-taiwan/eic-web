import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import IconBack from '~/public/icons/arrow_back.svg'
import IconForward from '~/public/icons/arrow_forward.svg'

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 13px;
  margin-top: 24px;
`

const BackForwardButton = styled.button<{ $isDisabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  background: none;
  border: none;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.3 : 1)};

  > svg {
    width: 25px;
    height: 25px;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    min-width: 40px;
    height: 40px;

    > svg {
      width: 40px;
      height: 40px;
    }
  }
`

const PaginationButton = styled(Link)<{
  $isActive?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 1px solid;
  border-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.grayscale[0] : theme.colors.primary[20]};
  background: #fff;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.grayscale[0] : theme.colors.primary[20]};
  font-size: 10px;
  font-weight: 500;
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 11px;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[20]};
    border-color: ${({ theme }) => theme.colors.primary[20]};
    color: #fff;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    min-width: 36px;
    height: 36px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 18px;
  }
`

const PaginationEllipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  color: ${({ theme }) => theme.colors.primary[20]};
  font-size: 14px;

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    min-width: 48px;
    height: 48px;
    font-size: 16px;
  }
`

function generatePaginationItems(
  currentPage: number,
  totalPages: number
): (number | 'ellipsis')[] {
  const items: (number | 'ellipsis')[] = []

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      items.push(i)
    }
    return items
  }

  // Always show first page
  items.push(1)

  if (currentPage > 3) {
    items.push('ellipsis')
  }

  // Show pages around current page
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  for (let i = start; i <= end; i++) {
    items.push(i)
  }

  if (currentPage < totalPages - 2) {
    items.push('ellipsis')
  }

  // Always show last page
  if (totalPages > 1) {
    items.push(totalPages)
  }

  return items
}

type PaginationProps = {
  currentPage: number
  totalPages: number
  buildPageUrl: (pageNum: number) => string
}

export default function Pagination({
  currentPage,
  totalPages,
  buildPageUrl,
}: PaginationProps) {
  const router = useRouter()

  if (totalPages <= 1) {
    return null
  }

  const paginationItems = generatePaginationItems(currentPage, totalPages)

  return (
    <PaginationWrapper>
      <BackForwardButton
        $isDisabled={currentPage === 1}
        onClick={() => {
          if (currentPage > 1) {
            router.push(buildPageUrl(currentPage - 1))
          }
        }}
      >
        <IconBack />
      </BackForwardButton>

      {paginationItems.map((item, index) =>
        item === 'ellipsis' ? (
          <PaginationEllipsis key={`ellipsis-${index}`}>
            ......
          </PaginationEllipsis>
        ) : (
          <PaginationButton
            key={item}
            href={buildPageUrl(item)}
            $isActive={item === currentPage}
          >
            {String(item).padStart(2, '0')}
          </PaginationButton>
        )
      )}

      <BackForwardButton
        $isDisabled={currentPage === totalPages}
        onClick={() => {
          if (currentPage < totalPages) {
            router.push(buildPageUrl(currentPage + 1))
          }
        }}
      >
        <IconForward />
      </BackForwardButton>
    </PaginationWrapper>
  )
}
