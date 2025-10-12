"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = AmpSlideshowBlockV2;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _sharedStyle = require("../../shared-style");
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var Wrapper = _styledComponents["default"].figure(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  ", "\n  ", "\n  position: relative;\n  height: calc(58.75vw + 80px);\n  ", " {\n    height: 508px;\n  }\n\n  .amp-carousel-button {\n    position: absolute;\n    top: calc(50% - 40px);\n    z-index: 1;\n    transform: translateY(-50%);\n    color: white;\n    height: calc(100% - 80px);\n    width: 40px;\n    background: none;\n    &:focus {\n      border: none;\n      outline: none;\n    }\n    &::before {\n      position: absolute;\n      content: '';\n      width: 16px;\n      height: 16px;\n      top: 50%;\n      cursor: pointer;\n      display: block;\n    }\n  }\n\n  .amp-carousel-button-prev {\n    left: 0;\n    &::before {\n      border-left: 2px solid #fff;\n      border-bottom: 2px solid #fff;\n      left: 9px;\n      transform: rotate(45deg) translate(0, -50%);\n    }\n  }\n\n  .amp-carousel-button-next {\n    right: 0;\n    &::before {\n      content: ' ';\n      border-right: 2px solid #fff;\n      border-top: 2px solid #fff;\n      left: unset;\n      transform: rotate(45deg) translate(-50%, 0);\n      right: 9px;\n    }\n  }\n"])), _sharedStyle.defaultMarginTop, _sharedStyle.defaultMarginBottom, function (_ref) {
  var theme = _ref.theme;
  return theme.breakpoint.md;
});
var SlideImage = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  position: relative;\n  object-position: center center;\n  background-color: rgba(0, 0, 0, 0.1);\n  width: 100%;\n  height: 58.75vw;\n  ", " {\n    height: 428px;\n  }\n\n  .contain img {\n    object-fit: contain;\n  }\n"])), function (_ref2) {
  var theme = _ref2.theme;
  return theme.breakpoint.md;
});
var Desc = _styledComponents["default"].figcaption(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  font-size: 14px;\n  line-height: 1.8;\n  font-weight: 400;\n  color: rgba(0, 0, 0, 0.5);\n  margin-top: 20px;\n  min-height: 1.8rem;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,\n    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',\n    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';\n  max-height: 60px;\n  overflow: scroll;\n"])));
function AmpSlideshowBlockV2(_ref3) {
  var entity = _ref3.entity;
  var _entity$getData = entity.getData(),
    _entity$getData$image = _entity$getData.images,
    images = _entity$getData$image === void 0 ? [] : _entity$getData$image,
    _entity$getData$delay = _entity$getData.delay,
    delay = _entity$getData$delay === void 0 ? 2 : _entity$getData$delay;
  return /*#__PURE__*/_react["default"].createElement(Wrapper, null, /*#__PURE__*/_react["default"].createElement("amp-carousel", {
    layout: "fill",
    type: "slides",
    autoplay: "",
    loop: "",
    delay: delay * 1000,
    "aria-label": "Carousel"
  }, images.map(function (slide) {
    var _slide$resized;
    return /*#__PURE__*/_react["default"].createElement("figure", {
      key: slide.id
    }, /*#__PURE__*/_react["default"].createElement(SlideImage, null, /*#__PURE__*/_react["default"].createElement("amp-img", {
      "class": "contain",
      src: slide === null || slide === void 0 || (_slide$resized = slide.resized) === null || _slide$resized === void 0 ? void 0 : _slide$resized.original,
      layout: "fill",
      alt: (slide === null || slide === void 0 ? void 0 : slide.name) || 'slide'
    })), /*#__PURE__*/_react["default"].createElement(Desc, null, slide.desc));
  })));
}