import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import Link from 'next/link'
import React, { useRef } from 'react'
import Slider from 'react-slick'
import styled from 'styled-components'

import { DEFAULT_POST_IMAGE_PATH } from '~/constants/constant'
import type { HomepagePickCarousel } from '~/graphql/query/section'
import IconNext from '~/public/icons/next.svg'
import IconPrev from '~/public/icons/prev.svg'

type MainCarouselProps = {
  picks: HomepagePickCarousel[]
}

// Note: You'll need to install react-slick and slick-carousel:
// npm install react-slick slick-carousel
// and import the CSS in your main component or index.js:
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// Styled Components
const CarouselContainer = styled.section`
  background-color: #2d3748;
  padding: 0;

  .slick-slider {
    position: relative;
  }

  .slick-list {
    overflow: hidden;
    padding: 0 !important;
  }

  .slick-track {
    display: flex;
    align-items: center;
  }

  .slick-slide {
    // padding: 0 10px;
    transition: all 0.4s ease;

    > div {
      height: 100%;
    }

    &:not(.slick-center) {
      transform: scale(0.9);
      opacity: 0.6;

      .slide-content {
        filter: grayscale(30%);
      }

      .slide-overlay {
        opacity: 0.3;
      }

      .arrow-button {
        visibility: hidden;
      }
    }

    &.slick-center {
      transform: scale(1);
      opacity: 1;
      z-index: 2;

      .slide-content {
        filter: none;
      }

      .slide-overlay {
        opacity: 1;
      }

      @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
        .arrow-button {
          visibility: visible;
        }
      }
    }
  }

  .slick-dots {
    bottom: -50px;

    li {
      margin: 0 5px;

      button {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.4);
        border: none;

        &:before {
          display: none;
        }

        &:hover {
          background-color: rgba(255, 255, 255, 0.7);
        }
      }

      &.slick-active button {
        background-color: white;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        transform: scale(1.3);
      }
    }
  }

  .slick-arrow {
    width: 20px;
    height: 20px;
    z-index: 10;
    border: none;

    @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
      width: 20px;
      height: 20px;
    }

    @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
      width: 40px;
      height: 40px;
    }

    &:before {
      content: '';
      font-size: 12px;
      color: white;

      @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
        font-size: 12px;
      }

      @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
        font-size: 20px;
      }
    }
  }

  .slick-prev {
    left: 16px;

    @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
      left: 50px;
    }
  }

  .slick-next {
    right: 16px;

    @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
      right: 50px;
    }
  }

  @media (max-width: 768px) {
    .slick-slide {
      &:not(.slick-center) {
        // transform: scale(0.5);
        opacity: 0.3;
      }
    }
  }
`

const ArrowButton = styled.button.attrs({ className: 'arrow-button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  cusor: pointer;

  > svg {
    width: 20px;
    height: 20px;

    @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
      width: 40px;
      height: 40px;
    }
  }
`

const Container = styled.div`
  margin: 0 auto;
  padding: 0;
  position: relative;
`

const CarouselSlide = styled.div`
  position: relative;
  outline: none;
  cursor: pointer;
`

const SlideContent = styled.div.attrs({ className: 'slide-content' })`
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  max-width: 880px;
  width: 100%;
`
const ImageWrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;

  & ${ArrowButton}:first-child {
    visibility: visible;
    position: absolute;
    top: calc(50% - 10px);
    left: 16px;
  }

  & ${ArrowButton}:last-child {
    visibility: visible;
    position: absolute;
    top: calc(50% - 10px);
    right: 16px;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    & ${ArrowButton} {
      visibility: hidden;
      display: none;
    }
  }
`
const MainImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  aspect-ratio: attr(width) / attr(height);

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 40px 84px 0;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 80px 0 0;
  }
`

const TitleWrap = styled.div`
  margin: 28px 22px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  max-width: 100vw;

  > ${ArrowButton} {
    display: none;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    margin: 16px 32px 56px 32px;
    > ${ArrowButton} {
      display: block;
    }
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    margin: 16px 0 56px 0;
    max-width: 880px;
  }
`

const MainTitle = styled.h2.attrs({ className: 'slide-title' })`
  text-align: center;
  color: ${({ theme }) => theme.colors.primary[60]};
  font-size: 28px;
  font-weight: 500;
  padding: 0;
  line-height: 32px;
  transition: all 0.4s ease;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 0 22px;
  }
`

// Helper function to get image URL from pick
const getImageUrl = (pick: HomepagePickCarousel): string => {
  // Priority: customImage > post heroImage
  const customImage =
    pick.customImage?.resized?.w1600 || pick.customImage?.resized?.original
  if (customImage) return customImage

  const postImage =
    pick.posts?.heroImage?.resized?.w1600 ||
    pick.posts?.heroImage?.resized?.original
  if (postImage) return postImage

  // Fallback placeholder
  return DEFAULT_POST_IMAGE_PATH
}

// Helper function to get title from pick
const getTitle = (pick: HomepagePickCarousel): string => {
  return pick.customTitle || pick.posts?.title || ''
}

// Helper function to get link URL from pick
const getLinkUrl = (pick: HomepagePickCarousel): string => {
  if (pick.customUrl) return pick.customUrl
  if (pick.posts?.id) return `/node/${pick.posts.id}`
  return '#'
}

const MainCarousel = ({ picks }: MainCarouselProps) => {
  const sliderRef = useRef<Slider | null>(null)
  const next = () => {
    console.log('next', sliderRef)
    sliderRef.current?.slickNext()
  }
  const previous = () => {
    console.log('previous', sliderRef)
    sliderRef.current?.slickPrev()
  }
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0px',
    autoplay: false,
    autoplaySpeed: 4500,
    pauseOnHover: true,
    focusOnSelect: false,
    variableWidth: true,

    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  // Filter picks that have valid posts or custom content
  const validPicks = picks.filter((pick) => pick.posts || pick.customTitle)

  if (validPicks.length === 0) {
    return null
  }

  return (
    <CarouselContainer>
      <Container>
        <Slider ref={sliderRef} {...settings}>
          {validPicks.map((pick) => {
            const imageUrl = getImageUrl(pick)
            const title = getTitle(pick)
            const linkUrl = getLinkUrl(pick)

            return (
              <CarouselSlide key={pick.id}>
                <Link href={linkUrl}>
                  <SlideContent>
                    <ImageWrap>
                      <ArrowButton
                        onClick={(e) => {
                          e.preventDefault()
                          previous()
                        }}
                      >
                        <IconPrev />
                      </ArrowButton>
                      <MainImage src={imageUrl} alt={title} />
                      <ArrowButton
                        onClick={(e) => {
                          e.preventDefault()
                          next()
                        }}
                      >
                        <IconNext />
                      </ArrowButton>
                    </ImageWrap>
                    <TitleWrap>
                      <ArrowButton
                        onClick={(e) => {
                          e.preventDefault()
                          previous()
                        }}
                      >
                        <IconPrev />
                      </ArrowButton>
                      <MainTitle>{title}</MainTitle>
                      <ArrowButton
                        onClick={(e) => {
                          e.preventDefault()
                          next()
                        }}
                      >
                        <IconNext />
                      </ArrowButton>
                    </TitleWrap>
                  </SlideContent>
                </Link>
              </CarouselSlide>
            )
          })}
        </Slider>
      </Container>
    </CarouselContainer>
  )
}

export default MainCarousel
