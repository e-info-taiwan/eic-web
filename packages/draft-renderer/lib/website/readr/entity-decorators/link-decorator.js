"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linkDecorator = void 0;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _templateObject;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var LinkWrapper = _styledComponents["default"].a(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: inline;\n  border-bottom: 2px solid #ebf02c;\n  letter-spacing: 0.01em;\n  text-align: justify;\n  color: rgba(0, 9, 40, 0.87);\n  padding-bottom: 2px;\n\n  &:hover {\n    border-bottom: 2px solid #04295e;\n  }\n"])));
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