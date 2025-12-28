"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SideIndexBlock = SideIndexBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _sharedStyle = require("../shared-style");
var _templateObject;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var sideIndexDefaultSpacing = 32;
var SideIndexBlockWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  margin-top: ", "px;\n  background-color: #f5f5f5;\n  border-left: 4px solid #2d7a4f;\n  padding: 16px 20px;\n\n  ", " {\n    padding: 20px 24px;\n  }\n\n  h2 {\n    ", "\n    margin: 0;\n  }\n"])), sideIndexDefaultSpacing, function (_ref) {
  var theme = _ref.theme;
  return theme.breakpoint.md;
}, _sharedStyle.defaultH2Style);
function SideIndexBlock(props) {
  var block = props.block,
    contentState = props.contentState;
  var entityKey = block.getEntityAt(0);
  var entity = contentState.getEntity(entityKey);
  var _entity$getData = entity.getData(),
    h2Text = _entity$getData.h2Text,
    sideIndexText = _entity$getData.sideIndexText;
  var sideIndexTitle = sideIndexText || h2Text || '';
  var key = sideIndexTitle.replace(/\s+/g, '');
  var sideIndexBlock;
  if (h2Text) {
    sideIndexBlock = /*#__PURE__*/_react["default"].createElement(SideIndexBlockWrapper, {
      id: "header-".concat(key)
    }, /*#__PURE__*/_react["default"].createElement("h2", null, h2Text));
  } else {
    sideIndexBlock = null;
  }
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, sideIndexBlock);
}