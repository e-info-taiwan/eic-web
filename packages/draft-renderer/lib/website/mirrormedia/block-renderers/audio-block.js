"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AudioBlock = AudioBlock;
exports.AudioBlockV2 = AudioBlockV2;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _ampAudioBlock = _interopRequireDefault(require("./amp/amp-audio-block"));
var _ampAudioBlockV = _interopRequireDefault(require("./amp/amp-audio-block-v2"));
var _sharedStyle = require("../shared-style");
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var AudioWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  gap: 8px;\n  align-items: start;\n  flex-direction: column;\n  ", "\n  ", "\n  ", " {\n    flex-direction: row;\n    align-items: center;\n    justify-content: space-between;\n    gap: 28px;\n  }\n"])), _sharedStyle.defaultMarginTop, _sharedStyle.defaultMarginBottom, function (_ref) {
  var theme = _ref.theme;
  return theme.breakpoint.md;
});
var AudioName = _styledComponents["default"].p(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  color: #979797;\n  font-size: 14px;\n  line-height: 2;\n  font-weight: 500;\n"])));
var Audio = _styledComponents["default"].audio(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  width: 100%;\n  max-width: 300px;\n"])));
/**
 * Before 202310, audio which contain property `urlOriginal` and not contain property `audioSrc`.
 */
function AudioBlock(entity, contentLayout) {
  var _audio$file;
  var isAmp = contentLayout === 'amp';
  var _entity$getData = entity.getData(),
    audio = _entity$getData.audio;
  var AudioJsx = isAmp ? /*#__PURE__*/_react["default"].createElement(_ampAudioBlock["default"], {
    audio: audio
  }) : /*#__PURE__*/_react["default"].createElement(Audio, {
    controls: true
  }, /*#__PURE__*/_react["default"].createElement("source", {
    src: audio === null || audio === void 0 ? void 0 : audio.urlOriginal
  }), /*#__PURE__*/_react["default"].createElement("source", {
    src: audio === null || audio === void 0 || (_audio$file = audio.file) === null || _audio$file === void 0 ? void 0 : _audio$file.url
  }));
  return /*#__PURE__*/_react["default"].createElement(AudioWrapper, null, /*#__PURE__*/_react["default"].createElement(AudioName, null, audio === null || audio === void 0 ? void 0 : audio.name), AudioJsx);
}

/**
 * After 202310, audio which only contain property `audioSrc`, and property `urlOriginal` is an empty string.
 */
function AudioBlockV2(entity, contentLayout) {
  var _audio$file2;
  var isAmp = contentLayout === 'amp';
  var _entity$getData2 = entity.getData(),
    audio = _entity$getData2.audio;
  var AudioJsx = isAmp ? /*#__PURE__*/_react["default"].createElement(_ampAudioBlockV["default"], {
    audio: audio
  }) : /*#__PURE__*/_react["default"].createElement(Audio, {
    controls: true
  }, /*#__PURE__*/_react["default"].createElement("source", {
    src: audio === null || audio === void 0 ? void 0 : audio.audioSrc
  }), /*#__PURE__*/_react["default"].createElement("source", {
    src: audio === null || audio === void 0 || (_audio$file2 = audio.file) === null || _audio$file2 === void 0 ? void 0 : _audio$file2.url
  }));
  return /*#__PURE__*/_react["default"].createElement(AudioWrapper, null, /*#__PURE__*/_react["default"].createElement(AudioName, null, audio === null || audio === void 0 ? void 0 : audio.name), AudioJsx);
}