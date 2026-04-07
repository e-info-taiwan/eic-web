"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoV2Block = VideoV2Block;
var _react = _interopRequireDefault(require("react"));
var _embeddedCodeBlock = require("./embedded-code-block");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function VideoV2Block(entity) {
  var _entity$getData = entity.getData(),
    embedMarkup = _entity$getData.embedMarkup,
    captionHtml = _entity$getData.captionHtml;
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_embeddedCodeBlock.Block, {
    dangerouslySetInnerHTML: {
      __html: embedMarkup
    }
  }), captionHtml && /*#__PURE__*/_react["default"].createElement(_embeddedCodeBlock.Caption, {
    dangerouslySetInnerHTML: {
      __html: captionHtml
    }
  }));
}