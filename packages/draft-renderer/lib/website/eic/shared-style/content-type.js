"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SummaryStyle = exports.NormalStyle = exports.CitationStyle = void 0;
var _styledComponents = require("styled-components");
var _index = require("./index");
var _templateObject, _templateObject2, _templateObject3;
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var citationLink = "/lib/public/ef41f6b10c7d89510523ebc3163e6fad.png";
var SummaryStyle = exports.SummaryStyle = (0, _styledComponents.css)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  ", ";\n  line-height: 1.6;\n\n  *:not(:first-child) {\n    .public-DraftStyleDefault-block {\n      margin-top: 12px;\n    }\n  }\n\n  .public-DraftStyleDefault-ul,\n  .public-DraftStyleDefault-ol {\n    margin-top: 12px;\n  }\n\n  .public-DraftStyleDefault-unorderedListItem,\n  .public-DraftStyleDefault-orderedListItem {\n    .public-DraftStyleDefault-block {\n      margin-top: 4px;\n    }\n  }\n\n  .public-DraftStyleDefault-blockquote {\n    ", ";\n\n    & + blockquote {\n      ", ";\n    }\n  }\n"])), function (_ref) {
  var theme = _ref.theme;
  return theme.fontSize.sm;
}, _index.defaultBlockQuoteStyle, _index.blockQuoteSpacingBetweenContent);
var NormalStyle = exports.NormalStyle = (0, _styledComponents.css)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  ", ";\n  line-height: 1.8;\n\n  *:not(:first-child) {\n    ", "\n  }\n\n  .public-DraftStyleDefault-unorderedListItem,\n  .public-DraftStyleDefault-orderedListItem {\n    ", ";\n  }\n\n  .public-DraftStyleDefault-ul,\n  .public-DraftStyleDefault-ol {\n    margin-top: 32px;\n  }\n\n  .public-DraftStyleDefault-blockquote {\n    ", ";\n\n    & + blockquote {\n      ", ";\n    }\n  }\n"])), function (_ref2) {
  var theme = _ref2.theme;
  return theme.fontSize.md;
}, _index.defaultSpacingBetweenContent, _index.noSpacingBetweenContent, _index.defaultBlockQuoteStyle, _index.blockQuoteSpacingBetweenContent);
var CitationStyle = exports.CitationStyle = (0, _styledComponents.css)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  ", ";\n  line-height: 1.6;\n\n  *:not(:first-child) {\n    .public-DraftStyleDefault-block {\n      margin-top: 12px;\n    }\n  }\n\n  .public-DraftStyleDefault-unorderedListItem,\n  .public-DraftStyleDefault-orderedListItem {\n    .public-DraftStyleDefault-block {\n      margin-top: 4px;\n    }\n  }\n\n  .public-DraftStyleDefault-ul,\n  .public-DraftStyleDefault-ol {\n    margin-top: 12px;\n  }\n\n  //\u6A94\u6848\u4E0B\u8F09\n  .public-DraftStyleDefault-ul:has(a) {\n    padding: 0;\n\n    .public-DraftStyleDefault-unorderedListItem {\n      list-style-type: none;\n      padding: 8px 0;\n    }\n\n    a {\n      width: 100%;\n      border: none;\n      font-weight: 700;\n      font-size: 16px;\n      line-height: 1.5;\n      color: #04295e;\n      display: inline-block;\n      position: relative;\n      padding-right: 60px;\n\n      &:hover {\n        color: rgba(0, 9, 40, 0.87);\n      }\n\n      &::after {\n        content: '';\n        background-image: url(", ");\n        background-repeat: no-repeat;\n        background-position: center center;\n        background-size: contain;\n        position: absolute;\n        right: 0;\n        top: 50%;\n        width: 24px;\n        height: 24px;\n        transform: translate(0%, -12px);\n      }\n    }\n  }\n\n  .public-DraftStyleDefault-blockquote {\n    width: 100%;\n    color: rgba(0, 9, 40, 0.5);\n    ", ";\n    line-height: 1.6;\n    padding: 0;\n\n    & + blockquote {\n      ", ";\n    }\n\n    & + ul {\n      border-top: 1px solid rgba(0, 9, 40, 0.1);\n      padding-top: 4px;\n\n      ", " {\n        margin-top: 16px;\n      }\n    }\n  }\n"])), function (_ref3) {
  var theme = _ref3.theme;
  return theme.fontSize.sm;
}, citationLink, function (_ref4) {
  var theme = _ref4.theme;
  return theme.fontSize.sm;
}, _index.blockQuoteSpacingBetweenContent, function (_ref5) {
  var theme = _ref5.theme;
  return theme.breakpoint.md;
});