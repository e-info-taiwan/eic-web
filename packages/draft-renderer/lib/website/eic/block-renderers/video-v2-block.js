"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoV2Block = VideoV2Block;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _embeddedCodeBlock = require("./embedded-code-block");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var Figure = _styledComponents["default"].figure.withConfig({
  displayName: "video-v2-block__Figure",
  componentId: "sc-as4s45-0"
})(["width:100%;", ";", "{margin:0;}"], function (_ref) {
  var theme = _ref.theme;
  return theme.margin["default"];
}, _embeddedCodeBlock.Block);
var FigureCaption = _styledComponents["default"].figcaption.withConfig({
  displayName: "video-v2-block__FigureCaption",
  componentId: "sc-as4s45-1"
})(["width:100%;font-size:12px;line-height:1.25;text-align:justify;color:", ";padding:0;margin:8px 0 0;", "{line-height:1.25;}a{color:", ";text-decoration:underline;}"], function (_ref2) {
  var theme = _ref2.theme;
  return theme.colors.grayscale[20];
}, function (_ref3) {
  var theme = _ref3.theme;
  return theme.breakpoint.xl;
}, function (_ref4) {
  var theme = _ref4.theme;
  return theme.colors.primary[20];
});
function VideoV2Block(entity) {
  var _entity$getData = entity.getData(),
    embedMarkup = _entity$getData.embedMarkup,
    captionHtml = _entity$getData.captionHtml;
  return /*#__PURE__*/_react["default"].createElement(Figure, null, /*#__PURE__*/_react["default"].createElement(_embeddedCodeBlock.Block, {
    dangerouslySetInnerHTML: {
      __html: embedMarkup
    }
  }), captionHtml && /*#__PURE__*/_react["default"].createElement(FigureCaption, {
    dangerouslySetInnerHTML: {
      __html: captionHtml
    }
  }));
}