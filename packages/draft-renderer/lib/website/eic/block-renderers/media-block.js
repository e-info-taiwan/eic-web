"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaBlock = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var styles = {
  media: {
    width: '100%'
  }
};
var Audio = function Audio(props) {
  return /*#__PURE__*/_react["default"].createElement("audio", {
    controls: true,
    src: props.src,
    style: styles.media
  });
};
var Image = function Image(props) {
  return /*#__PURE__*/_react["default"].createElement("img", {
    src: props.src,
    style: styles.media
  });
};
var Video = function Video(props) {
  return /*#__PURE__*/_react["default"].createElement("video", {
    controls: true,
    src: props.src,
    style: styles.media
  });
};
var MediaBlock = exports.MediaBlock = function MediaBlock(entity) {
  var _entity$getData = entity.getData(),
    src = _entity$getData.src;
  var type = entity.getType();
  var media;
  if (type === 'audioLink') {
    media = /*#__PURE__*/_react["default"].createElement(Audio, {
      src: src
    });
  } else if (type === 'imageLink') {
    media = /*#__PURE__*/_react["default"].createElement(Image, {
      src: src
    });
  } else if (type === 'videoLink') {
    media = /*#__PURE__*/_react["default"].createElement(Video, {
      src: src
    });
  }
  return media;
};