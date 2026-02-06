"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.annotationDecorator = void 0;
var _react = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _sharedStyle = require("../shared-style");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var annotationDefaultSpacing = 8;
var AnnotationText = _styledComponents["default"].span.withConfig({
  displayName: "annotation-decorator__AnnotationText",
  componentId: "sc-ah822b-0"
})(["", ";"], _sharedStyle.defaultLinkStyle);
var AnnotationWrapper = _styledComponents["default"].span.withConfig({
  displayName: "annotation-decorator__AnnotationWrapper",
  componentId: "sc-ah822b-1"
})(["display:inline-block;cursor:pointer;&:hover ", "{border-bottom:2px solid #04295e;}"], AnnotationText);
var AnnotationBody = _styledComponents["default"].div.withConfig({
  displayName: "annotation-decorator__AnnotationBody",
  componentId: "sc-ah822b-2"
})(["border-radius:2px;background-color:", ";padding:20px 24px;margin:12px 0 28px;font-size:14px;font-weight:400;line-height:1.5;display:inline-block;text-align:left;width:100%;color:", ";", "{padding:20px;}> * + *{margin:", "px 0 0;min-height:0.01px;}h2{", "}ul{", " margin-top:", "px;> li{", "}}ol{", " margin-top:", "px;> li{", "}}a{", "}blockquote{", "}"], function (_ref) {
  var theme = _ref.theme;
  return theme.colors.grayscale[95];
}, function (_ref2) {
  var theme = _ref2.theme;
  return theme.colors.grayscale[20];
}, function (_ref3) {
  var theme = _ref3.theme;
  return theme.breakpoint.md;
}, annotationDefaultSpacing, _sharedStyle.defaultH2Style, _sharedStyle.defaultUlStyle, annotationDefaultSpacing, _sharedStyle.defaultUnorderedListStyle, _sharedStyle.defaultOlStyle, annotationDefaultSpacing, _sharedStyle.defaultOrderedListStyle, _sharedStyle.defaultLinkStyle, _sharedStyle.defaultBlockQuoteStyle);
var ArrowIconWrapper = _styledComponents["default"].span.withConfig({
  displayName: "annotation-decorator__ArrowIconWrapper",
  componentId: "sc-ah822b-3"
})(["width:20px;height:20px;margin:auto 4px;transition:transform 0.3s;display:inline-flex;align-items:center;justify-content:center;vertical-align:text-top;background-color:", ";border-radius:10px;transform:", ";"], function (_ref4) {
  var theme = _ref4.theme;
  return theme.colors.secondary[80];
}, function (props) {
  return props.$showContent ? 'rotate(-180deg)' : '';
});
var ArrowIcon = function ArrowIcon(_ref5) {
  var showContent = _ref5.showContent;
  return /*#__PURE__*/_react["default"].createElement(ArrowIconWrapper, {
    $showContent: showContent
  }, /*#__PURE__*/_react["default"].createElement("svg", {
    width: "11",
    height: "9",
    viewBox: "0 0 11 9",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: "M5.19617 9L1.60456e-05 -9.78799e-07L10.3923 -7.02746e-08L5.19617 9Z",
    fill: "#388A48"
  })));
};
function AnnotationBlock(props) {
  var annotated = props.children;
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    showContent = _useState2[0],
    setShowContent = _useState2[1];
  /**
   * to support k5 old annotation data, check if annotation key exist
   * k5
   * {
   *    text: string,
   *     annotation: html string,
   *     draftRawObj: DraftBlocks
   * }
   * k6
   * {
   *   bodyHTML: string,
   *   bodyEscapedHTML: string,
   *   rawContentState: DraftBlocks
   * }
   */
  var _props$contentState$g = props.contentState.getEntity(props.entityKey).getData(),
    bodyHTML = _props$contentState$g.bodyHTML,
    annotation = _props$contentState$g.annotation;
  var annotationBodyHtml = bodyHTML || annotation.trim();
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(AnnotationWrapper, {
    onClick: function onClick(e) {
      e.preventDefault();
      setShowContent(!showContent);
    }
  }, /*#__PURE__*/_react["default"].createElement(AnnotationText, {
    className: "text"
  }, annotated), /*#__PURE__*/_react["default"].createElement(ArrowIcon, {
    showContent: showContent
  })), showContent ? /*#__PURE__*/_react["default"].createElement(AnnotationBody, {
    contentEditable: false,
    dangerouslySetInnerHTML: {
      __html: annotationBodyHtml
    }
  }) : null);
}
function findAnnotationEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'ANNOTATION';
  }, callback);
}
var annotationDecorator = exports.annotationDecorator = {
  strategy: findAnnotationEntities,
  component: AnnotationBlock
};