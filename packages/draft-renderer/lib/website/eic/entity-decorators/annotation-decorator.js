"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.annotationDecorator = void 0;
var _react = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _sharedStyle = require("../shared-style");
var _templateObject, _templateObject2, _templateObject3, _templateObject4;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var annotationArrow = "https://unpkg.com/@eic-web/draft-renderer@1.4.4/lib/public/07d1287fd390346af0c15b930148a5e4.png";
var annotationDefaultSpacing = 8;
var AnnotationText = _styledComponents["default"].span(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  ", ";\n"])), _sharedStyle.defaultLinkStyle);
var AnnotationWrapper = _styledComponents["default"].span(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  display: inline-block;\n  cursor: pointer;\n\n  &:hover ", " {\n    border-bottom: 2px solid #04295e;\n  }\n"])), AnnotationText);
var AnnotationBody = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  border-radius: 2px;\n  background-color: #f6f6fb;\n  padding: 12px 24px;\n  margin: 8px 0 32px;\n  font-size: 16px;\n  font-weight: 400;\n  line-height: 1.6;\n  display: inline-block;\n  text-align: left;\n  width: 100%;\n  color: rgba(0, 9, 40, 0.87);\n\n  ", " {\n    padding: 16px 32px;\n  }\n\n  > * + * {\n    margin: ", "px 0 0;\n    min-height: 0.01px; //to make margins between paragraphs effective\n  }\n\n  h2 {\n    ", "\n  }\n\n  ul {\n    ", "\n    margin-top: ", "px;\n\n    > li {\n      ", "\n    }\n  }\n\n  ol {\n    ", "\n    margin-top: ", "px;\n\n    > li {\n      ", "\n    }\n  }\n\n  a {\n    ", "\n  }\n\n  blockquote {\n    ", "\n  }\n"])), function (_ref) {
  var theme = _ref.theme;
  return theme.breakpoint.md;
}, annotationDefaultSpacing, _sharedStyle.defaultH2Style, _sharedStyle.defaultUlStyle, annotationDefaultSpacing, _sharedStyle.defaultUnorderedListStyle, _sharedStyle.defaultOlStyle, annotationDefaultSpacing, _sharedStyle.defaultOrderedListStyle, _sharedStyle.defaultLinkStyle, _sharedStyle.defaultBlockQuoteStyle);
var ArrowIcon = _styledComponents["default"].span(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  width: 24px;\n  height: 24px;\n  background-image: url(", ");\n  background-repeat: no-repeat;\n  background-position: center center;\n  background-size: 24px;\n  margin: auto 4px;\n  transition: transform 0.3s;\n  display: inline-flex;\n  vertical-align: text-top;\n  transform: ", ";\n"])), annotationArrow, function (props) {
  return props.showContent ? 'rotate(-180deg)' : '';
});
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