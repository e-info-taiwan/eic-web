"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfoBoxBlock = InfoBoxBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _sharedStyle = require("../shared-style");
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var infoboxDefaultSpacing = 8;
var InfoBoxRenderWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  background: #f6f6fb;\n  position: relative;\n  padding: 24px 0px;\n  width: calc(100% + 40px);\n  transform: translateX(-20px);\n  ", ";\n\n  ", " {\n    max-width: 560px;\n    transform: none;\n  }\n"])), function (_ref) {
  var theme = _ref.theme;
  return theme.margin["default"];
}, function (_ref2) {
  var theme = _ref2.theme;
  return theme.breakpoint.md;
});
var InfoTitle = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  width: 100%;\n  font-style: normal;\n  font-weight: 700;\n  ", ";\n  line-height: 1.5;\n  letter-spacing: 0.03em;\n  color: #000928;\n  border-left: 8px solid #04295e;\n  padding: 0 32px 0 24px;\n  margin-bottom: ", "px;\n"])), function (_ref3) {
  var theme = _ref3.theme;
  return theme.fontSize.md;
}, infoboxDefaultSpacing);
var InfoContent = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  padding: 0px 32px;\n  font-style: normal;\n  font-weight: 400;\n  ", ";\n  line-height: 1.6;\n  color: rgba(0, 9, 40, 0.87);\n\n  > div > * + * {\n    margin: ", "px 0 0;\n    min-height: 0.01px; //to make margins between paragraphs effective\n  }\n\n  h2 {\n    ", "\n  }\n\n  ul {\n    ", "\n    margin-top: ", "px;\n\n    > li {\n      ", "\n\n      & + li {\n        margin: ", "px 0 0;\n      }\n    }\n  }\n\n  ol {\n    ", "\n    margin-top: ", "px;\n\n    > li {\n      ", "\n\n      & + li {\n        margin: ", "px 0 0;\n      }\n    }\n  }\n\n  a {\n    ", "\n  }\n\n  blockquote {\n    ", "\n  }\n"])), function (_ref4) {
  var theme = _ref4.theme;
  return theme.fontSize.sm;
}, infoboxDefaultSpacing, _sharedStyle.defaultH2Style, _sharedStyle.defaultUlStyle, infoboxDefaultSpacing, _sharedStyle.defaultUnorderedListStyle, infoboxDefaultSpacing / 2, _sharedStyle.defaultOlStyle, infoboxDefaultSpacing, _sharedStyle.defaultOrderedListStyle, infoboxDefaultSpacing / 2, _sharedStyle.defaultLinkStyle, _sharedStyle.defaultBlockQuoteStyle);
function InfoBoxBlock(props) {
  var block = props.block,
    contentState = props.contentState;
  var entityKey = block.getEntityAt(0);
  var entity = contentState.getEntity(entityKey);
  var _entity$getData = entity.getData(),
    title = _entity$getData.title,
    body = _entity$getData.body;
  return /*#__PURE__*/_react["default"].createElement(InfoBoxRenderWrapper, {
    className: "infobox-wrapper"
  }, /*#__PURE__*/_react["default"].createElement(InfoTitle, {
    className: "infobox-title"
  }, title), /*#__PURE__*/_react["default"].createElement(InfoContent, {
    className: "infobox-content"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    dangerouslySetInnerHTML: {
      __html: body
    }
  })));
}