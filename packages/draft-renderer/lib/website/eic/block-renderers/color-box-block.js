"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColorBoxBlock = ColorBoxBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _sharedStyle = require("../shared-style");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var colorBoxDefaultSpacing = 32;
var ColorBoxRenderWrapper = _styledComponents["default"].div.withConfig({
  displayName: "color-box-block__ColorBoxRenderWrapper",
  componentId: "sc-14t2fsu-0"
})(["background-color:", ";padding:20px 24px;position:relative;color:rgba(0,9,40,0.87);", ";", ";line-height:1.8;", "{padding:24px 32px;}> div > * + *{margin:16px 0 0;min-height:0.01px;}h2{", "}ul{", " margin-top:", "px;> li{", " & + li{margin:", "px 0 0;}}}ol{", " margin-top:", "px;> li{", " & + li{margin:", "px 0 0;}}}a{", "}blockquote{", "}"], function (props) {
  return props.color ? props.color : '#f5f5f5';
}, function (_ref) {
  var theme = _ref.theme;
  return theme.margin["default"];
}, function (_ref2) {
  var theme = _ref2.theme;
  return theme.fontSize.md;
}, function (_ref3) {
  var theme = _ref3.theme;
  return theme.breakpoint.md;
}, _sharedStyle.defaultH2Style, _sharedStyle.defaultUlStyle, colorBoxDefaultSpacing, _sharedStyle.defaultUnorderedListStyle, colorBoxDefaultSpacing / 2, _sharedStyle.defaultOlStyle, colorBoxDefaultSpacing, _sharedStyle.defaultOrderedListStyle, colorBoxDefaultSpacing / 2, _sharedStyle.defaultLinkStyle, _sharedStyle.defaultBlockQuoteStyle);
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