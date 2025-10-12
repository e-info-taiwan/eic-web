"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = SlideshowLightBox;
var _reactImage = _interopRequireDefault(require("@readr-media/react-image"));
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _slideshowSidebar = _interopRequireDefault(require("./slideshow-sidebar"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var defaultImage = "https://unpkg.com/@eic-web/draft-renderer@1.4.4/lib/public/722f90c535fa64c27555ec6ee5f22393.png";
var closeCross = "https://unpkg.com/@eic-web/draft-renderer@1.4.4/lib/public/903cf84ef5c5ad76634c30bdc0ff8c49.png";
var LightBoxWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: none;\n\n  ", " {\n    background: #000928;\n    width: 100%;\n    height: 100vh;\n    position: fixed;\n    top: 0;\n    left: 0;\n    color: white;\n    padding: 0 72px 0 48px;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    z-index: 9999;\n  }\n"])), function (_ref) {
  var theme = _ref.theme;
  return theme.breakpoint.xl;
});
var FocusImageWrapper = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  font-weight: 400;\n  ", ";\n  line-height: 23px;\n  text-align: center;\n  color: #ffffff;\n"])), function (_ref2) {
  var theme = _ref2.theme;
  return theme.fontSize.sm;
});
var FocusImage = _styledComponents["default"].figure(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  max-width: 900px;\n  max-height: 480px;\n  overflow: hidden;\n  margin-bottom: 32px;\n\n  ", " {\n    max-width: 960px;\n  }\n"])), function (_ref3) {
  var theme = _ref3.theme;
  return theme.breakpoint.xxl;
});
var FocusInfo = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  .focus-desc {\n    max-height: 46px;\n    overflow: hidden;\n    word-break: break-word;\n    display: -webkit-box;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 2;\n    opacity: 0.87;\n    margin-bottom: 12px;\n  }\n\n  .focus-number {\n    opacity: 0.5;\n    margin-top: 12px;\n  }\n"])));
var CloseButtonWrapper = _styledComponents["default"].div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  height: 60vh;\n  width: 64px;\n  position: relative;\n"])));
var CloseButton = _styledComponents["default"].div(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  background-image: url(", ");\n  width: 64px;\n  height: 64px;\n  margin: auto;\n  background-repeat: no-repeat;\n  background-position: center center;\n  cursor: pointer;\n  position: absolute;\n  top: -64px;\n  border-radius: 50%;\n  background-size: 64px;\n\n  &:hover {\n    background-color: rgba(255, 255, 255, 0.2);\n  }\n"])), closeCross);
function SlideshowLightBox(_ref4) {
  var focusImageIndex = _ref4.focusImageIndex,
    images = _ref4.images,
    setShowLightBox = _ref4.setShowLightBox,
    setFocusImageIndex = _ref4.setFocusImageIndex,
    imagesRefs = _ref4.imagesRefs;
  var focusImageDesc = "".concat(images[focusImageIndex].desc);
  var focusNumber = "".concat(focusImageIndex + 1, " / ").concat(images === null || images === void 0 ? void 0 : images.length);
  return /*#__PURE__*/_react["default"].createElement(LightBoxWrapper, null, /*#__PURE__*/_react["default"].createElement(_slideshowSidebar["default"], {
    focusImageIndex: focusImageIndex,
    images: images,
    setFocusImageIndex: setFocusImageIndex,
    imagesRefs: imagesRefs
  }), /*#__PURE__*/_react["default"].createElement(FocusImageWrapper, null, /*#__PURE__*/_react["default"].createElement(FocusImage, null, /*#__PURE__*/_react["default"].createElement(_reactImage["default"], {
    images: images[focusImageIndex].resized,
    defaultImage: defaultImage,
    alt: images[focusImageIndex].name,
    rwd: {
      desktop: '64px',
      "default": '100%'
    },
    priority: true
  })), /*#__PURE__*/_react["default"].createElement(FocusInfo, null, /*#__PURE__*/_react["default"].createElement("p", {
    className: "focus-desc"
  }, focusImageDesc), /*#__PURE__*/_react["default"].createElement("p", {
    className: "focus-number"
  }, focusNumber))), /*#__PURE__*/_react["default"].createElement(CloseButtonWrapper, null, /*#__PURE__*/_react["default"].createElement(CloseButton, {
    onClick: function onClick(e) {
      e.preventDefault();
      setShowLightBox(false);
    }
  })));
}