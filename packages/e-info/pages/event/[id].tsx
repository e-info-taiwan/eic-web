// 活動詳細頁面
import type { GetServerSideProps } from 'next'
import type { ReactElement } from 'react'
import styled from 'styled-components'

import LayoutGeneral from '~/components/layout/layout-general'
import type { NextPageWithLayout } from '~/pages/_app'
import { setCacheControl } from '~/utils/common'

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const HeroSection = styled.section`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  margin-bottom: 32px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 40px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: 48px;
  }
`

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const HeroOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    transparent 100%
  );
  padding: 40px 20px 20px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 60px 48px 32px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 80px 78px 40px;
  }
`

const HeroTopText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 8px;
  letter-spacing: 0.5px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
    margin-bottom: 12px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 18px;
  }
`

const HeroTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  line-height: 1.4;
  color: #fff;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 36px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 48px;
  }
`

const ContentWrapper = styled.div`
  padding: 0 20px 60px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 0 48px 80px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 0 78px 100px;
  }
`

const EventHeader = styled.div`
  max-width: 760px;
  margin: 0 auto 48px;
`

const EventTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[0]};
  margin: 0 0 24px;
  text-align: center;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 32px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 36px;
  }
`

const EventMetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 32px;

  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
`

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const MetaLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[0]};

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
`

const MetaValue = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  color: #333;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.grayscale[80]};
  margin: 40px 0;

  ${({ theme }) => theme.breakpoint.md} {
    margin: 48px 0;
  }
`

const EventContent = styled.div`
  max-width: 760px;
  margin: 0 auto;
`

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[0]};
  margin: 0 0 20px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 24px;
    margin: 0 0 24px;
  }
`

const ContentText = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
  }

  p {
    margin: 0 0 1em;
  }

  ul,
  ol {
    margin: 0 0 1em;
    padding-left: 1.5em;
  }

  li {
    margin-bottom: 0.5em;
  }

  strong {
    font-weight: 700;
  }
`

const RegisterButton = styled.a`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.secondary[0]};
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  padding: 12px 40px;
  border-radius: 24px;
  text-decoration: none;
  text-align: center;
  margin-top: 40px;
  transition: background-color 0.2s ease, transform 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[20]};
    transform: translateY(-2px);
  }

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
    padding: 14px 48px;
    border-radius: 28px;
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 48px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 60px;
  }
`

type EventData = {
  id: string
  heroImage: string
  heroTopText: string
  heroTitle: string
  title: string
  date: string
  location: string
  organizer: string
  fee: string
  registrationLink: string
  description: string
  notes: string
}

// Dummy event data
const DUMMY_EVENT: EventData = {
  id: '1',
  heroImage:
    'https://images.unsplash.com/photo-1534889156217-d643df14f14a?w=1600&h=900&fit=crop',
  heroTopText: '免費活動',
  heroTitle: '週日例行賞蝶導覽',
  title: '【台灣蝴蝶保育學會】每周日免費賞蝶導覽',
  date: '2025-00-00-00:00',
  location: '每週集合時間、地點詳見內文與蝶會官網～！',
  organizer: '單位名稱單位名稱單位名稱',
  fee: '免費',
  registrationLink: '#',
  description: `本周六核三廠2號機組除將於本周六（17日）停機，立法院在野黨立委挾人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照規定，在「屆期前」都可提出申請、核電廠運轉年限最多再延長20年、已停機

根據現行《核管法》（核子反應器設施管制法）修法，核電廠運轉執照最長40年，在屆期前5～15年可提出申請再延長20年。

若依照此期限，台電必須在核三2號機停機至少6年後才可提出申請（2031年）。若按核四實質停止建造超過20年、已屆期5年後停機的核一、核二並不符合規定（雖未除役但無法申請延役），台灣目前就無機組可申請延役（換照）。`,
  notes: `根據現行《核管法》（核子反應器設施管制法）修法，核電廠運轉執照最長40年，在屆期前5～15年可提出申請再延長20年。

若依照此期限，台電必須在核三2號機停機至少6年後才可提出申請（2031年）。若按核四實質停止建造超過20年、已屆期5年後停機的核一、核二並不符合規定（雖未除役但無法申請延役），台灣目前就無機組可申請延役（換照）。

核三將於本周六（17日）停機，立法院在野黨立委挾人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照規定，在「屆期前」都可提出申請、核電廠運轉年限最多再延長20年、已停機核三將於本周六（17日）停機，立法院在野黨立委挾人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照規定，在「屆期前」都可提出申請、核電廠運轉年限最多再延長20年、已停機`,
}

type PageProps = {
  event: EventData
}

const EventPage: NextPageWithLayout<PageProps> = ({ event }) => {
  return (
    <PageWrapper>
      <HeroSection>
        <HeroImage src={event.heroImage} alt={event.heroTitle} />
        <HeroOverlay>
          <HeroTopText>{event.heroTopText}</HeroTopText>
          <HeroTitle>{event.heroTitle}</HeroTitle>
        </HeroOverlay>
      </HeroSection>

      <ContentWrapper>
        <EventHeader>
          <EventTitle>{event.title}</EventTitle>

          <EventMetaGrid>
            <MetaItem>
              <MetaLabel>活動日期</MetaLabel>
              <MetaValue>{event.date}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>活動地點</MetaLabel>
              <MetaValue>{event.location}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>主辦單位</MetaLabel>
              <MetaValue>{event.organizer}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>活動費用</MetaLabel>
              <MetaValue>{event.fee}</MetaValue>
            </MetaItem>
          </EventMetaGrid>
        </EventHeader>

        <Divider />

        <EventContent>
          <SectionTitle>活動地點—簡文案</SectionTitle>
          <ContentText>{event.description}</ContentText>

          <Divider />

          <SectionTitle>活動費用—免費</SectionTitle>
          <ContentText>{event.notes}</ContentText>

          <ButtonWrapper>
            <RegisterButton
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              前往活動
            </RegisterButton>
          </ButtonWrapper>
        </EventContent>
      </ContentWrapper>
    </PageWrapper>
  )
}

EventPage.getLayout = function getLayout(page: ReactElement) {
  const { props } = page
  const { event } = props

  return (
    <LayoutGeneral
      title={event.title}
      description={event.description}
      imageUrl={event.heroImage}
    >
      {page}
    </LayoutGeneral>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  params,
  res,
}) => {
  setCacheControl(res)

  const id = params?.id as string

  // TODO: Fetch real event data from API
  // For now, return dummy data
  return {
    props: {
      event: {
        ...DUMMY_EVENT,
        id,
      },
    },
  }
}

export default EventPage
