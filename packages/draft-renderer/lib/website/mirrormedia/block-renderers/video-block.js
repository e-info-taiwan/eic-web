"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoBlock = VideoBlock;
exports.VideoBlockV2 = VideoBlockV2;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _sharedStyle = require("../shared-style");
var _ampVideoBlock = _interopRequireDefault(require("./amp/amp-video-block"));
var _ampVideoBlockV = _interopRequireDefault(require("./amp/amp-video-block-v2"));
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var VideoWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  ", "\n  ", "\n"])), _sharedStyle.defaultMarginTop, _sharedStyle.defaultMarginBottom);
var Video = _styledComponents["default"].video(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  display: block;\n  width: 100%;\n"])));
var Description = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  line-height: 1.43;\n  letter-spacing: 0.4px;\n  font-size: 14px;\n  color: #808080;\n  padding: 15px 15px 0 15px;\n"])));
/**
 * Before 202310, video which contain property `urlOriginal` and not contain property `videoSrc`.
 */
function VideoBlock(entity, contentLayout) {
  var _video$file;
  var isAmp = contentLayout === 'amp';
  var _entity$getData = entity.getData(),
    video = _entity$getData.video;
  if (isAmp) {
    return /*#__PURE__*/_react["default"].createElement(_ampVideoBlock["default"], {
      video: video
    });
  }
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(Video, {
    muted: true,
    autoPlay: true,
    loop: true,
    controls: true
  }, /*#__PURE__*/_react["default"].createElement("source", {
    src: video === null || video === void 0 ? void 0 : video.urlOriginal
  }), /*#__PURE__*/_react["default"].createElement("source", {
    src: video === null || video === void 0 || (_video$file = video.file) === null || _video$file === void 0 ? void 0 : _video$file.url
  })));
}

/**
 * After 202310, video which only contain property `videoSrc`, and property `urlOriginal` is an empty string.
 */
function VideoBlockV2(entity, contentLayout) {
  var _video$file2;
  var isAmp = contentLayout === 'amp';
  var _entity$getData2 = entity.getData(),
    video = _entity$getData2.video,
    desc = _entity$getData2.desc;
  if (isAmp) {
    return /*#__PURE__*/_react["default"].createElement(_ampVideoBlockV["default"], {
      video: video
    });
  }
  return /*#__PURE__*/_react["default"].createElement(VideoWrapper, null, /*#__PURE__*/_react["default"].createElement(Video, {
    muted: true,
    autoPlay: true,
    loop: true,
    controls: true
  }, /*#__PURE__*/_react["default"].createElement("source", {
    src: video === null || video === void 0 ? void 0 : video.videoSrc
  }), /*#__PURE__*/_react["default"].createElement("source", {
    src: video === null || video === void 0 || (_video$file2 = video.file) === null || _video$file2 === void 0 ? void 0 : _video$file2.url
  })), desc && /*#__PURE__*/_react["default"].createElement(Description, null, desc));
}