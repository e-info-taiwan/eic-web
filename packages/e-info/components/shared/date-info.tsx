// 該元件用來顯示文章的時間與閱讀所需時間資訊

import styled from 'styled-components'

const Container = styled.div`
  font-size: 16px;
  line-height: 1.8;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.grayscale[0]};
`

type DateInfoProps = {
  date?: string
}

export default function DateInfo({ date = '' }: DateInfoProps): JSX.Element {
  if (date === 'Invalid Date') {
    date = '2023/03/28 12:59'
  }

  return (
    <Container className="time">
      {date && <time className="date">{date}</time>}
    </Container>
  )
}
