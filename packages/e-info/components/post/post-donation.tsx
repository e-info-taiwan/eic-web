import styled from 'styled-components'

import type { Donation } from '~/graphql/query/donation'
import { sendDonationPV } from '~/utils/donation-pv'

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[95]};
  border-radius: 4px;
  padding: 40px 34px;
`

const Title = styled.h3`
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary[20]};
  text-align: center;
  margin: 0 0 12px;
`

const Subtitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  text-align: center;
  margin: 0 0 16px;
`

const ImageWrapper = styled.div`
  margin-bottom: 16px;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`

const Description = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 1.25;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  text-align: center;
  margin: 0 0 16px;
`

const DonateButton = styled.a`
  display: block;
  width: fit-content;
  margin: 0 auto;
  padding: 4px 58px;
  background-color: ${({ theme }) => theme.colors.secondary[20]};
  color: white;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[0]};
  }
`

type PostDonationProps = {
  donation?: Donation | null
}

export default function PostDonation({
  donation,
}: PostDonationProps): JSX.Element | null {
  if (!donation) return null

  const { title, subtitle, description, donationUrl, image } = donation
  const imageUrl = image?.resized?.w800 || image?.resized?.original

  return (
    <Container>
      {title && <Title>{title}</Title>}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {imageUrl && (
        <ImageWrapper>
          <img src={imageUrl} alt={title || 'Donation'} />
        </ImageWrapper>
      )}
      {description && <Description>{description}</Description>}
      {donationUrl && (
        <DonateButton
          href={donationUrl}
          target="_blank"
          rel="noopener"
          onClick={() => sendDonationPV('article_footer')}
        >
          前往捐款
        </DonateButton>
      )}
    </Container>
  )
}
