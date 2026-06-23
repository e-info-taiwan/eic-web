import styled from 'styled-components'

import { useHeaderData } from '~/contexts/header-context'
import { sendDonationPV } from '~/utils/donation-pv'

// Title + "捐款支持" donation button used on member sub-pages.
// Desktop: button sits to the right of the title (20px gap).
// Mobile: button wraps below the title.
const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  ${({ theme }) => theme.breakpoint.md} {
    flex-direction: row;
    gap: 20px;
  }
`

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[40]};
  margin: 0;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 24px;
  }
`

const DonationButton = styled.a`
  flex-shrink: 0;
  display: inline-block;
  padding: 5.5px 10px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.secondary[0]};
  color: ${({ theme }) => theme.colors.primary[95]};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  text-decoration: none;
  white-space: nowrap;
`

type Props = {
  title: string
  // tracking label for which member page the donation click came from
  clickFrom?: string
  // allows pages to control bottom spacing via styled(MemberPageTitle)
  className?: string
}

export default function MemberPageTitle({
  title,
  clickFrom = 'member',
  className,
}: Props) {
  const { siteConfigs } = useHeaderData()

  // Get donation link from site configs (id: 3) 捐款連結
  const donationLink =
    siteConfigs.find((config) => config.id === '3')?.content || ''

  return (
    <Header className={className}>
      <Title>{title}</Title>
      {donationLink && (
        <DonationButton
          href={donationLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sendDonationPV(clickFrom)}
        >
          捐款支持
        </DonationButton>
      )}
    </Header>
  )
}
