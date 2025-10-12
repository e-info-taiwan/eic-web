"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SideIndexBlock = SideIndexBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _templateObject, _templateObject2;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var SideIndexBlockWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  align-items: center;\n"])));
var SideIndex = _styledComponents["default"].span(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  font-size: 16px;\n  margin-left: 20px;\n"])));
function SideIndexBlock(props) {
  var block = props.block,
    contentState = props.contentState;
  var entityKey = block.getEntityAt(0);
  var entity = contentState.getEntity(entityKey);
  var _entity$getData = entity.getData(),
    h2Text = _entity$getData.h2Text,
    sideIndexText = _entity$getData.sideIndexText,
    sideIndexUrl = _entity$getData.sideIndexUrl;
  var sideIndexBlock;
  if (sideIndexUrl) {
    sideIndexBlock = /*#__PURE__*/_react["default"].createElement("a", {
      href: sideIndexUrl
    }, /*#__PURE__*/_react["default"].createElement(SideIndex, null, "\u5074\u6B04\uFF1A ", sideIndexText ? sideIndexText : h2Text));
  } else {
    sideIndexBlock = /*#__PURE__*/_react["default"].createElement("h2", null, h2Text, /*#__PURE__*/_react["default"].createElement(SideIndex, null, "\u5074\u6B04\uFF1A ", sideIndexText ? sideIndexText : h2Text));
  }
  return /*#__PURE__*/_react["default"].createElement(SideIndexBlockWrapper, null, sideIndexBlock);
}