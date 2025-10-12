"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColorBoxBlock = ColorBoxBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _sharedStyle = require("../shared-style");
var _templateObject;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var colorBoxDefaultSpacing = 32;
var ColorBoxRenderWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  background-color: ", ";\n  padding: 12px 24px;\n  position: relative;\n  color: #000928;\n  ", ";\n\n  > div > * + * {\n    margin: ", "px 0 0;\n    min-height: 0.01px; //to make margins between paragraphs effective\n  }\n\n  h2 {\n    ", "\n  }\n\n  ul {\n    ", "\n    margin-top: ", "px;\n\n    > li {\n      ", "\n\n      & + li {\n        margin: ", "px 0 0;\n      }\n    }\n  }\n\n  ol {\n    ", "\n    margin-top: ", "px;\n\n    > li {\n      ", "\n\n      & + li {\n        margin: ", "px 0 0;\n      }\n    }\n  }\n\n  a {\n    ", "\n  }\n\n  blockquote {\n    ", "\n  }\n\n  ", " {\n    padding: 16px 32px;\n  }\n"])), function (props) {
  return props.color ? props.color : ' #FFFFFF';
}, function (_ref) {
  var theme = _ref.theme;
  return theme.margin["default"];
}, colorBoxDefaultSpacing, _sharedStyle.defaultH2Style, _sharedStyle.defaultUlStyle, colorBoxDefaultSpacing, _sharedStyle.defaultUnorderedListStyle, colorBoxDefaultSpacing / 2, _sharedStyle.defaultOlStyle, colorBoxDefaultSpacing, _sharedStyle.defaultOrderedListStyle, colorBoxDefaultSpacing / 2, _sharedStyle.defaultLinkStyle, _sharedStyle.defaultBlockQuoteStyle, function (_ref2) {
  var theme = _ref2.theme;
  return theme.breakpoint.md;
});
function ColorBoxBlock(props) {
  var block = props.block,
    contentState = props.contentState;
  var entityKey = block.getEntityAt(0);
  var entity = contentState.getEntity(entityKey);
  var _entity$getData = entity.getData(),
    color = _entity$getData.color,
    body = _entity$getData.body;
  return /*#__PURE__*/_react["default"].createElement(ColorBoxRenderWrapper, {
    color: color
  }, /*#__PURE__*/_react["default"].createElement("div", {
    dangerouslySetInnerHTML: {
      __html: body
    }
  }));
}