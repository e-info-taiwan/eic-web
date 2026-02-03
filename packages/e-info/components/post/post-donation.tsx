import styled from 'styled-components'

import type { Donation } from '~/graphql/query/donation'

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[95]};
  border-radius: 4px;
  padding: 40px 34px;
  margin-bottom: 48px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 60px;
  }
`

const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.secondary[20]};
  text-align: center;
  margin: 0 0 12px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 24px;
  }
`

const Subtitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.grayscale[20]};
  text-align: center;
  margin: 0 0 24px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
`

const ImageWrapper = styled.div`
  margin-bottom: 24px;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`

const Description = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grayscale[40]};
  text-align: center;
  margin: 0 0 16px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 14px;
  }
`

const DonateButton = styled.a`
  display: block;
  width: fit-content;
  margin: 0 auto;
  padding: 8px 48px;
  background-color: ${({ theme }) => theme.colors.secondary[20]};
  color: white;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  border-radius: 40px;
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
        <DonateButton href={donationUrl} target="_blank" rel="noopener">
          前往捐款
        </DonateButton>
      )}
    </Container>
  )
}
