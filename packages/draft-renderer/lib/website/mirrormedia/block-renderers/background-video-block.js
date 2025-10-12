"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BGVideoBlock = BGVideoBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _utils = require("../utils");
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var BGVideoRenderWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  position: relative;\n  padding: 30px;\n  width: 100%;\n  ", "\n"])), function (_ref) {
  var textBlockAlign = _ref.textBlockAlign;
  if (textBlockAlign === 'left') {
    return "padding-right: 50%;";
  } else if (textBlockAlign === 'right') {
    return "padding-left: 50%;";
  } else if (textBlockAlign === 'bottom') {
    return "padding-top: 50%;";
  }
});
var BGVideoRednerVideo = _styledComponents["default"].video(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  z-index: -1;\n  background-color: black;\n"])));
var BGVideoRenderBody = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  background: rgba(0, 0, 0, 0.5);\n  padding: 4px 20px;\n  margin-bottom: 10px;\n"])));
function BGVideoBlock(props, contentLayout) {
  var _video$file;
  var block = props.block,
    contentState = props.contentState;
  var entityKey = block.getEntityAt(0);
  var entity = contentState.getEntity(entityKey);
  var _entity$getData = entity.getData(),
    textBlockAlign = _entity$getData.textBlockAlign,
    video = _entity$getData.video,
    body = _entity$getData.body;
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(BGVideoRenderWrapper, {
    textBlockAlign: textBlockAlign
  }, /*#__PURE__*/_react["default"].createElement(BGVideoRednerVideo, {
    muted: true,
    autoPlay: true,
    loop: true
  }, /*#__PURE__*/_react["default"].createElement("source", {
    src: video === null || video === void 0 ? void 0 : video.urlOriginal
  }), /*#__PURE__*/_react["default"].createElement("source", {
    src: video === null || video === void 0 || (_video$file = video.file) === null || _video$file === void 0 ? void 0 : _video$file.url
  })), /*#__PURE__*/_react["default"].createElement(BGVideoRenderBody, {
    dangerouslySetInnerHTML: {
      __html: contentLayout === 'amp' ? (0, _utils.convertEmbeddedToAmp)(body) : body
    }
  })));
}