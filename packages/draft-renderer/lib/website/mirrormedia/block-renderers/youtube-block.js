"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YoutubeBlock = YoutubeBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _sharedStyle = require("../shared-style");
var _templateObject, _templateObject2, _templateObject3, _templateObject4;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var YoutubeRenderWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  ", "\n  ", "\n"])), _sharedStyle.defaultMarginTop, _sharedStyle.defaultMarginBottom);
var IframeWrapper = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  position: relative;\n  width: 100%;\n  padding-top: 56.25%;\n  overflow: hidden;\n"])));
var Iframe = _styledComponents["default"].iframe(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  width: 100%;\n  height: 100%;\n"])));
var Caption = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  line-height: 1.43;\n  letter-spacing: 0.4px;\n  font-size: 14px;\n  color: #808080;\n  padding: 15px 15px 0 15px;\n"])));
function YoutubeBlock(entity, contentLayout) {
  var isAmp = contentLayout === 'amp';
  var _entity$getData = entity.getData(),
    youtubeId = _entity$getData.youtubeId,
    description = _entity$getData.description;
  function handleYoutubeId() {
    var urlOrId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    // 使用正規表達式檢查可能的 YouTube ID 格式
    var youtubeIdRegex = /^(?:https?:\/\/(?:www\.)?youtube\.com\/watch\?v=|https?:\/\/youtu.be\/|\/id\/)?([a-zA-Z0-9_-]{11})/i;
    var matches = urlOrId.startsWith('/') ? urlOrId.replace('/', '').match(youtubeIdRegex) : urlOrId.match(youtubeIdRegex);
    if (matches && matches[1]) {
      return matches[1];
    }
    return '';
  }
  var ampYoutubeIframe = youtubeId ? /*#__PURE__*/_react["default"].createElement(IframeWrapper, null, /*#__PURE__*/_react["default"].createElement("amp-youtube", {
    "data-videoid": handleYoutubeId(youtubeId),
    layout: "fill"
  }, /*#__PURE__*/_react["default"].createElement("amp-img", {
    src: "https://i.ytimg.com/vi/".concat(handleYoutubeId(youtubeId), "/hqdefault.jpg"),
    placeholder: true,
    layout: "fill"
  }))) : null;
  var youtubeIframe = youtubeId ? /*#__PURE__*/_react["default"].createElement(IframeWrapper, null, /*#__PURE__*/_react["default"].createElement(Iframe, {
    src: "https://www.youtube.com/embed/".concat(youtubeId),
    loading: "lazy",
    frameBorder: "0",
    allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
    allowFullScreen: true
  })) : null;
  return /*#__PURE__*/_react["default"].createElement(YoutubeRenderWrapper, null, isAmp ? ampYoutubeIframe : youtubeIframe, description && /*#__PURE__*/_react["default"].createElement(Caption, null, description));
}