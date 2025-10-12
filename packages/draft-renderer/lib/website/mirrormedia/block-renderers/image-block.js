"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImageBlock = ImageBlock;
var _react = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireWildcard(require("styled-components"));
var _reactImage = _interopRequireDefault(require("@readr-media/react-image"));
var _sharedStyle = require("../shared-style");
var _bodyScrollLock = require("body-scroll-lock");
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject0, _templateObject1, _templateObject10, _templateObject11; //REMINDER: DO NOT REMOVE className which has prefix `GTM-`, since it is used for collecting data of Google Analytics event.
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var defaultImage = "https://unpkg.com/@eic-web/draft-renderer@1.4.4/lib/public/a3f3e41061aaaa6e12b4d1e5a07f280c.png";
var loadingImage = "https://unpkg.com/@eic-web/draft-renderer@1.4.4/lib/public/845924188760371aa28efbb3dea99d01.gif";
var imageFigureLayoutNormal = (0, _styledComponents.css)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .readr-media-react-image {\n    width: 100%;\n  }\n"])));
var imageFigureLayoutWide = (0, _styledComponents.css)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  .readr-media-react-image {\n    position: relative;\n    max-width: calc(100% + 20px + 20px);\n    width: 100vw;\n    transform: translateX(-20px);\n    @media (min-width: 680px) {\n      max-width: 100%;\n      transform: translateX(0px);\n    }\n  }\n"])));
var imageFigureLayoutPremium = (0, _styledComponents.css)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  .readr-media-react-image {\n    position: relative;\n    max-width: calc(100% + 20px + 20px);\n    width: 100vw;\n    transform: translateX(-20px);\n    @media (min-width: 680px) {\n      max-width: 100%;\n      transform: translateX(0px);\n    }\n  }\n"])));
var AmpImgWrapper = _styledComponents["default"].section(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  margin-top: 20px;\n  width: 100%;\n  height: 50vw;\n  position: relative;\n  display: flex;\n  justify-content: center;\n  amp-img img {\n    object-fit: contain;\n  }\n"])));
var figcaptionLayoutNormal = (0, _styledComponents.css)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  margin-top: 12px;\n  ", " {\n    margin-top: 20px;\n  }\n"])), function (_ref) {
  var theme = _ref.theme;
  return theme.breakpoint.md;
});
var figcaptionLayoutWide = (0, _styledComponents.css)(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,\n    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',\n    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';\n  padding-top: 12px;\n  margin-top: 16px;\n  position: relative;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n"])));
var Figure = _styledComponents["default"].figure(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  /* margin-block: unset; */\n  /* margin-inline: unset; */\n  ", "\n  ", "\n  .readr-media-react-image {\n    cursor: pointer;\n    aspect-ratio: ", ";\n  }\n"])), _sharedStyle.defaultMarginTop, _sharedStyle.defaultMarginBottom, function (_ref2) {
  var aspectRatio = _ref2.aspectRatio;
  return aspectRatio ? aspectRatio : 'inherit';
});
var ImageFigure = (0, _styledComponents["default"])(Figure)(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n  ", "\n"])), function (_ref3) {
  var contentLayout = _ref3.contentLayout;
  switch (contentLayout) {
    case 'normal':
      return imageFigureLayoutNormal;
    case 'wide':
      return imageFigureLayoutWide;
    case 'premium':
      return imageFigureLayoutPremium;
    default:
      return imageFigureLayoutNormal;
  }
});
var ImageWrapper = _styledComponents["default"].div(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n  position: relative;\n  width: 100%;\n"])));
var AdWrapper = _styledComponents["default"].div(_templateObject0 || (_templateObject0 = _taggedTemplateLiteral(["\n  position: absolute;\n  bottom: 0;\n  left: 0;\n"])));
var Figcaption = _styledComponents["default"].figcaption(_templateObject1 || (_templateObject1 = _taggedTemplateLiteral(["\n  font-size: 14px;\n  line-height: 1.8;\n  font-weight: 400;\n  color: rgba(0, 0, 0, 0.5);\n  ", "\n"])), function (_ref4) {
  var contentLayout = _ref4.contentLayout;
  switch (contentLayout) {
    case 'normal':
      return figcaptionLayoutNormal;
    case 'wide':
      return figcaptionLayoutWide;
    default:
      return figcaptionLayoutNormal;
  }
});
var Anchor = _styledComponents["default"].a(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n  text-decoration: none;\n"])));
var LightBoxWrapper = _styledComponents["default"].div(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.7);\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 819;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  user-select: none;\n  cursor: pointer;\n\n  button {\n    width: 36px;\n    height: 36px;\n    padding: 4px;\n    display: flex;\n    position: absolute;\n    top: 0px;\n    right: 0px;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    &:focus {\n      outline: none;\n    }\n    .close {\n      border-radius: 50%;\n      height: 20px;\n      width: 20px;\n      margin: 0 5px 0 0;\n      position: relative;\n      &:before,\n      :after {\n        position: absolute;\n        left: 8.5px;\n        top: 5px;\n        transform: translate(-50%, -50%);\n        content: ' ';\n        height: 25.5px;\n        width: 1.2px;\n        background-color: #fff;\n      }\n      &:before {\n        transform: rotate(45deg);\n      }\n      &:after {\n        transform: rotate(-45deg);\n      }\n    }\n  }\n  .readr-media-react-image {\n    max-width: 90vw;\n    max-height: 90vh;\n    margin: 0 auto;\n    cursor: auto;\n  }\n"])));
function ImageBlock(props) {
  var block = props.block,
    contentState = props.contentState,
    blockProps = props.blockProps;
  var entityKey = block.getEntityAt(0);
  var entity = contentState.getEntity(entityKey);
  var _blockProps$contentLa = blockProps.contentLayout,
    contentLayout = _blockProps$contentLa === void 0 ? 'normal' : _blockProps$contentLa,
    firstImageAdComponent = blockProps.firstImageAdComponent;
  var lightBoxRef = (0, _react.useRef)(null);
  var isAmp = contentLayout === 'amp';
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    shouldOpenLightBox = _useState2[0],
    setShouldOpenLightBox = _useState2[1];
  var _entity$getData = entity.getData(),
    name = _entity$getData.name,
    desc = _entity$getData.desc,
    resized = _entity$getData.resized,
    url = _entity$getData.url,
    _entity$getData$resiz = _entity$getData.resizedWebp,
    resizedWebp = _entity$getData$resiz === void 0 ? null : _entity$getData$resiz,
    _entity$getData$image = _entity$getData.imageFile,
    imageFile = _entity$getData$image === void 0 ? {} : _entity$getData$image,
    isFirstImage = _entity$getData.isFirstImage;
  //imageFile in possibly a `null`
  var aspectRatio = imageFile && imageFile !== null && imageFile !== void 0 && imageFile.width && imageFile !== null && imageFile !== void 0 && imageFile.height ? "".concat(imageFile.width, " / ").concat(imageFile.height) : 'inherit';
  var hasDescription = Boolean(desc);
  (0, _react.useEffect)(function () {
    if (lightBoxRef && lightBoxRef.current) {
      var _lightBox = lightBoxRef.current;
      if (shouldOpenLightBox) {
        (0, _bodyScrollLock.disableBodyScroll)(_lightBox);
      } else {
        (0, _bodyScrollLock.enableBodyScroll)(_lightBox);
      }
    }
    return function () {
      (0, _bodyScrollLock.clearAllBodyScrollLocks)();
    };
  }, [shouldOpenLightBox]);
  var handleOpen = function handleOpen() {
    if (url) {
      return;
    }
    setShouldOpenLightBox(true);
  };
  var imageJsx = isAmp ?
  /*#__PURE__*/
  /**
   * The rules for fallback of the heroImage:
   * 1. Show w1600 first.
   * 2. If the URL of w1600 is an empty string or an invalid URL, then show the original by using <amp-img> with `fallback` attribute.
   * 3. If the URL of original is an empty string, then show the default image url by replacing src of <amp-img>.
   */
  _react["default"].createElement(AmpImgWrapper, null, resized ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("amp-img", {
    src: resized === null || resized === void 0 ? void 0 : resized.w1600,
    alt: name,
    layout: "fill"
  }, /*#__PURE__*/_react["default"].createElement("amp-img", {
    fallback: "",
    src: resized !== null && resized !== void 0 && resized.original ? resized === null || resized === void 0 ? void 0 : resized.original : defaultImage,
    alt: name,
    layout: "fill"
  }))) : /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("amp-img", {
    src: defaultImage,
    alt: name,
    layout: "fill"
  }))) : /*#__PURE__*/_react["default"].createElement(ImageWrapper, {
    contentLayout: contentLayout
  }, /*#__PURE__*/_react["default"].createElement(_reactImage["default"], {
    images: resized,
    imagesWebP: resizedWebp,
    defaultImage: defaultImage,
    loadingImage: loadingImage,
    width: '',
    height: 'auto',
    objectFit: 'contain',
    alt: name,
    rwd: {
      mobile: '100vw',
      tablet: '640px',
      "default": '640px'
    },
    priority: false
  }), isFirstImage ? /*#__PURE__*/_react["default"].createElement(AdWrapper, null, firstImageAdComponent) : null);
  var imageFigureJsx = /*#__PURE__*/_react["default"].createElement(ImageFigure, {
    key: resized.original,
    contentLayout: contentLayout,
    aspectRatio: aspectRatio,
    onClick: handleOpen
  }, imageJsx, hasDescription && /*#__PURE__*/_react["default"].createElement(Figcaption, {
    contentLayout: contentLayout,
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, desc));
  var lightBox = /*#__PURE__*/_react["default"].createElement(LightBoxWrapper, {
    onClick: function onClick() {
      return setShouldOpenLightBox(false);
    }
  }, /*#__PURE__*/_react["default"].createElement(Figure, {
    ref: lightBoxRef,
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, /*#__PURE__*/_react["default"].createElement(_reactImage["default"], {
    images: resized,
    imagesWebP: resizedWebp,
    defaultImage: defaultImage,
    loadingImage: loadingImage,
    alt: name,
    rwd: {
      mobile: '90vw',
      "default": '90vw'
    },
    width: '',
    height: '',
    priority: false
  })), /*#__PURE__*/_react["default"].createElement("button", null, /*#__PURE__*/_react["default"].createElement("i", {
    className: "close"
  })));
  var renderImageBlockJsx = url ? /*#__PURE__*/_react["default"].createElement(Anchor, {
    href: url,
    target: "_blank",
    className: "GTM-story-image"
  }, imageFigureJsx) : /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, shouldOpenLightBox && lightBox, imageFigureJsx);
  return renderImageBlockJsx;
}