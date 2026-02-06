"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DividerBlock = void 0;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var Divider = _styledComponents["default"].hr.withConfig({
  displayName: "divider-block__Divider",
  componentId: "sc-laqad-0"
})(["box-sizing:border-box;border:none;border-top:1px solid #e0e0e0;", ";"], function (_ref) {
  var theme = _ref.theme;
  return theme.margin["default"];
});
var DividerBlock = exports.DividerBlock = function DividerBlock() {
  return /*#__PURE__*/_react["default"].createElement(Divider, null);
};