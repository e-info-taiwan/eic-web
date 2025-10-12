"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linkDecorator = void 0;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireWildcard(require("styled-components"));
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var linkStyleNormal = (0, _styledComponents.css)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  color: #054f77;\n"])));
var linkStylePhotography = (0, _styledComponents.css)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  color: #61b8c6;\n"])));
var LinkWrapper = _styledComponents["default"].a(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  text-decoration: underline;\n  text-underline-offset: 2px;\n  &:active {\n    color: rgba(157, 157, 157, 1);\n  }\n  ", "\n"])), function (_ref) {
  var contentLayout = _ref.contentLayout;
  switch (contentLayout) {
    case 'normal':
      return linkStyleNormal;
    case 'photography':
      return linkStylePhotography;
    default:
      return linkStyleNormal;
  }
});
function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
  }, callback);
}
var linkDecorator = exports.linkDecorator = function linkDecorator() {
  var contentLayout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'normal';
  return {
    strategy: findLinkEntities,
    component: Link,
    props: {
      contentLayout: contentLayout
    }
  };
};
function Link(props) {
  var _props$contentState$g = props.contentState.getEntity(props.entityKey).getData(),
    url = _props$contentState$g.url;
  var _props$contentLayout = props.contentLayout,
    contentLayout = _props$contentLayout === void 0 ? 'normal' : _props$contentLayout;
  return /*#__PURE__*/_react["default"].createElement(LinkWrapper, {
    href: url,
    target: "_blank",
    rel: "noreferrer noopenner",
    contentLayout: contentLayout
  }, props.children);
}