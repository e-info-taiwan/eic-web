export type ThemeType = typeof theme

export const mediaSize = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 960,
  xl: 1200,
  xxl: 1400,
}

export const theme = {
  mediaSize,
  breakpoint: {
    xs: `@media (min-width: ${mediaSize.xs}px)`,
    sm: `@media (min-width: ${mediaSize.sm}px)`,
    md: `@media (min-width: ${mediaSize.md}px)`,
    lg: `@media (min-width: ${mediaSize.lg}px)`,
    xl: `@media (min-width: ${mediaSize.xl}px)`,
    xxl: `@media (min-width: ${mediaSize.xxl}px)`,
  },
  colors: {
    primary: {
      0: '#126020',
      20: '#388A48',
      40: '#5B9D68',
      60: '#8BC890',
      80: '#CFEDD1',
      95: '#F2FCF2',
      100: '#FFFFFF',
    },
    secondary: {
      0: '#B55514',
      20: '#DD8346',
      40: '#E1B596',
      60: '#F1D5C1',
      80: '#FDEADD',
      95: '#FFF9F5',
      100: '#FFFFFF',
    },
    grayscale: {
      0: '#232333',
      20: '#373740',
      40: '#6F6F72',
      60: '#A0A0A2',
      80: '#D3D3D3',
      95: '#EAEAEA',
      99: '#F6F6F6',
      100: '#FFFFFF',
    },
    error: {
      d: '#E73F1B',
      a: '#C02200',
      n: '#FFC4B8',
    },
  },
  width: {
    // 全站
    main: '1096px', // 網頁內容
    // 首頁 - 編輯精選區塊
    featuredEditorChoiceCard: '720px',
    editorChoiceCard: '296px',
  },
  zIndex: {
    top: 10000,
    articleType: 650, // type: `frame`, `blank`, `scrollablevideo` need to cover `header`
    headerMobile: 550, // legency value, keep it for compatibility
    headerDesktop: 499, // legency value, keep it for compatibility
    maskOfPicture: 10,
  },
}

export default theme
