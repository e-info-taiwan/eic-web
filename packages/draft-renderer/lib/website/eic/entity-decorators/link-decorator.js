"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linkDecorator = void 0;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var LinkWrapper = _styledComponents["default"].a.withConfig({
  displayName: "link-decorator__LinkWrapper",
  componentId: "sc-ugrdvh-0"
})(["display:inline;border-bottom:2px solid ", ";letter-spacing:0.01em;text-align:justify;color:", ";padding-bottom:2px;&:hover{border-bottom:2px solid ", ";}"], function (_ref) {
  var theme = _ref.theme;
  return theme.colors.primary[40];
}, function (_ref2) {
  var theme = _ref2.theme;
  return theme.colors.primary[20];
}, function (_ref3) {
  var theme = _ref3.theme;
  return theme.colors.primary[0];
});
function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
  }, callback);
}
var linkDecorator = exports.linkDecorator = {
  strategy: findLinkEntities,
  component: Link
};
function Link(props) {
  var _props$contentState$g = props.contentState.getEntity(props.entityKey).getData(),
    url = _props$contentState$g.url;
  return /*#__PURE__*/_react["default"].createElement(LinkWrapper, {
    href: url,
    target: "_blank"
  }, props.children);
}