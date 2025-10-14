"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textAroundPictureStyle = exports.noSpacingBetweenContent = exports.narrowSpacingBetweenContent = exports.defaultUnorderedListStyle = exports.defaultUlStyle = exports.defaultSpacingBetweenContent = exports.defaultOrderedListStyle = exports.defaultOlStyle = exports.defaultLinkStyle = exports.defaultH2Style = exports.defaultBlockQuoteStyle = exports.blockQuoteSpacingBetweenContent = void 0;
var _styledComponents = require("styled-components");
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject0, _templateObject1, _templateObject10;
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var blockQuoteSpacingBetweenContent = exports.blockQuoteSpacingBetweenContent = (0, _styledComponents.css)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .public-DraftStyleDefault-block {\n    margin-top: 8px;\n  }\n"])));
var textAroundPictureStyle = exports.textAroundPictureStyle = (0, _styledComponents.css)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  max-width: 33.3%;\n  > figure {\n    margin-bottom: 0;\n    width: 150%;\n    transform: unset;\n  }\n  figcaption {\n    padding: 0;\n  }\n"])));
var defaultH2Style = exports.defaultH2Style = (0, _styledComponents.css)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  ", ";\n  font-weight: 500;\n  line-height: 32px;\n  letter-spacing: 0;\n  color: #000000;\n\n  ", " {\n    ", ";\n  }\n"])), function (_ref) {
  var theme = _ref.theme;
  return theme.fontSize.lg;
}, function (_ref2) {
  var theme = _ref2.theme;
  return theme.breakpoint.md;
}, function (_ref3) {
  var theme = _ref3.theme;
  return theme.fontSize.xl;
});
var defaultUlStyle = exports.defaultUlStyle = (0, _styledComponents.css)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  list-style-type: disc;\n  padding-left: 1.2rem;\n"])));
var defaultUnorderedListStyle = exports.defaultUnorderedListStyle = (0, _styledComponents.css)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  letter-spacing: 0.01em;\n  text-align: justify;\n  color: rgba(0, 9, 40, 0.87);\n"])));
var defaultOlStyle = exports.defaultOlStyle = (0, _styledComponents.css)(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  list-style-type: decimal;\n  padding-left: 1.2rem;\n"])));
var defaultOrderedListStyle = exports.defaultOrderedListStyle = (0, _styledComponents.css)(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  letter-spacing: 0.01em;\n  text-align: justify;\n  color: rgba(0, 9, 40, 0.87);\n"])));
var defaultLinkStyle = exports.defaultLinkStyle = (0, _styledComponents.css)(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n  display: inline;\n  border-bottom: 2px solid #ebf02c;\n  letter-spacing: 0.01em;\n  text-align: justify;\n  color: rgba(0, 9, 40, 0.87);\n  padding-bottom: 2px;\n\n  &:hover {\n    border-bottom: 2px solid #04295e;\n  }\n"])));
var defaultBlockQuoteStyle = exports.defaultBlockQuoteStyle = (0, _styledComponents.css)(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n  ", ";\n  line-height: 1.6;\n  color: rgba(0, 9, 40, 0.66);\n  opacity: 0.87;\n  padding: 0 20px;\n"])), function (_ref4) {
  var theme = _ref4.theme;
  return theme.fontSize.sm;
});
var defaultSpacingBetweenContent = exports.defaultSpacingBetweenContent = (0, _styledComponents.css)(_templateObject0 || (_templateObject0 = _taggedTemplateLiteral(["\n  .public-DraftStyleDefault-block {\n    margin-top: 32px;\n  }\n"])));
var narrowSpacingBetweenContent = exports.narrowSpacingBetweenContent = (0, _styledComponents.css)(_templateObject1 || (_templateObject1 = _taggedTemplateLiteral(["\n  .public-DraftStyleDefault-block {\n    margin-top: 16px;\n  }\n"])));
var noSpacingBetweenContent = exports.noSpacingBetweenContent = (0, _styledComponents.css)(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n  .public-DraftStyleDefault-block {\n    margin-top: unset;\n  }\n"])));