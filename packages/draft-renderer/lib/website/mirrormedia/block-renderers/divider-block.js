"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DividerBlock = void 0;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _sharedStyle = require("../shared-style");
var _templateObject;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var Divider = _styledComponents["default"].hr(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  border-top: 1px solid #9d9d9d;\n  ", "\n  ", "\n"])), _sharedStyle.defaultMarginTop, _sharedStyle.defaultMarginBottom);
var DividerBlock = exports.DividerBlock = function DividerBlock() {
  return /*#__PURE__*/_react["default"].createElement(Divider, null);
};