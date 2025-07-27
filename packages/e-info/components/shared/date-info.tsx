// 該元件用來顯示文章的時間與閱讀所需時間資訊

import styled from 'styled-components'

const Container = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: #388A48;
  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
`


type DateInfoProps = {
  date?: string
}

export default function DateInfo({
  date = '',
}: DateInfoProps): JSX.Element {
  return (
    <Container className="time">
      {date && <time className="date">{date}</time>}
    </Container>
  )
}
