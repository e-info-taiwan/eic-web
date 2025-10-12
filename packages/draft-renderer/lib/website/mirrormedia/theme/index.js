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
  }
};
var _default = exports["default"] = theme;