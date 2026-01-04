"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.theme = exports.mediaSize = exports["default"] = void 0;
var mediaSize = exports.mediaSize = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 960,
  xl: 1200,
  xxl: 1400
};
var theme = exports.theme = {
  breakpoint: {
    xs: "@media (min-width: ".concat(mediaSize.xs, "px)"),
    sm: "@media (min-width: ".concat(mediaSize.sm, "px)"),
    md: "@media (min-width: ".concat(mediaSize.md, "px)"),
    lg: "@media (min-width: ".concat(mediaSize.lg, "px)"),
    xl: "@media (min-width: ".concat(mediaSize.xl, "px)"),
    xxl: "@media (min-width: ".concat(mediaSize.xxl, "px)")
  },
  colors: {
    primary: {
      0: '#126020',
      20: '#388A48',
      40: '#5B9D68',
      60: '#8BC890',
      80: '#CFEDD1',
      95: '#F2FCF2',
      100: '#FFFFFF'
    },
    secondary: {
      0: '#B55514',
      20: '#DD8346',
      40: '#E1B596',
      60: '#F1D5C1',
      80: '#FDEADD',
      95: '#FFF9F5',
      100: '#FFFFFF'
    },
    grayscale: {
      0: '#232333',
      20: '#373740',
      40: '#6F6F72',
      60: '#A0A0A2',
      80: '#D3D3D3',
      95: '#EAEAEA',
      99: '#F6F6F6',
      100: '#FFFFFF'
    }
  },
  fontSize: {
    xs: 'font-size: 14px;',
    sm: 'font-size: 16px;',
    md: 'font-size: 18px;',
    lg: 'font-size: 24px;',
    xl: 'font-size: 28px;'
  },
  margin: {
    "default": 'margin: 32px auto;',
    narrow: 'margin: 16px auto;'
  }
};
var _default = exports["default"] = theme;