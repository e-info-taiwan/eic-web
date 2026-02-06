"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoBlock = VideoBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var Video = _styledComponents["default"].video.withConfig({
  displayName: "video-block__Video",
  componentId: "sc-245v1y-0"
})(["width:100%;", ";background-color:#000;"], function (_ref) {
  var theme = _ref.theme;
  return theme.margin["default"];
});
function VideoBlock(entity) {
  var _video$file;
  var _entity$getData = entity.getData(),
    video = _entity$getData.video;
  return /*#__PURE__*/_react["default"].createElement(Video, {
    muted: true,
    autoPlay: true,
    loop: true,
    controls: true
  }, /*#__PURE__*/_react["default"].createElement("source", {
    src: video === null || video === void 0 ? void 0 : video.url
  }), /*#__PURE__*/_react["default"].createElement("source", {
    src: video === null || video === void 0 || (_video$file = video.file) === null || _video$file === void 0 ? void 0 : _video$file.url
  }));
}