"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = AmpVideoBlock;
var _react = _interopRequireDefault(require("react"));
var _utils = require("../../utils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/**
 * Before 202310, video which contain property `urlOriginal` and not contain property `videoSrc`.
 */
function AmpVideoBlock(_ref) {
  var _video$file, _video$file2;
  var video = _ref.video;
  var urlOriginalType = (0, _utils.extractFileExtension)(video === null || video === void 0 ? void 0 : video.urlOriginal);
  var fileUrlType = (0, _utils.extractFileExtension)(video === null || video === void 0 || (_video$file = video.file) === null || _video$file === void 0 ? void 0 : _video$file.url);
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("amp-video", {
    controls: true,
    autoplay: "autoplay",
    loop: "loop",
    layout: "responsive",
    width: "100vw",
    height: "50vw"
  }, urlOriginalType && /*#__PURE__*/_react["default"].createElement("source", {
    src: video === null || video === void 0 ? void 0 : video.urlOriginal,
    type: "video/".concat(urlOriginalType)
  }), fileUrlType && /*#__PURE__*/_react["default"].createElement("source", {
    src: video === null || video === void 0 || (_video$file2 = video.file) === null || _video$file2 === void 0 ? void 0 : _video$file2.url,
    type: "video/".concat(fileUrlType)
  })));
}