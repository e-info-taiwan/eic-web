import styled from 'styled-components'

import type { Attachment } from '~/graphql/query/post'

const AttachmentsWrapper = styled.section`
  margin-bottom: 32px;
  border-top: 1px solid ${({ theme }) => theme.colors.grayscale[40]};
  padding-top: 36px;

  ${({ theme }) => theme.breakpoint.md} {
    padding-top: 52px;
  }
`

const AttachmentsTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[20]};
  margin-bottom: 16px;
`

const AttachmentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const AttachmentItem = styled.li`
  margin-top: 20px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`

const AttachmentLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[0]};
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[20]};
  }

  svg {
    flex-shrink: 0;
  }
`

const EmbedWrapper = styled.div`
  margin-top: 20px;

  iframe {
    max-width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.grayscale[80]};
    border-radius: 4px;
  }
`

const AttachmentName = styled.span`
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[0]};
  display: block;
`

// Download icon SVG
const DownloadIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 12.5L6.25 8.75H8.75V3.75H11.25V8.75H13.75L10 12.5Z"
      fill="currentColor"
    />
    <path d="M15 15H5V13.75H15V15Z" fill="currentColor" />
  </svg>
)

type PostAttachmentsProps = {
  attachments: Attachment[]
}

export default function PostAttachments({
  attachments,
}: PostAttachmentsProps): JSX.Element | null {
  if (!attachments || attachments.length === 0) {
    return null
  }

  return (
    <AttachmentsWrapper>
      <AttachmentsTitle>附件</AttachmentsTitle>
      <AttachmentList>
        {attachments.map((attachment) => (
          <AttachmentItem key={attachment.id}>
            {/* If has file, show download link */}
            {attachment.file?.url && (
              <AttachmentLink
                href={attachment.file.url}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <DownloadIcon />
                {attachment.name || attachment.file.filename}
              </AttachmentLink>
            )}

            {/* If has embedCode, render it */}
            {attachment.embedCode && (
              <>
                <AttachmentName>{attachment.name}</AttachmentName>
                <EmbedWrapper
                  dangerouslySetInnerHTML={{ __html: attachment.embedCode }}
                />
              </>
            )}
          </AttachmentItem>
        ))}
      </AttachmentList>
    </AttachmentsWrapper>
  )
}
