"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.annotationDecorator = void 0;
var _react = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireWildcard(require("styled-components"));
var _utils = require("../utils");
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var annotationBodyColorNormal = {
  backgroundColor: '#F2F2F2',
  textColor: '#054f77'
};
var annotationBodyColorWide = {
  backgroundColor: '#E3E3E3',
  textColor: 'rgba(0, 0, 0, 0.87)'
};
var annotationBodyColorPremium = {
  backgroundColor: '#F3F5F6',
  textColor: 'rgba(0, 0, 0, 0.87)'
};
var annotatedTextNormal = (0, _styledComponents.css)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  color: #054f77;\n"])));
var annotatedTextWide = (0, _styledComponents.css)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  color: rgba(64, 64, 64, 0.87);\n"])));
var annotatedTextPremium = (0, _styledComponents.css)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  color: #054f77;\n"])));
var AnnotatedText = _styledComponents["default"].span(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  text-decoration: underline;\n  svg {\n    display: inline;\n    vertical-align: baseline;\n    margin-left: 9px;\n    margin-right: 9px;\n    transform: translateY(-50%);\n  }\n\n  ", "\n"])), function (_ref) {
  var contentLayout = _ref.contentLayout;
  switch (contentLayout) {
    case 'normal':
      return annotatedTextNormal;
    case 'wide':
      return annotatedTextWide;
    case 'premium':
      return annotatedTextPremium;
    default:
      return annotatedTextNormal;
  }
});
//for setting color of text, color of `<li>` marker in `<ul>` and `<ol>`.

var annotationBodyNormal = (0, _styledComponents.css)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  color: ", ";\n  background-color: ", ";\n  margin-top: 16px;\n  margin-bottom: 24px;\n  ul {\n    li {\n      &::before {\n        background-color: ", ";\n      }\n    }\n  }\n  ol {\n    li {\n      &::before {\n        color: ", ";\n      }\n    }\n  }\n  ", " {\n    margin-top: 24px;\n    margin-bottom: 24px;\n  }\n"])), annotationBodyColorNormal.textColor, annotationBodyColorNormal.backgroundColor, annotationBodyColorNormal.textColor, annotationBodyColorNormal.textColor, function (_ref2) {
  var theme = _ref2.theme;
  return theme.breakpoint.md;
});
var annotationBodyWide = (0, _styledComponents.css)(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,\n    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',\n    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';\n  color: ", ";\n  background-color: ", ";\n\n  margin-top: 16px;\n  margin-bottom: 24px;\n  border: 1px solid black;\n  ul {\n    li {\n      &::before {\n        background-color: ", ";\n      }\n    }\n  }\n  ol {\n    li {\n      &::before {\n        color: ", ";\n      }\n    }\n  }\n  ", " {\n    margin-top: 8px;\n    margin-bottom: 32px;\n  }\n"])), annotationBodyColorWide.textColor, annotationBodyColorWide.backgroundColor, annotationBodyColorWide.textColor, annotationBodyColorWide.textColor, function (_ref3) {
  var theme = _ref3.theme;
  return theme.breakpoint.md;
});
var annotationBodyPremium = (0, _styledComponents.css)(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  color: ", ";\n  background-color: ", ";\n\n  margin-top: 16px;\n  margin-bottom: 24px;\n  ul {\n    li {\n      &::before {\n        background-color: ", ";\n      }\n    }\n  }\n  ol {\n    li {\n      &::before {\n        color: ", ";\n      }\n    }\n  }\n  ", " {\n    margin-top: 8px;\n    margin-bottom: 32px;\n  }\n"])), annotationBodyColorPremium.textColor, annotationBodyColorPremium.backgroundColor, annotationBodyColorPremium.textColor, annotationBodyColorPremium.textColor, function (_ref4) {
  var theme = _ref4.theme;
  return theme.breakpoint.md;
});
var annotationBodyLineHeight = 1.8;
var AnnotationBody = _styledComponents["default"].div(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n  background-color: #e3e3e3;\n  padding: 24px 32px;\n  font-size: 16px;\n  line-height: ", ";\n\n  > * + * {\n    margin-top: 20px;\n  }\n  a {\n    text-decoration: underline;\n  }\n  ul {\n    margin-left: 18px;\n\n    li {\n      position: relative;\n      &::before {\n        content: '';\n        position: absolute;\n        top: calc((1rem * ", ") / 2);\n        left: -12px;\n        width: 6px;\n        height: 6px;\n        transform: translate(-50%, -50%);\n        border-radius: 50%;\n      }\n    }\n  }\n  ol {\n    margin-left: 18px;\n    li {\n      position: relative;\n      counter-increment: list;\n      padding-left: 6px;\n      &::before {\n        content: counter(list) '.';\n        position: absolute;\n        left: -15px;\n        width: 15px;\n      }\n    }\n  }\n  ", "\n"])), annotationBodyLineHeight, annotationBodyLineHeight, function (_ref5) {
  var contentLayout = _ref5.contentLayout;
  switch (contentLayout) {
    case 'normal':
      return annotationBodyNormal;
    case 'wide':
      return annotationBodyWide;
    case 'premium':
      return annotationBodyPremium;
    default:
      return annotationBodyNormal;
  }
});
var getSvgColor = function getSvgColor() {
  var contentLayout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'normal';
  switch (contentLayout) {
    case 'normal':
      return '#054f77';
    case 'wide':
      return '#333333';
    case 'premium':
      return '#054f77';
    default:
      return '#054f77';
  }
};
function indicatorSvg(shouldRotate) {
  var contentLayout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'normal';
  var svgColor = getSvgColor(contentLayout);
  var transform = "translateY(-50%)".concat(shouldRotate ? 'rotate(180deg)' : '');
  return /*#__PURE__*/_react["default"].createElement("svg", {
    width: "14",
    height: "8",
    viewBox: "0 0 14 8",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      transform: transform
    }
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: "M7.68981 0.28664C7.31321 -0.0955464 6.68679 -0.0955466 6.31019 0.286639L0.269402 6.417C-0.315817 7.01089 0.115195 8 0.959209 8L13.0408 8C13.8848 8 14.3158 7.01089 13.7306 6.417L7.68981 0.28664Z",
    fill: svgColor
  }));
}
/**
 * TODO: add props type
 */
