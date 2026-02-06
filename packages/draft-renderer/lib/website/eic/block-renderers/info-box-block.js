"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfoBoxBlock = InfoBoxBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _sharedStyle = require("../shared-style");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var infoboxDefaultSpacing = 8;
var InfoBoxRenderWrapper = _styledComponents["default"].div.withConfig({
  displayName: "info-box-block__InfoBoxRenderWrapper",
  componentId: "sc-12mxi9r-0"
})(["background:", ";border:1px solid ", ";position:relative;padding:24px 20px;width:100%;", ";", "{padding:24px 32px;}"], function (_ref) {
  var theme = _ref.theme;
  return theme.colors.grayscale[99];
}, function (_ref2) {
  var theme = _ref2.theme;
  return theme.colors.primary[40];
}, function (_ref3) {
  var theme = _ref3.theme;
  return theme.margin["default"];
}, function (_ref4) {
  var theme = _ref4.theme;
  return theme.breakpoint.md;
});
var InfoTitle = _styledComponents["default"].div.withConfig({
  displayName: "info-box-block__InfoTitle",
  componentId: "sc-12mxi9r-1"
})(["width:100%;font-style:normal;font-weight:700;", ";line-height:1.5;letter-spacing:0.03em;color:#2d7a4f;padding:0;margin-bottom:16px;"], function (_ref5) {
  var theme = _ref5.theme;
  return theme.fontSize.lg;
});
var InfoContent = _styledComponents["default"].div.withConfig({
  displayName: "info-box-block__InfoContent",
  componentId: "sc-12mxi9r-2"
})(["padding:0;font-style:normal;font-weight:400;font-size:14px;line-height:1.5;color:", ";> div > * + *{margin:", "px 0 0;min-height:0.01px;}h2{", "}ul{", " margin-top:", "px;> li{", " & + li{margin:", "px 0 0;}}}ol{", " margin-top:", "px;> li{", " & + li{margin:", "px 0 0;}}}a{", "}blockquote{", "}"], function (_ref6) {
  var theme = _ref6.theme;
  return theme.colors.grayscale[40];
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