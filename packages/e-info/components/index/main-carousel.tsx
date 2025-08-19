import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import React from 'react'
import Slider from 'react-slick'
import styled from 'styled-components'

import IconNext from '~/public/icons/next.svg'
import IconPrev from '~/public/icons/prev.svg'

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

      //   .slide-title {
      //     font-size: 0.75rem !important;
      //   }
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

const ArrowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

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
  width: 880px;

  @media (min-width: ${({ theme }) => theme.mediaSize.md}px) {
    padding: 40px 84px 0;
  }

  @media (min-width: ${({ theme }) => theme.mediaSize.xl}px) {
    padding: 80px 16px 0;
  }

  @media (max-width: ${({ theme }) => theme.mediaSize.xl - 1}px) {
    width: 100%;
  }
`

const MainImage = styled.img`
  width: 880px;
  height: 100%;
  object-fit: cover;

  @media (max-width: ${({ theme }) => theme.mediaSize.xl - 1}px) {
    width: 100%;
  }
`

const MainTitle = styled.h2.attrs({ className: 'slide-title' })`
  text-align: center;
  color: ${({ theme }) => theme.colors.primary[60]};
  font-size: 28px;
  font-weight: 700;
  margin-top: 16px;
  margin-bottom: 36px;
  padding: 0 22px;
  line-height: 32px;
  transition: all 0.4s ease;

  .slick-center & {
    @media (min-width: 768px) {
      font-size: 1.25rem;
    }

    @media (min-width: 1024px) {
      font-size: 1.75rem;
    }
  }
`

// Sample data
const carouselData = [
  {
    id: 1,
    title: '以沉船視角看見海洋之美——紀錄片《沉睡的水下巨人》',
    mainImage:
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1000&h=600&fit=crop',
  },
  {
    id: 2,
    title: '海洋保護的重要性——珊瑚礁生態系統',
    mainImage:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1000&h=600&fit=crop',
  },
  {
    id: 3,
    title: '深海探索的新發現——未知的海底世界',
    mainImage:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=600&fit=crop',
  },
  {
    id: 4,
    title: '氣候變遷對海洋生態的影響',
    mainImage:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1000&h=600&fit=crop',
  },
  {
    id: 5,
    title: '永續漁業的未來發展',
    mainImage:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1000&h=600&fit=crop',
  },
]

const MainCarousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0px',
    autoplay: true,
    autoplaySpeed: 4500,
    pauseOnHover: true,
    focusOnSelect: true,
    // cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    variableWidth: true,
    nextArrow: (
      <ArrowButton>
        <IconNext />
      </ArrowButton>
    ),
    prevArrow: (
      <ArrowButton>
        <IconPrev />
      </ArrowButton>
    ),
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

  return (
    <CarouselContainer>
      <Container>
        <Slider {...settings}>
          {carouselData.map((slide) => (
            <CarouselSlide key={slide.id}>
              <SlideContent>
                <MainImage src={slide.mainImage} alt={slide.title} />
                <MainTitle>{slide.title}</MainTitle>
              </SlideContent>
            </CarouselSlide>
          ))}
        </Slider>
      </Container>
    </CarouselContainer>
  )
}

export default MainCarousel
