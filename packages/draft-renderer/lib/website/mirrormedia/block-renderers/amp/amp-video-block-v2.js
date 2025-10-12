"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = AmpVideoBlockV2;
var _react = _interopRequireDefault(require("react"));
var _utils = require("../../utils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/**
 * //After 202310, video which only contain property `videoSrc`, and property `urlOriginal` is an empty string.
 */
function AmpVideoBlockV2(_ref) {
  var _video$file, _video$file2;
  var video = _ref.video;
  var videoSrcType = (0, _utils.extractFileExtension)(video === null || video === void 0 ? void 0 : video.videoSrc);
  var fileUrlType = (0, _utils.extractFileExtension)(video === null || video === void 0 || (_video$file = video.file) === null || _video$file === void 0 ? void 0 : _video$file.url);
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("amp-video", {
    controls: true,
    autoplay: "autoplay",
    loop: "loop",
    layout: "responsive",
    width: "100vw",
    height: "50vw"
  }, videoSrcType && /*#__PURE__*/_react["default"].createElement("source", {
    src: video === null || video === void 0 ? void 0 : video.videoSrc,
    type: "video/".concat(videoSrcType)
  }), fileUrlType && /*#__PURE__*/_react["default"].createElement("source", {
    src: video === null || video === void 0 || (_video$file2 = video.file) === null || _video$file2 === void 0 ? void 0 : _video$file2.url,
    type: "video/".concat(fileUrlType)
  })));
}