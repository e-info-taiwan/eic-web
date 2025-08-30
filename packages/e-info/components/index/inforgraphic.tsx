import React from 'react'
import styled from 'styled-components'

// Styled Components
const BackgroundContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.primary['95']};
`

const Container = styled.div`
  margin: 0 auto;
  padding: 0;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px 0;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 48px 60px;
    max-width: 1200px;
  }
`

const Title = styled.h2`
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.primary['20']};
  margin: 0;
  text-align: center;
  padding: 0 40px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 0;
    font-size: 28px;
    line-height: 32px;
    max-width: 680px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 28px;
    line-height: 32px;
    max-width: 680px;
  }
`

const Excerpt = styled.p`
  color: ${({ theme }) => theme.colors.grayscale['20']};
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  padding: 0 40px;
  margin-top: 20px;

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 0;
    font-weight: 500;
    font-size: 18px;
    margin-top: 24px;
    max-width: 680px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 18px;
    margin-top: 52px;
  }
`

const VideoWrapper = styled.div`
  aspect-ratio: 16 / 9;
  width: 100%;
  position: relative;
  padding: 0 60px;
  margin-top: 14px;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  // Tablet
  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    margin-top: 24px;
  }

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    margin-top: 52px;
  }
`

const Inforgraphic = () => {
  return (
    <BackgroundContainer>
      <Container>
        <Title>
          「核電延役免環評」彭啟明也覺奇怪立委呼籲環境部修法......約28字內
        </Title>
        <Excerpt>
          核三將於本周六（17日）停機，立法院在野黨立委挾人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照規定，在「屆期前」都可提出申請、核電廠運轉年限最多再延長20年、已停機
        </Excerpt>
        <VideoWrapper>
          <iframe
            src="https://www.youtube-nocookie.com/embed/IsmGrpJ2F4U?si=S8CyWbYNfX7d4Ase"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </VideoWrapper>
      </Container>
    </BackgroundContainer>
  )
}

export default Inforgraphic
