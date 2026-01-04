import { css } from 'styled-components'

export const blockQuoteSpacingBetweenContent = css`
  .public-DraftStyleDefault-block {
    margin-top: 8px;
  }
`
export const textAroundPictureStyle = css`
  max-width: 33.3%;
  > figure {
    margin-bottom: 0;
    width: 150%;
    transform: unset;
  }
  figcaption {
    padding: 0;
  }
`

export const defaultH2Style = css`
  ${({ theme }) => theme.fontSize.lg};
  font-weight: 500;
  line-height: 32px;
  letter-spacing: 0;
  color: #232333;

  ${({ theme }) => theme.breakpoint.md} {
    ${({ theme }) => theme.fontSize.xl};
  }
`

export const defaultUlStyle = css`
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-left: 0.5rem;
`

export const defaultUnorderedListStyle = css`
  letter-spacing: 0.01em;
  text-align: justify;
  color: rgba(0, 9, 40, 0.87);
`

export const defaultOlStyle = css`
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-left: 0.5rem;
`

export const defaultOrderedListStyle = css`
  letter-spacing: 0.01em;
  text-align: justify;
  color: rgba(0, 9, 40, 0.87);
`

export const defaultLinkStyle = css`
  display: inline;
  color: #2d7a4f;
  text-decoration: underline;
  text-underline-offset: 2px;
  letter-spacing: 0.01em;

  &:hover {
    color: #1e5a38;
  }
`

export const defaultBlockQuoteStyle = css`
  position: relative;
  ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.secondary[0]};
  padding: 20px 24px;
  margin: 24px;

  /* Remove default Draft.js paragraph margin inside blockquote */
  .public-DraftStyleDefault-block {
    margin-top: 0;
  }

  /* Top-left corner bracket */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border-top: 4px solid ${({ theme }) => theme.colors.secondary[0]};
    border-left: 4px solid ${({ theme }) => theme.colors.secondary[0]};
  }

  /* Bottom-right corner bracket */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    border-bottom: 4px solid ${({ theme }) => theme.colors.secondary[0]};
    border-right: 4px solid ${({ theme }) => theme.colors.secondary[0]};
  }
`

export const defaultSpacingBetweenContent = css`
  .public-DraftStyleDefault-block {
    margin-top: 32px;
  }
`

export const narrowSpacingBetweenContent = css`
  .public-DraftStyleDefault-block {
    margin-top: 16px;
  }
`

export const noSpacingBetweenContent = css`
  .public-DraftStyleDefault-block {
    margin-top: unset;
  }
`
