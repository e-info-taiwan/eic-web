"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = AmpAudioBlockV2;
var _react = _interopRequireDefault(require("react"));
var _utils = require("../../utils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/**
 * After 202310, audio which only contain property `audioSrc`, and property `urlOriginal` is an empty string.
 */
function AmpAudioBlockV2(_ref) {
  var _audio$file, _audio$file2;
  var audio = _ref.audio;
  var audioSrcType = (0, _utils.extractFileExtension)(audio === null || audio === void 0 ? void 0 : audio.audioSrc);
  var fileUrlType = (0, _utils.extractFileExtension)(audio === null || audio === void 0 || (_audio$file = audio.file) === null || _audio$file === void 0 ? void 0 : _audio$file.url);
  return /*#__PURE__*/_react["default"].createElement("amp-audio", {
    width: "50vw",
    height: "54"
  }, audioSrcType && /*#__PURE__*/_react["default"].createElement("source", {
    type: "audio/".concat(audioSrcType),
    src: audio === null || audio === void 0 ? void 0 : audio.audioSrc
  }), fileUrlType && /*#__PURE__*/_react["default"].createElement("source", {
    type: "audio/".concat(fileUrlType),
    src: audio === null || audio === void 0 || (_audio$file2 = audio.file) === null || _audio$file2 === void 0 ? void 0 : _audio$file2.url
  }));
}