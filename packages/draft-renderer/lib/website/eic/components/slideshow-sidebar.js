"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = SlideshowSideBar;
var _reactImage = _interopRequireDefault(require("@readr-media/react-image"));
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireWildcard(require("styled-components"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var defaultImage = "/lib/public/722f90c535fa64c27555ec6ee5f22393.png";
var arrowDown = "/lib/public/f96d4b486ba2061c460962ae694f4670.png";
var arrowUp = "/lib/public/679d63b1846e81ada28c2f76edbd2931.png";
var arrowShareStyle = (0, _styledComponents.css)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  width: 64px;\n  height: 64px;\n  margin: auto;\n  background-repeat: no-repeat;\n  background-position: center center;\n  background-size: 64px;\n  cursor: pointer;\n  border-radius: 50%;\n  visibility: ", ";\n\n  &:hover {\n    background-color: rgba(255, 255, 255, 0.2);\n  }\n"])), function (props) {
  return props.shouldHideArrow ? 'hidden' : 'visible';
});
var SideBarWrapper = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  width: 64px;\n  position: relative;\n\n  .sidebar-images {\n    overflow-y: scroll;\n    max-height: 520px;\n    scrollbar-width: none;\n    margin: 12px auto;\n\n    &::-webkit-scrollbar {\n      display: none; /* for Chrome, Safari, and Opera */\n    }\n  }\n"])));
var ArrowUp = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  ", "\n  background-image: url(", ");\n"])), arrowShareStyle, arrowUp);
var ArrowDown = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  ", "\n  background-image: url(", ");\n"])), arrowShareStyle, arrowDown);
var SideBarImage = _styledComponents["default"].div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  width: 100%;\n  aspect-ratio: 1/1;\n  cursor: pointer;\n  filter: ", ";\n\n  &:hover {\n    filter: ", ";\n  }\n\n  & + * {\n    margin-top: 12px;\n  }\n"])), function (props) {
  return props.isfocused ? 'none' : 'brightness(35%)';
}, function (props) {
  return props.isfocused ? 'none' : 'brightness(60%)';
});
function SlideshowSideBar(_ref) {
  var focusImageIndex = _ref.focusImageIndex,
    images = _ref.images,
    setFocusImageIndex = _ref.setFocusImageIndex,
    imagesRefs = _ref.imagesRefs;
  var handleScrollUp = function handleScrollUp() {
    if (focusImageIndex > 0) {
      var _imagesRefs$current;
      setFocusImageIndex(focusImageIndex - 1);
      imagesRefs === null || imagesRefs === void 0 || (_imagesRefs$current = imagesRefs.current[focusImageIndex - 1]) === null || _imagesRefs$current === void 0 || _imagesRefs$current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };
  var handleScrollDown = function handleScrollDown() {
    if (focusImageIndex < (images === null || images === void 0 ? void 0 : images.length) - 1) {
      var _imagesRefs$current2;
      setFocusImageIndex(focusImageIndex + 1);
      imagesRefs === null || imagesRefs === void 0 || (_imagesRefs$current2 = imagesRefs.current[focusImageIndex + 1]) === null || _imagesRefs$current2 === void 0 || _imagesRefs$current2.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };
  var handleScrollIntoView = function handleScrollIntoView(index) {
    var _imagesRefs$current$i;
    setFocusImageIndex(index);
    imagesRefs === null || imagesRefs === void 0 || (_imagesRefs$current$i = imagesRefs.current[index]) === null || _imagesRefs$current$i === void 0 || _imagesRefs$current$i.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };
  var sideBarImages = images.map(function (image, index) {
    return /*#__PURE__*/_react["default"].createElement(SideBarImage, {
      key: image === null || image === void 0 ? void 0 : image.id,
      isfocused: focusImageIndex === index,
      onClick: function onClick() {
        handleScrollIntoView(index);
      },
      ref: function ref(el) {
        if (imagesRefs !== null && imagesRefs !== void 0 && imagesRefs.current) {
          imagesRefs.current[index] = el;
        }
      }
    }, /*#__PURE__*/_react["default"].createElement(_reactImage["default"], {
      images: image === null || image === void 0 ? void 0 : image.resized,
      defaultImage: defaultImage,
      alt: image === null || image === void 0 ? void 0 : image.name,
      rwd: {
        desktop: '64px',
        "default": '100%'
      },
      priority: true
    }));
  });
  return /*#__PURE__*/_react["default"].createElement(SideBarWrapper, null, /*#__PURE__*/_react["default"].createElement(ArrowUp, {
    onClick: handleScrollUp,
    shouldHideArrow: focusImageIndex === 0
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "sidebar-images"
  }, sideBarImages), /*#__PURE__*/_react["default"].createElement(ArrowDown, {
    onClick: handleScrollDown,
    shouldHideArrow: focusImageIndex + 1 === (images === null || images === void 0 ? void 0 : images.length)
  }));
}