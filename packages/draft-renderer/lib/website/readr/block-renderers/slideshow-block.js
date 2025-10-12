"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SlideshowBlock = SlideshowBlock;
exports.SlideshowBlockV2 = SlideshowBlockV2;
var _reactImage = _interopRequireDefault(require("@readr-media/react-image"));
var _react = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _slideshowLightbox = _interopRequireDefault(require("../components/slideshow-lightbox"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var defaultImage = "https://unpkg.com/@eic-web/draft-renderer@1.4.4/lib/public/722f90c535fa64c27555ec6ee5f22393.png";
var arrowDown = "https://unpkg.com/@eic-web/draft-renderer@1.4.4/lib/public/dd45f0788d9c70cabe72430bf08e7413.png";
var SlideShowDesktopSize = 960;
var SpacingBetweenSlideImages = 12;
var SlideShowBlockWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  width: calc(100% + 40px);\n  transform: translateX(-20px);\n  position: relative;\n  ", ";\n\n  ", " {\n    width: ", "px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex-wrap: wrap;\n    transform: translateX(-180px);\n    gap: ", "px;\n    max-height: ", ";\n    overflow: ", ";\n    margin-bottom: ", ";\n  }\n\n  .slideshow-image {\n    max-height: ", ";\n  }\n"])), function (_ref) {
  var theme = _ref.theme;
  return theme.margin["default"];
}, function (_ref2) {
  var theme = _ref2.theme;
  return theme.breakpoint.xl;
}, SlideShowDesktopSize, SpacingBetweenSlideImages, function (props) {
  return props.expandSlideShow ? 'none' : '960px';
}, function (props) {
  return props.expandSlideShow ? 'visible' : 'hidden';
}, function (props) {
  return props.expandSlideShow ? '32px' : '16px';
}, function (props) {
  return props.shouldLimitFigureHeight ? 'calc(960px - 324px)' : 'none';
});
var SlideShowImage = _styledComponents["default"].figure(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  width: 100%;\n  aspect-ratio: 1/1;\n\n  & + .slideshow-image {\n    margin-top: ", "px;\n  }\n\n  ", " {\n    flex: 1 0 calc((100% - ", "px) / 3);\n    min-width: ", "px;\n\n    &:hover {\n      cursor: pointer;\n      filter: brightness(15%);\n      transition: 0.3s;\n    }\n\n    & + .slideshow-image {\n      margin-top: unset;\n    }\n  }\n"])), SpacingBetweenSlideImages, function (_ref3) {
  var theme = _ref3.theme;
  return theme.breakpoint.xl;
}, SpacingBetweenSlideImages * 2, SlideShowDesktopSize / 3 - 8);
var FigCaption = _styledComponents["default"].figcaption(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  font-weight: 400;\n  line-height: 23px;\n  color: #000928;\n  opacity: 0.5;\n  ", ";\n  padding: 8px 20px 20px 20px;\n\n  ", " {\n    ", ";\n  }\n\n  ", " {\n    display: none;\n  }\n"])), function (_ref4) {
  var theme = _ref4.theme;
  return theme.fontSize.xs;
}, function (_ref5) {
  var theme = _ref5.theme;
  return theme.breakpoint.md;
}, function (_ref6) {
  var theme = _ref6.theme;
  return theme.fontSize.sm;
}, function (_ref7) {
  var theme = _ref7.theme;
  return theme.breakpoint.xl;
});
var GradientMask = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  display: none;\n\n  ", " {\n    cursor: pointer;\n    display: block;\n    position: absolute;\n    width: 100%;\n    height: ", "px;\n    bottom: 0;\n    left: 0;\n    background: linear-gradient(\n      to bottom,\n      rgba(255, 255, 255, 0) 648px,\n      rgba(255, 255, 255, 1) 960px\n    );\n  }\n"])), function (_ref8) {
  var theme = _ref8.theme;
  return theme.breakpoint.xl;
}, SlideShowDesktopSize);
var ExpandText = _styledComponents["default"].div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  display: none;\n\n  ", " {\n    display: block;\n    font-style: normal;\n    font-weight: 700;\n    ", ";\n    line-height: 18px;\n    letter-spacing: 0.03em;\n    color: #000928;\n    text-align: center;\n    cursor: pointer;\n    position: relative;\n    margin-bottom: 48px;\n    transition: all 0.2s ease;\n\n    &:hover::after,\n    &:active::after {\n      bottom: -30px;\n      transition: all 0.2s;\n    }\n\n    &::after {\n      content: '';\n      position: absolute;\n      bottom: -26px;\n      left: 50%;\n      transform: translate(-50%, 0%);\n      width: 14px;\n      height: 13px;\n      background-image: url(", ");\n      background-repeat: no-repeat;\n      background-position: center center;\n      background-size: 14px;\n    }\n  }\n"])), function (_ref9) {
  var theme = _ref9.theme;
  return theme.breakpoint.xl;
}, function (_ref0) {
  var theme = _ref0.theme;
  return theme.fontSize.md;
}, arrowDown);

