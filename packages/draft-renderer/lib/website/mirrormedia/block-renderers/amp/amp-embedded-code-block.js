"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Caption = void 0;
exports["default"] = AmpEmbeddedCodeBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _utils = require("../../utils");
var _templateObject;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var Caption = exports.Caption = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  line-height: 1.43;\n  letter-spacing: 0.4px;\n  font-size: 14px;\n  color: #808080;\n  margin-top: 8px;\n  padding: 0 15px;\n"])));
function AmpEmbeddedCodeBlock(_ref) {
  var embeddedCode = _ref.embeddedCode,
    caption = _ref.caption;
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
    dangerouslySetInnerHTML: {
      __html: (0, _utils.convertEmbeddedToAmp)(embeddedCode)
    }
  }), caption ? /*#__PURE__*/_react["default"].createElement(Caption, null, caption) : null);
}