function AmpAnnotationBlock(props) {
  var annotated = props.children,
    _props$contentLayout = props.contentLayout,
    contentLayout = _props$contentLayout === void 0 ? 'normal' : _props$contentLayout;
  var _props$contentState$g = props.contentState.getEntity(props.entityKey).getData(),
    bodyHTML = _props$contentState$g.bodyHTML;
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(AnnotatedText, {
    contentLayout: contentLayout
  }, annotated, /*#__PURE__*/_react["default"].createElement("span", {
    on: "tap:annotation-body.toggleVisibility, arrow-up.toggleVisibility, array-down.toggleVisibility",
    role: "button",
    tabindex: annotated
  }, /*#__PURE__*/_react["default"].createElement("span", {
    id: "arrow-up"
  }, indicatorSvg(false, contentLayout)), /*#__PURE__*/_react["default"].createElement("span", {
    id: "array-down",
    hidden: true
  }, indicatorSvg(true, contentLayout)))), /*#__PURE__*/_react["default"].createElement(AnnotationBody, {
    hidden: true,
    id: "annotation-body",
    contentLayout: contentLayout,
    contentEditable: false,
    dangerouslySetInnerHTML: {
      __html: (0, _utils.convertEmbeddedToAmp)(bodyHTML)
    }
  }));
}
/**
 * TODO: add props type
 */
function AnnotationBlock(props) {
  var annotated = props.children,
    _props$contentLayout2 = props.contentLayout,
    contentLayout = _props$contentLayout2 === void 0 ? 'normal' : _props$contentLayout2;
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    toShowAnnotation = _useState2[0],
    setToShowAnnotation = _useState2[1];
  var _props$contentState$g2 = props.contentState.getEntity(props.entityKey).getData(),
    bodyHTML = _props$contentState$g2.bodyHTML;
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(AnnotatedText, {
    contentLayout: contentLayout
  }, annotated, /*#__PURE__*/_react["default"].createElement("span", {
    onClick: function onClick(e) {
      e.preventDefault();
      setToShowAnnotation(!toShowAnnotation);
    }
  }, toShowAnnotation ? indicatorSvg(false, contentLayout) : indicatorSvg(true, contentLayout))), toShowAnnotation ? /*#__PURE__*/_react["default"].createElement(AnnotationBody, {
    contentLayout: contentLayout,
    contentEditable: false,
    dangerouslySetInnerHTML: {
      __html: bodyHTML
    }
  }) : null);
}
function findAnnotationEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'ANNOTATION';
  }, callback);
}
var annotationDecorator = exports.annotationDecorator = function annotationDecorator() {
  var contentLayout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'normal';
  return {
    strategy: findAnnotationEntities,
    component: contentLayout === 'amp' ? AmpAnnotationBlock : AnnotationBlock,
    props: {
      contentLayout: contentLayout
    }
  };
};