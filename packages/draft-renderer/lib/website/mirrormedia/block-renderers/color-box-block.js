"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColorBoxBlock = ColorBoxBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _utils = require("../utils");
var _templateObject;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var ColorBoxRenderWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  background-color: ", ";\n  padding: 30px;\n  position: relative;\n  color: white;\n"])), function (props) {
  return props.color ? props.color : '#F5F4F3';
});
function ColorBoxBlock(colorBoxBlockProps, contentLayout) {
  var block = colorBoxBlockProps.block,
    contentState = colorBoxBlockProps.contentState;
  var entityKey = block.getEntityAt(0);
  var entity = contentState.getEntity(entityKey);
  var _entity$getData = entity.getData(),
    color = _entity$getData.color,
    body = _entity$getData.body;
  return /*#__PURE__*/_react["default"].createElement(ColorBoxRenderWrapper, {
    color: color
  }, /*#__PURE__*/_react["default"].createElement("div", {
    dangerouslySetInnerHTML: {
      __html: contentLayout === 'amp' ? (0, _utils.convertEmbeddedToAmp)(body) : body
    }
  }));
}