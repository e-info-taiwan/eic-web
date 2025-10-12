"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DividerBlock = void 0;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _templateObject;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var Divider = _styledComponents["default"].hr(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  box-sizing: border-box;\n  border-width: 1px;\n  border-style: inset;\n  ", ";\n"])), function (_ref) {
  var theme = _ref.theme;
  return theme.margin["default"];
});
var DividerBlock = exports.DividerBlock = function DividerBlock() {
  return /*#__PURE__*/_react["default"].createElement(Divider, null);
};