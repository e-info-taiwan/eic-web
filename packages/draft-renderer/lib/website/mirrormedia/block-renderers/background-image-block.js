"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BGImageBlock = BGImageBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _utils = require("../utils");
var _templateObject, _templateObject2;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var BGImageRenderWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  padding: 30px;\n  position: relative;\n  width: 100%;\n  height: 100%;\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center center;\n  ", "\n"])), function (_ref) {
  var image = _ref.image;
  return image;
}, function (_ref2) {
  var textBlockAlign = _ref2.textBlockAlign;
  if (textBlockAlign === 'left') {
    return "padding-right: 50%;";
  } else if (textBlockAlign === 'right') {
    return "padding-left: 50%;";
  } else if (textBlockAlign === 'bottom') {
    return "padding-top: 50%;";
  }
});
var BGImageRenderBody = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  background: rgba(0, 0, 0, 0.5);\n  padding: 4px 20px;\n  margin-bottom: 10px;\n"])));
function BGImageBlock(props, contentLayout) {
  var _image$imageFile;
  var block = props.block,
    contentState = props.contentState;
  var entityKey = block.getEntityAt(0);
  var entity = contentState.getEntity(entityKey);
  var _entity$getData = entity.getData(),
    textBlockAlign = _entity$getData.textBlockAlign,
    image = _entity$getData.image,
    body = _entity$getData.body;
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(BGImageRenderWrapper, {
    image: image === null || image === void 0 || (_image$imageFile = image.imageFile) === null || _image$imageFile === void 0 ? void 0 : _image$imageFile.url,
    textBlockAlign: textBlockAlign
  }, /*#__PURE__*/_react["default"].createElement(BGImageRenderBody, {
    dangerouslySetInnerHTML: {
      __html: contentLayout === 'amp' ? (0, _utils.convertEmbeddedToAmp)(body) : body
    }
  })));
}