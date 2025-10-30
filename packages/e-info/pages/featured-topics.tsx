// 深度專題列表頁面
import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'
import styled from 'styled-components'

import LayoutGeneral from '~/components/layout/layout-general'
import type { NextPageWithLayout } from '~/pages/_app'
import { setCacheControl } from '~/utils/common'
import * as gtag from '~/utils/gtag'

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 26px 27px 0;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 28px 98px 0;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 36px 58px 0;
  }
`

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 28px;
  gap: 12px;
  padding-bottom: 24px;
  border-bottom: 4px solid ${({ theme }) => theme.colors.secondary[20]};

  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: 28px;
  }
`

const AccentBar = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary[20]};
  width: 60px;
  height: 20px;
  margin-right: 0.75rem;
  border-bottom-right-radius: 12px;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    width: 80px;
    height: 32px;
  }
`

const Title = styled.h1`
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.secondary[20]};
  margin: 0;

  // Desktop
  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    font-size: 28px;
    line-height: 32px;
  }
`

const FeaturedSection = styled.section`
  margin-bottom: 60px;

  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: 48px;
  }
`

const FeaturedArticle = styled.article`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 40px;

  ${({ theme }) => theme.breakpoint.md} {
    gap: 24px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    grid-template-columns: 680px 1fr;
  }
`

const FeaturedImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background-color: #f0f0f0;
`

const FeaturedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const FeaturedContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const FeaturedTextContent = styled.div``

const FeaturedTitle = styled.h2`
  font-size: 28px;
  font-weight: 500;
  line-height: 32px;
  color: ${({ theme }) => theme.colors.secondary[20]};
  margin: 0 0 12px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary[0]};
  }

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 28px;
    margin-bottom: 16px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 36px;
    line-height: 1.25;
    margin-bottom: 20px;
  }
`

const FeaturedDate = styled.time`
  display: block;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  margin-bottom: 24px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
`

const FeaturedExcerpt = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  margin: 0;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
`

const EnterButton = styled.a`
  display: none;
  align-self: flex-end;
  padding: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary[40]};
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.3s ease;
  margin-top: 20px;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary[0]};
  }

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    display: inline-block;
  }
`

const MobileEnterButton = styled.a`
  display: block;
  text-align: center;
  padding: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary[40]};
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.3s ease;
  margin: 32px auto 0;

  &:hover {
    color: #c96635;
  }

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  padding: 0 33px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 0;
    gap: 24px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
`

const ArticleCard = styled.a`
  display: block;
  text-decoration: none;
  cursor: pointer;

  ${({ theme }) => theme.breakpoint.md} {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 20px;
    align-items: start;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
  }
`

const ArticleImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background-color: #f0f0f0;
  margin-bottom: 12px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 0;
    width: 280px;
    flex-shrink: 0;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    width: 100%;
    margin-bottom: 12px;
  }
`

const ArticleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ArticleContent = styled.div`
  display: flex;
  flex-direction: column;
`

const ArticleDate = styled.time`
  display: block;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #666;
  margin-bottom: 8px;
`

const ArticleTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  color: #000;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const Divider = styled.hr`
  border: none;
  border-top: 2px solid ${({ theme }) => theme.colors.secondary[20]};
  margin: 48px 0;

  ${({ theme }) => theme.breakpoint.xl} {
    margin: 48px 0;
  }
