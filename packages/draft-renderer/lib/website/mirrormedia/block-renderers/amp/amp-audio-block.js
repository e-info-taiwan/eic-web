"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = AmpAudioBlock;
var _react = _interopRequireDefault(require("react"));
var _utils = require("../../utils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/**
 * Before 202310, audio which contain property `urlOriginal` and not contain property `audioSrc`.
 */
function AmpAudioBlock(_ref) {
  var _audio$file, _audio$file2;
  var audio = _ref.audio;
  var urlOriginalType = (0, _utils.extractFileExtension)(audio === null || audio === void 0 ? void 0 : audio.urlOriginal);
  var fileUrlType = (0, _utils.extractFileExtension)(audio === null || audio === void 0 || (_audio$file = audio.file) === null || _audio$file === void 0 ? void 0 : _audio$file.url);
  return /*#__PURE__*/_react["default"].createElement("amp-audio", {
    width: "50vw",
    height: "54"
  }, urlOriginalType && /*#__PURE__*/_react["default"].createElement("source", {
    type: "audio/".concat(urlOriginalType),
    src: audio === null || audio === void 0 ? void 0 : audio.urlOriginal
  }), fileUrlType && /*#__PURE__*/_react["default"].createElement("source", {
    type: "audio/".concat(fileUrlType),
    src: audio === null || audio === void 0 || (_audio$file2 = audio.file) === null || _audio$file2 === void 0 ? void 0 : _audio$file2.url
  }));
}