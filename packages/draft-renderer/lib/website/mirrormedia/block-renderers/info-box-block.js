"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfoBoxBlock = InfoBoxBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireWildcard(require("styled-components"));
var _sharedStyle = require("../shared-style");
var _utils = require("../utils");
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
//for setting background color info box
var backgroundColorNormal = '#054f77';
var backgroundColorWide = '#F2F2F2';
var backgroundColorPremium = '#F2F2F2';
var textColorNormal = '#c4c4c4';
var textColorWide = 'rgba(0, 0, 0, 0.66)';
var textColorPremium = 'rgba(0, 0, 0, 0.66)';
var infoBoxWrapperNormal = (0, _styledComponents.css)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  background-color: ", ";\n  color: ", ";\n  > h2 {\n    color: #ffffff;\n  }\n"])), backgroundColorNormal, textColorNormal);
var infoBoxWrapperWide = (0, _styledComponents.css)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,\n    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',\n    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';\n  background-color: ", ";\n  color: ", ";\n  border-top: 2px solid #054f77;\n  filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.08))\n    drop-shadow(0px 2px 28px rgba(0, 0, 0, 0.06));\n\n  > h2 {\n    color: black;\n  }\n"])), backgroundColorWide, textColorWide);
var infoBoxWrapperPremium = (0, _styledComponents.css)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  background-color: ", ";\n  color: ", ";\n  border-top: 2px solid #054f77;\n  filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.08))\n    drop-shadow(0px 2px 28px rgba(0, 0, 0, 0.06));\n\n  > h2 {\n    color: #054f77;\n  }\n"])), backgroundColorPremium, textColorPremium);
var InfoBoxRenderWrapper = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  padding: 32px 30px 22px 30px;\n  ", "\n  ", "\n  position: relative;\n  > h2 {\n    font-size: 20px;\n    line-height: 1.5;\n    margin-bottom: 18px;\n  }\n\n  ", "\n"])), _sharedStyle.defaultMarginTop, _sharedStyle.defaultMarginBottom, function (_ref) {
  var contentLayout = _ref.contentLayout;
  switch (contentLayout) {
    case 'normal':
      return infoBoxWrapperNormal;
    case 'wide':
      return infoBoxWrapperWide;
    case 'premium':
      return infoBoxWrapperPremium;
    default:
      return infoBoxWrapperNormal;
  }
});
var infoBoxBodyNormal = (0, _styledComponents.css)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  ul {\n    li {\n      &::before {\n        background-color: ", ";\n      }\n    }\n  }\n  ol {\n    li {\n      &::before {\n        color: ", ";\n      }\n    }\n  }\n"])), textColorNormal, textColorNormal);
var infoBoxBodyWide = (0, _styledComponents.css)(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  ul {\n    li {\n      &::before {\n        background-color: ", ";\n      }\n    }\n  }\n  ol {\n    li {\n      &::before {\n        color: ", ";\n      }\n    }\n  }\n"])), textColorWide, textColorWide);
var infoBoxBodyPremium = (0, _styledComponents.css)(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  ul {\n    li {\n      &::before {\n        background-color: ", ";\n      }\n    }\n  }\n  ol {\n    li {\n      &::before {\n        color: ", ";\n      }\n    }\n  }\n"])), textColorPremium, textColorPremium);
var infoBoxLineHeight = 1.8;
var InfoBoxBody = _styledComponents["default"].div(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n  > * + * {\n    margin-top: 20px;\n  }\n  font-size: 16px;\n  line-height: ", ";\n  a {\n    text-decoration: underline;\n  }\n  ul {\n    margin-left: 18px;\n\n    li {\n      position: relative;\n      &::before {\n        content: '';\n        position: absolute;\n        top: calc((1rem * ", ") / 2);\n        left: -12px;\n        width: 6px;\n        height: 6px;\n        transform: translate(-50%, -50%);\n        border-radius: 50%;\n      }\n    }\n  }\n  ol {\n    margin-left: 18px;\n    li {\n      position: relative;\n      counter-increment: list;\n      padding-left: 6px;\n      list-style: none;\n      &::before {\n        content: counter(list) '.';\n        position: absolute;\n        left: -18px;\n        width: 24px;\n      }\n    }\n  }\n  ", "\n"])), infoBoxLineHeight, infoBoxLineHeight, function (_ref2) {
  var contentLayout = _ref2.contentLayout;
  switch (contentLayout) {
    case 'normal':
      return infoBoxBodyNormal;
    case 'wide':
      return infoBoxBodyWide;
    case 'premium':
      return infoBoxBodyPremium;
    default:
      return infoBoxBodyNormal;
  }
});
function InfoBoxBlock(props) {
  var contentLayout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'normal';
  var block = props.block,
    contentState = props.contentState;
  var entityKey = block.getEntityAt(0);
  var entity = contentState.getEntity(entityKey);
  var _entity$getData = entity.getData(),
    title = _entity$getData.title,
    body = _entity$getData.body;
  return /*#__PURE__*/_react["default"].createElement(InfoBoxRenderWrapper, {
    contentLayout: contentLayout
  }, /*#__PURE__*/_react["default"].createElement("h2", null, title), /*#__PURE__*/_react["default"].createElement(InfoBoxBody, {
    contentLayout: contentLayout,
    dangerouslySetInnerHTML: {
      __html: contentLayout === 'amp' ? (0, _utils.convertEmbeddedToAmp)(body) : body
    }
  }));
}