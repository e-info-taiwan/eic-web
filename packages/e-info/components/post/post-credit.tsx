import Link from 'next/link'
import styled, { css } from 'styled-components'

import type { Author } from '~/graphql/fragments/author'
import type { PostDetail } from '~/graphql/query/post'
import * as gtag from '~/utils/gtag'

import DonateBtnOval from '../../components/shared/donate-btn-oval'
import MediaLinkList from '../shared/media-link'

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

  .donate-btn-oval {
    margin-top: 16px;
  }
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
  function renderNames(authors: Author[]) {
    return authors?.map((author) => (
      <span key={author.id}>
        <Link key={author.id} href={`/author/${author.id}`}>
          {author.name}
        </Link>
      </span>
    ))
  }

  const writers = renderNames(
    postData?.manualOrderOfWriters ?? postData?.writers
  )
  const photographers = renderNames(
    postData?.manualOrderOfPhotographers ?? postData?.photographers
  )
  const cameraOperators = renderNames(
    postData?.manualOrderOfCameraOperators ?? postData?.cameraOperators
  )
  const designers = renderNames(
    postData?.manualOrderOfDesigners ?? postData?.designers
  )
  const engineers = renderNames(
    postData?.manualOrderOfEngineers ?? postData?.engineers
  )
  const dataAnalysts = renderNames(
    postData?.manualOrderOfDataAnalysts ?? postData?.dataAnalysts
  )

  const otherWriters = postData?.otherByline

  return (
    <PostCreditWrapper>
      <CreditList>
        {writers?.length > 0 && (
          <li>
            <CreditName>作者—{writers}</CreditName>
          </li>
        )}
        {photographers?.length > 0 && (
          <li>
            <CreditName>攝影—{photographers}</CreditName>
          </li>
        )}
        {cameraOperators?.length > 0 && (
          <li>
            <CreditName>影音—{cameraOperators}</CreditName>
          </li>
        )}
        {designers?.length > 0 && (
          <li>
            <CreditName>設計—{designers}</CreditName>
          </li>
        )}
        {engineers?.length > 0 && (
          <li>
            <CreditName>工程—{engineers}</CreditName>
          </li>
        )}
        {dataAnalysts?.length > 0 && (
          <li>
            <CreditName>資料分析—{dataAnalysts}</CreditName>
          </li>
        )}

        {otherWriters && (
          <li>
            <CreditName>其他作者—{otherWriters}</CreditName>
          </li>
        )}
      </CreditList>

      <SnsLinksDonateBtnWrapper>
        <MediaLinkList />
        <DonateBtnOval
          onClick={() => gtag.sendEvent('post', 'click', 'donate')}
          className="donate-btn-oval"
        />
      </SnsLinksDonateBtnWrapper>
    </PostCreditWrapper>
  )
}
