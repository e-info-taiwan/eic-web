"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BGImageBlock = BGImageBlock;
var _react = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _reactImage = _interopRequireDefault(require("@readr-media/react-image"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var BackgroundContainer = _styledComponents["default"].section(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  clear: both;\n  position: relative;\n  margin: 32px 0 0;\n  width: 100%;\n  min-height: 60vh;\n  overflow: hidden;\n"])));
var BackgroundImage = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  position: absolute;\n  z-index: 0;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n\n  img {\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n  }\n"])));
var BackgroundContentRow = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral([""])));
var BackgroundContent = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  position: relative;\n  z-index: 1;\n  &.static {\n    min-height: 60vh;\n    display: flex;\n    align-items: flex-end;\n    ", " {\n      padding: 20px;\n      color: #fff;\n      text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.8);\n      ", " {\n        padding: 32px;\n      }\n    }\n  }\n  &.parallax {\n    ", " {\n      > div {\n        background: rgba(169, 118, 118, 0.1);\n        border-radius: 8px;\n        padding: 20px;\n        ", " {\n          width: 480px;\n        }\n\n        > * + * {\n          margin: 27px 0 0;\n        }\n        h2 {\n          font-size: 1.44em;\n          ", " {\n            font-size: 1.77em;\n          }\n        }\n        h3 {\n          font-size: 1.33em;\n          ", " {\n            font-size: 1.55em;\n          }\n        }\n        h4 {\n          font-size: 1.11em;\n          ", " {\n            font-size: 1.33em;\n          }\n        }\n        ul {\n          list-style-type: disc;\n          list-style-position: inside;\n        }\n        ol {\n          list-style-type: decimal;\n          list-style-position: inside;\n        }\n      }\n      &.left {\n        padding: 0 20px 97px;\n        ", " {\n          padding: 0 40px 335px;\n        }\n        ", " {\n          padding: 0 80px 169px;\n          padding-right: calc(100% - 480px - 80px);\n        }\n        ", " {\n          padding-bottom: 296px;\n        }\n      }\n      &.right {\n        padding: 0 20px 97px;\n        ", " {\n          padding: 0 40px 335px;\n        }\n        ", " {\n          padding: 0 80px 169px;\n          padding-left: calc(100% - 480px - 80px);\n        }\n        ", " {\n          padding-bottom: 296px;\n        }\n      }\n      &.bottom {\n        padding: 0 20px 20px;\n        ", " {\n          padding: 0 40px 40px;\n        }\n        ", " {\n          padding: 0 calc(50% - 240px) 40px;\n        }\n        ", " {\n          padding-bottom: 80px;\n        }\n      }\n    }\n  }\n"])), BackgroundContentRow, function (_ref) {
  var theme = _ref.theme;
  return theme.breakpoint.md;
}, BackgroundContentRow, function (_ref2) {
  var theme = _ref2.theme;
  return theme.breakpoint.xl;
}, function (_ref3) {
  var theme = _ref3.theme;
  return theme.breakpoint.md;
}, function (_ref4) {
  var theme = _ref4.theme;
  return theme.breakpoint.md;
}, function (_ref5) {
  var theme = _ref5.theme;
  return theme.breakpoint.md;
}, function (_ref6) {
  var theme = _ref6.theme;
  return theme.breakpoint.md;
}, function (_ref7) {
  var theme = _ref7.theme;
  return theme.breakpoint.xl;
}, function (_ref8) {
  var theme = _ref8.theme;
  return theme.breakpoint.xxl;
}, function (_ref9) {
  var theme = _ref9.theme;
  return theme.breakpoint.md;
}, function (_ref0) {
  var theme = _ref0.theme;
  return theme.breakpoint.xl;
}, function (_ref1) {
  var theme = _ref1.theme;
  return theme.breakpoint.xxl;
}, function (_ref10) {
  var theme = _ref10.theme;
  return theme.breakpoint.md;
}, function (_ref11) {
  var theme = _ref11.theme;
  return theme.breakpoint.xl;
}, function (_ref12) {
  var theme = _ref12.theme;
  return theme.breakpoint.xxl;
});
var BackgroundEmptyRow = _styledComponents["default"].div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  height: 30vh;\n"])));
function BGImageBlock(props) {
  var block = props.block,
    contentState = props.contentState;
  var entityKey = block.getEntityAt(0);
  var entity = contentState.getEntity(entityKey);
  var _entity$getData = entity.getData(),
    textBlockAlign = _entity$getData.textBlockAlign,
    image = _entity$getData.image,
    body = _entity$getData.body;
  var resized = image.resized,
    name = image.name;
  // 滾動視差
  var isParallax = textBlockAlign !== 'fixed';
  var _useState = (0, _react.useState)({}),
    _useState2 = _slicedToArray(_useState, 2),
    bgImageCss = _useState2[0],
    setBgImageCss = _useState2[1];
  var bgRef = (0, _react.useRef)(null);
  var topRef = (0, _react.useRef)(null);
  var bottomRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (bgRef.current && topRef.current && bottomRef.current) {
      var intersectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (_ref13) {
          var boundingClientRect = _ref13.boundingClientRect;
          if (!boundingClientRect.width || !bgRef.current) {
            return;
          }
          var bounding = bgRef.current.getBoundingClientRect();
          if (bounding.height) {
            if (bounding.y > 0) {
              setBgImageCss({
                position: 'absolute',
                top: 0,
                bottom: 'unset'
              });
            } else if (bounding.y + bounding.height > window.innerHeight) {
              setBgImageCss({
                position: 'fixed',
                top: 0,
                bottom: 'unset'
              });
            } else {
              setBgImageCss({
                position: 'absolute',
                top: 'unset',
                bottom: 0
              });
            }
          }
        });
      });
      intersectionObserver.observe(topRef.current);
      intersectionObserver.observe(bottomRef.current);
      return function () {
        intersectionObserver.disconnect();
      };
    }
  }, []);
  return /*#__PURE__*/_react["default"].createElement(BackgroundContainer, {
    ref: bgRef,
    className: "bg"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    ref: topRef
  }), /*#__PURE__*/_react["default"].createElement(BackgroundImage, {
    style: bgImageCss
  }, /*#__PURE__*/_react["default"].createElement(_reactImage["default"], {
    images: resized,
    alt: name,
    rwd: {
      mobile: '100vw',
      tablet: '640px',
      "default": '100%'
    },
    priority: true
  })), /*#__PURE__*/_react["default"].createElement(BackgroundContent, {
    className: isParallax ? 'parallax' : 'static'
  }, isParallax && /*#__PURE__*/_react["default"].createElement(BackgroundEmptyRow, null), /*#__PURE__*/_react["default"].createElement(BackgroundContentRow, {
    className: textBlockAlign
  }, /*#__PURE__*/_react["default"].createElement("div", {
    dangerouslySetInnerHTML: {
      __html: body
    }
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    ref: bottomRef
  }));
}