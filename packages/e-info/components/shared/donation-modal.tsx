import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

import type { LightboxDonation } from '~/graphql/query/donation'

// Modal overlay
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  padding: 20px;
`

// Modal container - dark theme
const ModalContainer = styled.div`
  background-color: #1a2332;
  border-radius: 12px;
  max-width: 248px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 40px 24px;
  position: relative;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 40px 16px;
  }
`

// Close button
const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  padding: 0;
  line-height: 1;

  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`

// Title
const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[60]};
  text-align: center;
  margin: 0 0 9px;
  line-height: 1.5;
`

// Description (subtitle)
const Description = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 1.25;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin: 0 0 24px;
`

// Chart section
const ChartSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
`

const ChartTitle = styled.h3`
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin: 0 0 16px;
`

const ChartImage = styled.img`
  max-width: 100%;
  height: auto;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
`

// CTA button
const CTAButton = styled.a`
  display: block;
  width: 100%;
  padding: 4px 58px;
  background-color: ${({ theme }) => theme.colors.secondary[20]};
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[0]};
  }
`

type DonationModalProps = {
  isOpen: boolean
  onClose: () => void
  donation?: LightboxDonation | null
}

const DonationModal = ({ isOpen, onClose, donation }: DonationModalProps) => {
  const [mounted, setMounted] = useState(false)

  // Ensure we only render portal on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleCTAClick = () => {
    // Close modal when CTA is clicked
    onClose()
  }

  if (!isOpen || !mounted || !donation) return null

  const imageUrl = donation.image?.resized?.w480 || donation.image?.resized?.original

  const modalContent = (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>

        {donation.title && <Title>{donation.title}</Title>}

        {donation.subtitle && <Description>{donation.subtitle}</Description>}

        {(donation.description || imageUrl) && (
          <ChartSection>
            {donation.description && (
              <ChartTitle>{donation.description}</ChartTitle>
            )}
            {imageUrl && (
              <ChartImage src={imageUrl} alt={donation.description || ''} />
            )}
          </ChartSection>
        )}

        {donation.donationUrl && (
          <CTAButton
            href={donation.donationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCTAClick}
          >
            前往捐款
          </CTAButton>
        )}
      </ModalContainer>
    </Overlay>
  )

  return createPortal(modalContent, document.body)
}

export default DonationModal