`

// Dummy data types
type FeaturedTopic = {
  id: string
  title: string
  summary: string
  excerpt: string
  href: string
  date: string
  image: string
  isFeatured?: boolean
}

// Dummy featured topics with more detailed content
const DUMMY_TOPICS: FeaturedTopic[] = [
  {
    id: '1',
    title: '在理想中擱淺的鯨豚觀察員',
    summary: '在理想中擱淺的鯨豚觀察員最多18個字...',
    excerpt:
      '核三將於本周六（17日）停機，立法院在野黨立委挾人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照規定，在「屆期前」都可提出申請、核電廠運轉年限最多再延長20年、已停機',
    href: '/topic/1',
    date: '2023/03/28 12:59',
    image:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop',
    isFeatured: true,
  },
  {
    id: '2',
    title: '百萬美金打造海廢初號機 犀牛盾要「在沿岸建造掃地機器人」',
    summary: '',
    excerpt: '',
    href: '/topic/2',
    date: '2023/03/28 12:59',
    image:
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=500&fit=crop',
  },
  {
    id: '3',
    title: '百萬美金打造海廢初號機 犀牛盾要「在沿岸建造掃地機器人」',
    summary: '',
    excerpt: '',
    href: '/topic/3',
    date: '2023/03/28 12:59',
    image:
      'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=800&h=500&fit=crop',
  },
  {
    id: '4',
    title: '百萬美金打造海廢初號機 犀牛盾要「在沿岸建造掃地機器人」',
    summary: '',
    excerpt: '',
    href: '/topic/4',
    date: '2023/03/28 12:59',
    image:
      'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&h=500&fit=crop',
  },
  {
    id: '5',
    title: '我推的防災生活',
    summary: '我推的防災生活',
    excerpt:
      '核三將於本周六（17日）停機，立法院在野黨立委挾人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照規定，在「屆期前」都可提出申請、核電廠運轉年限最多再延長20年、已停機',
    href: '/topic/5',
    date: '2023/03/28 12:59',
    image:
      'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&h=500&fit=crop',
    isFeatured: true,
  },
  {
    id: '6',
    title: '擱淺118——打開海龜急診室',
    summary: '擱淺118——打開海龜急診室',
    excerpt:
      '核三將於本周六（17日）停機，立法院在野黨立委挾人數優勢，於今（13）日院會表決通過《核管法》修法，放寬核電機組申請換照規定，在「屆期前」都可提出申請、核電廠運轉年限最多再延長20年、已停機',
    href: '/topic/6',
    date: '2023/03/28 12:59',
    image:
      'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800&h=500&fit=crop',
    isFeatured: true,
  },
]

type PageProps = {
  topics: FeaturedTopic[]
}

const FeaturedTopicsPage: NextPageWithLayout<PageProps> = ({ topics }) => {
  // Split topics into featured and regular
  const featuredTopics = topics.filter((topic) => topic.isFeatured)
  const regularTopics = topics.filter((topic) => !topic.isFeatured)

  const renderFeaturedArticle = (topic: FeaturedTopic) => (
    <FeaturedSection key={topic.id}>
      <FeaturedArticle>
        <FeaturedImageWrapper>
          <Link href={topic.href} passHref legacyBehavior>
            <a
              onClick={() =>
                gtag.sendEvent(
                  'featured-topics',
                  'click',
                  `featured-${topic.title}`
                )
              }
            >
              <FeaturedImage src={topic.image} alt={topic.title} />
            </a>
          </Link>
        </FeaturedImageWrapper>

        <FeaturedContent>
          <FeaturedTextContent>
            <Link href={topic.href}>
              <FeaturedTitle>{topic.summary || topic.title}</FeaturedTitle>
            </Link>
            <FeaturedDate>{topic.date}</FeaturedDate>
            {topic.excerpt && (
              <FeaturedExcerpt>{topic.excerpt}</FeaturedExcerpt>
            )}
          </FeaturedTextContent>
          <Link href={topic.href} passHref legacyBehavior>
            <EnterButton
              onClick={() =>
                gtag.sendEvent(
                  'featured-topics',
                  'click',
                  `enter-${topic.title}`
                )
              }
            >
              進入專題
            </EnterButton>
          </Link>
        </FeaturedContent>
      </FeaturedArticle>

      {/* Show article grid after first featured topic */}
      {topic.id === '1' && regularTopics.length > 0 && (
        <>
          <ArticleGrid>
            {regularTopics.map((regularTopic) => (
              <Link
                key={regularTopic.id}
                href={regularTopic.href}
                passHref
                legacyBehavior
              >
                <ArticleCard
                  onClick={() =>
                    gtag.sendEvent(
                      'featured-topics',
                      'click',
                      `article-${regularTopic.title}`
                    )
                  }
                >
                  <ArticleImageWrapper>
                    <ArticleImage
                      src={regularTopic.image}
                      alt={regularTopic.title}
                    />
                  </ArticleImageWrapper>
                  <ArticleContent>
                    <ArticleDate>{regularTopic.date}</ArticleDate>
                    <ArticleTitle>{regularTopic.title}</ArticleTitle>
                  </ArticleContent>
                </ArticleCard>
              </Link>
            ))}
          </ArticleGrid>
        </>
      )}
      <Link href={topic.href} passHref legacyBehavior>
        <MobileEnterButton
          onClick={() =>
            gtag.sendEvent('featured-topics', 'click', `enter-${topic.title}`)
          }
        >
          進入專題
        </MobileEnterButton>
      </Link>
      <Divider />
    </FeaturedSection>
  )

  return (
    <PageWrapper>
      <SectionTitle>
        <AccentBar />
        <Title>深度專題</Title>
      </SectionTitle>

      {featuredTopics.map((topic) => renderFeaturedArticle(topic))}
    </PageWrapper>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  res,
}) => {
  setCacheControl(res)

  // TODO: Replace with actual API call or JSON data
  const topics = DUMMY_TOPICS

  return {
    props: {
      topics,
    },
  }
}

FeaturedTopicsPage.getLayout = function getLayout(
  page: ReactElement<PageProps>
) {
  return (
    <LayoutGeneral
      title="深度專題"
      description="探討環境、能源、氣候等重要議題的深度報導"
    >
      {page}
    </LayoutGeneral>
  )
}

export default FeaturedTopicsPage