// support old version of slideshow without delay propertiy
var Figure = _styledComponents["default"].figure(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  position: relative;\n  margin-block: unset;\n  margin-inline: unset;\n  margin: 0 10px;\n"])));
var Image = _styledComponents["default"].img(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  width: 100%;\n"])));
function SlideshowBlock(entity) {
  var _images$, _images$2;
  var images = entity.getData();
  return /*#__PURE__*/_react["default"].createElement(Figure, null, /*#__PURE__*/_react["default"].createElement(Image, {
    src: images === null || images === void 0 || (_images$ = images[0]) === null || _images$ === void 0 || (_images$ = _images$.resized) === null || _images$ === void 0 ? void 0 : _images$.original,
    alt: images === null || images === void 0 || (_images$2 = images[0]) === null || _images$2 === void 0 ? void 0 : _images$2.name,
    onError: function onError(e) {
      var _images$3;
      return e.currentTarget.src = images === null || images === void 0 || (_images$3 = images[0]) === null || _images$3 === void 0 || (_images$3 = _images$3.imageFile) === null || _images$3 === void 0 ? void 0 : _images$3.url;
    }
  }));
}

// 202206 latest version of slideshow, support delay property
function SlideshowBlockV2(entity) {
  var _entity$getData = entity.getData(),
    images = _entity$getData.images;
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    expandSlideShow = _useState2[0],
    setExpandSlideShow = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    showLightBox = _useState4[0],
    setShowLightBox = _useState4[1];
  var _useState5 = (0, _react.useState)(0),
    _useState6 = _slicedToArray(_useState5, 2),
    focusImageIndex = _useState6[0],
    setFocusImageIndex = _useState6[1];
  var imagesRefs = (0, _react.useRef)(Array(images.length).fill(null));
  (0, _react.useEffect)(function () {
    var focusedImageRef = imagesRefs === null || imagesRefs === void 0 ? void 0 : imagesRefs.current[focusImageIndex];
    if (focusedImageRef) {
      focusedImageRef === null || focusedImageRef === void 0 || focusedImageRef.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [focusImageIndex]);
  var shouldMaskSlideShow = Boolean(images.length > 9 && !expandSlideShow);
  var shouldLimitFigureHeight = Boolean(images.length > 1);
  var slideShowImages = images.map(function (image, index) {
    var id = image.id,
      resized = image.resized,
      desc = image.desc,
      name = image.name;
    return /*#__PURE__*/_react["default"].createElement(SlideShowImage, {
      className: "slideshow-image",
      key: id,
      onClick: function onClick() {
        setShowLightBox(!showLightBox);
        setFocusImageIndex(index);
      }
    }, /*#__PURE__*/_react["default"].createElement(_reactImage["default"], {
      images: resized,
      defaultImage: defaultImage,
      alt: name,
      rwd: {
        mobile: '100vw',
        tablet: '608px',
        desktop: '960px',
        "default": '100%'
      },
      priority: true
    }), desc && /*#__PURE__*/_react["default"].createElement(FigCaption, null, desc));
  });
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(SlideShowBlockWrapper, {
    onClick: function onClick() {
      return setExpandSlideShow(!expandSlideShow);
    },
    expandSlideShow: expandSlideShow,
    shouldLimitFigureHeight: shouldLimitFigureHeight
  }, slideShowImages, shouldMaskSlideShow && /*#__PURE__*/_react["default"].createElement(GradientMask, null)), shouldMaskSlideShow && /*#__PURE__*/_react["default"].createElement(ExpandText, {
    className: "slideshow-expand-text",
    onClick: function onClick() {
      return setExpandSlideShow(!expandSlideShow);
    }
  }, "\u5C55\u958B\u6240\u6709\u5716\u7247"), showLightBox && /*#__PURE__*/_react["default"].createElement(_slideshowLightbox["default"], {
    focusImageIndex: focusImageIndex,
    images: images,
    setShowLightBox: setShowLightBox,
    setFocusImageIndex: setFocusImageIndex,
    imagesRefs: imagesRefs
  }));
}