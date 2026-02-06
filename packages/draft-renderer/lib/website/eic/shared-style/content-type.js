"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SummaryStyle = exports.NormalStyle = exports.CitationStyle = void 0;
var _styledComponents = require("styled-components");
var _index = require("./index");
var citationLink = "/lib/public/ef41f6b10c7d89510523ebc3163e6fad.png";
var SummaryStyle = exports.SummaryStyle = (0, _styledComponents.css)(["", ";line-height:1.6;*:not(:first-child){.public-DraftStyleDefault-block{margin-top:12px;}}.public-DraftStyleDefault-ul,.public-DraftStyleDefault-ol{margin-top:12px;}.public-DraftStyleDefault-unorderedListItem,.public-DraftStyleDefault-orderedListItem{.public-DraftStyleDefault-block{margin-top:4px;}}.public-DraftStyleDefault-blockquote{", ";& + blockquote{", ";}}"], function (_ref) {
  var theme = _ref.theme;
  return theme.fontSize.sm;
}, _index.defaultBlockQuoteStyle, _index.blockQuoteSpacingBetweenContent);
var NormalStyle = exports.NormalStyle = (0, _styledComponents.css)(["", ";line-height:1.8;*:not(:first-child){", "}.public-DraftStyleDefault-unorderedListItem,.public-DraftStyleDefault-orderedListItem{", ";}.public-DraftStyleDefault-ul,.public-DraftStyleDefault-ol{margin-top:32px;}.public-DraftStyleDefault-blockquote{", ";& + blockquote{", ";}}"], function (_ref2) {
  var theme = _ref2.theme;
  return theme.fontSize.md;
}, _index.defaultSpacingBetweenContent, _index.noSpacingBetweenContent, _index.defaultBlockQuoteStyle, _index.blockQuoteSpacingBetweenContent);
var CitationStyle = exports.CitationStyle = (0, _styledComponents.css)(["", ";line-height:1.6;*:not(:first-child){.public-DraftStyleDefault-block{margin-top:12px;}}.public-DraftStyleDefault-unorderedListItem,.public-DraftStyleDefault-orderedListItem{.public-DraftStyleDefault-block{margin-top:4px;}}.public-DraftStyleDefault-ul,.public-DraftStyleDefault-ol{margin-top:12px;}.public-DraftStyleDefault-ul:has(a){padding:0;.public-DraftStyleDefault-unorderedListItem{list-style-type:none;padding:8px 0;}a{width:100%;border:none;font-weight:700;font-size:16px;line-height:1.5;color:#04295e;display:inline-block;position:relative;padding-right:60px;&:hover{color:rgba(0,9,40,0.87);}&::after{content:'';background-image:url(", ");background-repeat:no-repeat;background-position:center center;background-size:contain;position:absolute;right:0;top:50%;width:24px;height:24px;transform:translate(0%,-12px);}}}.public-DraftStyleDefault-blockquote{width:100%;color:rgba(0,9,40,0.5);", ";line-height:1.6;padding:0;& + blockquote{", ";}& + ul{border-top:1px solid rgba(0,9,40,0.1);padding-top:4px;", "{margin-top:16px;}}}"], function (_ref3) {
  var theme = _ref3.theme;
  return theme.fontSize.sm;
}, citationLink, function (_ref4) {
  var theme = _ref4.theme;
  return theme.fontSize.sm;
}, _index.blockQuoteSpacingBetweenContent, function (_ref5) {
  var theme = _ref5.theme;
  return theme.breakpoint.md;
});