"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SideIndexBlock = SideIndexBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _sharedStyle = require("../shared-style");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var sideIndexDefaultSpacing = 32;
var SideIndexBlockWrapper = _styledComponents["default"].div.withConfig({
  displayName: "side-index-block__SideIndexBlockWrapper",
  componentId: "sc-rim3u6-0"
})(["margin-top:", "px;background-color:#f5f5f5;border-left:4px solid #2d7a4f;padding:16px 20px;", "{padding:20px 24px;}h2{", " margin:0;}"], sideIndexDefaultSpacing, function (_ref) {
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