"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textAroundPictureStyle = exports.noSpacingBetweenContent = exports.narrowSpacingBetweenContent = exports.defaultUnorderedListStyle = exports.defaultUlStyle = exports.defaultSpacingBetweenContent = exports.defaultOrderedListStyle = exports.defaultOlStyle = exports.defaultLinkStyle = exports.defaultH2Style = exports.defaultBlockQuoteStyle = exports.blockQuoteSpacingBetweenContent = void 0;
var _styledComponents = require("styled-components");
var blockQuoteSpacingBetweenContent = exports.blockQuoteSpacingBetweenContent = (0, _styledComponents.css)([".public-DraftStyleDefault-block{margin-top:8px;}"]);
var textAroundPictureStyle = exports.textAroundPictureStyle = (0, _styledComponents.css)(["max-width:33.3%;> figure{margin-bottom:0;width:150%;transform:unset;}figcaption{padding:0;}"]);
var defaultH2Style = exports.defaultH2Style = (0, _styledComponents.css)(["", ";font-weight:500;line-height:32px;letter-spacing:0;color:#232333;", "{", ";}"], function (_ref) {
  var theme = _ref.theme;
  return theme.fontSize.lg;
}, function (_ref2) {
  var theme = _ref2.theme;
  return theme.breakpoint.md;
}, function (_ref3) {
  var theme = _ref3.theme;
  return theme.fontSize.xl;
});
var defaultUlStyle = exports.defaultUlStyle = (0, _styledComponents.css)(["list-style-type:disc;padding-left:1.5rem;margin-left:0.5rem;"]);
var defaultUnorderedListStyle = exports.defaultUnorderedListStyle = (0, _styledComponents.css)(["letter-spacing:0.01em;text-align:justify;color:rgba(0,9,40,0.87);"]);
var defaultOlStyle = exports.defaultOlStyle = (0, _styledComponents.css)(["list-style-type:decimal;padding-left:1.5rem;margin-left:0.5rem;"]);
var defaultOrderedListStyle = exports.defaultOrderedListStyle = (0, _styledComponents.css)(["letter-spacing:0.01em;text-align:justify;color:rgba(0,9,40,0.87);"]);
var defaultLinkStyle = exports.defaultLinkStyle = (0, _styledComponents.css)(["display:inline;color:#2d7a4f;text-decoration:underline;text-underline-offset:2px;letter-spacing:0.01em;&:hover{color:#1e5a38;}"]);
var defaultBlockQuoteStyle = exports.defaultBlockQuoteStyle = (0, _styledComponents.css)(["position:relative;", ";font-weight:700;line-height:1.5;color:", ";padding:20px 24px;margin:24px;.public-DraftStyleDefault-block{margin-top:0;}&::before{content:'';position:absolute;top:0;left:0;width:20px;height:20px;border-top:4px solid ", ";border-left:4px solid ", ";}&::after{content:'';position:absolute;bottom:0;right:0;width:20px;height:20px;border-bottom:4px solid ", ";border-right:4px solid ", ";}"], function (_ref4) {
  var theme = _ref4.theme;
  return theme.fontSize.md;
}, function (_ref5) {
  var theme = _ref5.theme;
  return theme.colors.secondary[0];
}, function (_ref6) {
  var theme = _ref6.theme;
  return theme.colors.secondary[0];
}, function (_ref7) {
  var theme = _ref7.theme;
  return theme.colors.secondary[0];
}, function (_ref8) {
  var theme = _ref8.theme;
  return theme.colors.secondary[0];
}, function (_ref9) {
  var theme = _ref9.theme;
  return theme.colors.secondary[0];
});
var defaultSpacingBetweenContent = exports.defaultSpacingBetweenContent = (0, _styledComponents.css)([".public-DraftStyleDefault-block{margin-top:32px;}"]);
var narrowSpacingBetweenContent = exports.narrowSpacingBetweenContent = (0, _styledComponents.css)([".public-DraftStyleDefault-block{margin-top:16px;}"]);
var noSpacingBetweenContent = exports.noSpacingBetweenContent = (0, _styledComponents.css)([".public-DraftStyleDefault-block{margin-top:unset;}"]);