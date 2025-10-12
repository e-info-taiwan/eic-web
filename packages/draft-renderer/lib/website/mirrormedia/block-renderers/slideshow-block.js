"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SlideshowBlock = SlideshowBlock;
exports.SlideshowBlockV2 = SlideshowBlockV2;
var _react = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _sharedStyle = require("../shared-style");
var _reactImage = _interopRequireDefault(require("@readr-media/react-image"));
var _ampSlideshowBlock = _interopRequireDefault(require("./amp/amp-slideshow-block"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject0;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var defaultImage = "https://unpkg.com/@eic-web/draft-renderer@1.4.4/lib/public/a3f3e41061aaaa6e12b4d1e5a07f280c.png";
var loadingImage = "https://unpkg.com/@eic-web/draft-renderer@1.4.4/lib/public/845924188760371aa28efbb3dea99d01.gif";
var Image = _styledComponents["default"].img(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  width: 100%;\n"])));
var SlideshowCount = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  border-radius: 100%;\n  border: black 1px solid;\n  transform: translate(-50%, -50%);\n  background-color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  aspect-ratio: 1;\n  min-height: 66px;\n  padding: 10px;\n"])));
var Figure = _styledComponents["default"].figure(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  position: relative;\n  margin-block: unset;\n  margin-inline: unset;\n  margin: 0 10px;\n"])));
var sliderWidth = '100%';
var slidesOffset = 2;
var Wrapper = _styledComponents["default"].figure(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  ", "\n  ", "\n"])), _sharedStyle.defaultMarginTop, _sharedStyle.defaultMarginBottom);
var SlideshowV2 = _styledComponents["default"].figure(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  touch-action: pan-y;\n  overflow: hidden;\n  position: relative;\n  width: ", ";\n  z-index: 1;\n"])), sliderWidth);
var SlidesBox = _styledComponents["default"].div(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  display: flex;\n  position: relative;\n  top: 0;\n\n  width: ", ";\n\n  ", ";\n\n  .readr-media-react-image {\n    object-position: center center;\n    background-color: transparent;\n    max-width: ", ";\n    min-width: ", ";\n    max-height: 58.75vw;\n    min-height: 58.75vw;\n    ", " {\n      min-width: 100%;\n      min-height: 428px;\n      max-width: 100%;\n      max-height: 428px;\n    }\n  }\n"])), sliderWidth, function (_ref) {
  var isShifting = _ref.isShifting;
  return isShifting ? 'transition: transform 0.3s ease-out' : null;
}, sliderWidth, sliderWidth, function (_ref2) {
  var theme = _ref2.theme;
  return theme.breakpoint.md;
});
var ClickButton = _styledComponents["default"].button(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  position: absolute;\n  top: 50%;\n  z-index: 1;\n  transform: translateY(-50%);\n  color: white;\n  height: 100%;\n  width: 40px;\n  &:focus {\n    border: none;\n    outline: none;\n  }\n  &::before {\n    content: '';\n    width: 16px;\n    height: 16px;\n    transform: rotate(45deg) translateY(-50%);\n    cursor: pointer;\n    display: block;\n    position: absolute;\n    filter: drop-shadow(0 0 1.5px #000);\n  }\n"])));
var ClickButtonPrev = (0, _styledComponents["default"])(ClickButton)(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n  left: 0;\n  &::before {\n    border-left: 2px solid #fff;\n    border-bottom: 2px solid #fff;\n    left: 9px;\n    transform: rotate(45deg) translate(0, -50%);\n  }\n"])));
var ClickButtonNext = (0, _styledComponents["default"])(ClickButton)(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n  right: 0;\n  &::before {\n    content: ' ';\n    border-right: 2px solid #fff;\n    border-top: 2px solid #fff;\n    left: unset;\n    transform: rotate(45deg) translate(-50%, 0);\n    right: 9px;\n  }\n"])));
var Desc = _styledComponents["default"].figcaption(_templateObject0 || (_templateObject0 = _taggedTemplateLiteral(["\n  font-size: 14px;\n  line-height: 1.8;\n  font-weight: 400;\n  color: rgba(0, 0, 0, 0.5);\n  margin-top: 20px;\n  min-height: 1.8rem;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,\n    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',\n    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';\n"])));

// support old version of slideshow without delay propertiy
function SlideshowBlock(entity) {
  var _images$;
  var images = entity.getData();
  return /*#__PURE__*/_react["default"].createElement(Figure, null, /*#__PURE__*/_react["default"].createElement(Image, {
    src: images === null || images === void 0 || (_images$ = images[0]) === null || _images$ === void 0 || (_images$ = _images$.resized) === null || _images$ === void 0 ? void 0 : _images$.original,
    onError: function onError(e) {
      var _images$2;
      return e.currentTarget.src = images === null || images === void 0 || (_images$2 = images[0]) === null || _images$2 === void 0 || (_images$2 = _images$2.imageFile) === null || _images$2 === void 0 ? void 0 : _images$2.url;
    }
  }), /*#__PURE__*/_react["default"].createElement(SlideshowCount, null, "+", images.length));
}

// 202206 latest version of slideshow, support delay property

/**
 * Supports sliding with mouse drag, and button clicks for navigation.
 *
 * Inspired by [Works of Claudia Conceicao](https://codepen.io/cconceicao/pen/PBQawy),
 * [twreporter slideshow component](https://github.com/twreporter/twreporter-npm-packages/blob/master/packages/react-article-components/src/components/body/slideshow/index.js)
 */
function SlideshowBlockV2(entity, contentLayout) {
  var _images$indexOfCurren;
  var slidesBoxRef = (0, _react.useRef)(null);
  /** Current index of the displayed slide */
  var _useState = (0, _react.useState)(0),
    _useState2 = _slicedToArray(_useState, 2),
    indexOfCurrentImage = _useState2[0],
    setIndexOfCurrentImage = _useState2[1];
  /** Whether allow slide shifting animation */
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isShifting = _useState4[0],
    setIsShifting = _useState4[1];
  /* Distance of dragging, which will increase/decrease value when dragging, and reset to `0` when dragging complete */
  var _useState5 = (0, _react.useState)(0),
    _useState6 = _slicedToArray(_useState5, 2),
    dragDistance = _useState6[0],
    setDragDistance = _useState6[1];
  /** Position of slide box */
  var slideBoxPosition = "calc(".concat(sliderWidth, " * ").concat(slidesOffset + indexOfCurrentImage, " * -1 + ").concat(dragDistance, "px)");
  /**
   * TODO: add type in images
   */
  var _useMemo = (0, _react.useMemo)(function () {
      return entity.getData();
    }, [entity]),
    images = _useMemo.images;
  var displayedImage = (0, _react.useMemo)(function () {
    return images.map(function (image) {
      var resized = image.resized,
        resizedWebp = image.resizedWebp;
      return {
        resized: resized,
        resizedWebp: resizedWebp
      };
    });
  }, images);
  var slidesLength = images.length;
  var descOfCurrentImage = images === null || images === void 0 || (_images$indexOfCurren = images[indexOfCurrentImage]) === null || _images$indexOfCurren === void 0 ? void 0 : _images$indexOfCurren.desc;
  if (contentLayout === 'amp') {
    return /*#__PURE__*/_react["default"].createElement(_ampSlideshowBlock["default"], {
      entity: entity
    });
  }

  /**
   * Clone first and last slide.
   * Assuming there are three images [ A, B, C ] for slideshow.
   * After cloning, there is seven images [ B(clone), C(clone), A, B, C, A(clone), B(clone) ] for rendering.
   * Users can see the previous or next image in the process of dragging.
   * For example, if drag backward from first A (the third image in array), users can see C(clone) and B(clone) when dragging.
   *
   * The cloned element is only show in the process of dragging.
   * For example, even if users drag backward from first A, and stop it at C(clone), the slide is showing C , not C(clone).
   * We doing this effect by recalculating the position of slide box.
   *
   * Why did cloned element only show at the process of dragging, and not show when dragging is end? There is two purposes:
   * 1. Show cloned element at the process of dragging, is let users can see last image even if drag backward from first image.
   * 2. Now Show cloned element displayed after the dragging is because if we displayed the cloned element, next dragging process will not as expected.
   *    For example, if we display C(clone), the next time users drag, there will be no element to drag when dragging backwards.
   *
   * The amount of item need to clone is decided by variable `slidesOffset`
   */
  var slidesWithClone = (0, _react.useMemo)(function () {
    return [].concat(_toConsumableArray(displayedImage.slice(-slidesOffset)), _toConsumableArray(displayedImage), _toConsumableArray(displayedImage === null || displayedImage === void 0 ? void 0 : displayedImage.slice(0, slidesOffset)));
  }, [displayedImage]);
  var slidesJsx = (0, _react.useMemo)(function () {
    return slidesWithClone.map(function (item, index) {
      /**
       * Why image with this index should load immediately?
       * Assuming there are three images [ A, B, C ] for slideshow.
       * After cloning, there is seven images [ B(clone), C(clone), A, B, C, A(clone), B(clone) ] for rendering.
       * If user dragging from A to C(clone), after dragging, the function `handleTransitionEnd` will set state `setIndexOfCurrentImage`,
       * and then display 'C'.
       * However, before dragging, C is not loaded, and after `handleTransitionEnd` is triggered, C is on appear and start to lazy-load,
       * and before C is loaded, there is no image show on the screen.
       * At the point of user experience, the slideshow will flash and blink: Has Image C -> No Image -> Has Image C again.
       * To avoid this problem to hurt user experience, we decide to immediately load image C, despite time of initial load will longer.
       *
       */
      var isNeedToLoadImmediately = index === slidesLength + slidesOffset - 1;
      return /*#__PURE__*/_react["default"].createElement(_reactImage["default"], {
        images: item.resized,
        imagesWebP: item.resizedWebp,
        key: index,
        loadingImage: loadingImage,
        defaultImage: defaultImage,
        objectFit: 'contain',
        priority: isNeedToLoadImmediately,
        intersectionObserverOptions: {
          root: null,
          rootMargin: '0px',
          threshold: 0
        }
      });
    });
  }, [slidesWithClone]);
  var handleClickPrev = function handleClickPrev() {
    if (isShifting) {
      return;
    }
    setIsShifting(true);
    setIndexOfCurrentImage(function (pre) {
      return pre - 1;
    });
  };
  var handleClickNext = function handleClickNext() {
    if (isShifting) {
      return;
    }
    setIsShifting(true);
    setIndexOfCurrentImage(function (pre) {
      return pre + 1;
    });
  };

  /**
   * Check `indexOfCurrentImage` after transition and reset if needed.
   * It is needed to reset if scrolling backward from the first image to the last image,
   * or scrolling forward from the last image to the first image.
   */
  var handleTransitionEnd = function handleTransitionEnd() {
    setIsShifting(false);
    if (indexOfCurrentImage <= -1) {
      setIndexOfCurrentImage(slidesLength - 1);
    } else if (indexOfCurrentImage >= slidesLength) {
      setIndexOfCurrentImage(0);
    }
  };
  (0, _react.useEffect)(function () {
    var slidesBox = slidesBoxRef === null || slidesBoxRef === void 0 ? void 0 : slidesBoxRef.current;
    if (slidesBox) {
      /** Threshold of slide change */
      var threshold = 0.25;
      var _dragDistance = 0;
      /** Position of pointer when start dragging */
      var dragStartPositionX = 0;

      /**
       * Record the mouse position and slidesBox position when dragging starts,
       * and register dragEnd and dragAction for pointer-related events
       */
      var dragStart = function dragStart(e) {
        e.preventDefault();
        dragStartPositionX = e.pageX;
        slidesBox.addEventListener('pointerup', _dragEnd);
        slidesBox.addEventListener('pointerout', _dragEnd);
        slidesBox.addEventListener('pointermove', dragAction);
      };

      /**
       * Calculate the distance of dragging, and adjust moving distance of the slidesBox accordingly to achieve dragging effect.
       * It will recalculate the value of current position of slidesBox, starting position of dragging,
       * distance of dragging when slidesBox is dragging.
       */
      var dragAction = function dragAction(e) {
        _dragDistance = e.pageX - dragStartPositionX;
        setDragDistance(_dragDistance);
      };
      /**
       * Calculate the position of `slidesBox` to decider should show next of previous image.
       */
      var _dragEnd = function dragEnd() {
        setIsShifting(true);
        if (_dragDistance / slidesBox.offsetWidth < -threshold) {
          //move forward to show next image
          setIndexOfCurrentImage(function (pre) {
            return pre + 1;
          });
        } else if (_dragDistance / slidesBox.offsetWidth > threshold) {
          //move backward to show previous image
          setIndexOfCurrentImage(function (pre) {
            return pre - 1;
          });
        } else {
          //do not move, show current image
        }

        //reset drag distance

        _dragDistance = 0;
        setDragDistance(0);
        slidesBox.removeEventListener('pointerup', _dragEnd);
        slidesBox.removeEventListener('pointerout', _dragEnd);
        slidesBox.removeEventListener('pointermove', dragAction);
      };

      // Add listener of Drag events
      slidesBox.addEventListener('pointerdown', dragStart);
      return function () {
        slidesBox.removeEventListener('pointerdown', dragStart);
      };
    }
  }, []);
  return /*#__PURE__*/_react["default"].createElement(Wrapper, null, /*#__PURE__*/_react["default"].createElement(SlideshowV2, null, /*#__PURE__*/_react["default"].createElement(ClickButtonPrev, {
    onClick: handleClickPrev
  }), /*#__PURE__*/_react["default"].createElement(ClickButtonNext, {
    onClick: handleClickNext
  }), /*#__PURE__*/_react["default"].createElement(SlidesBox, {
    style: {
      transform: "translateX(".concat(slideBoxPosition, ")")
    },
    ref: slidesBoxRef,
    amount: slidesWithClone.length,
    isShifting: isShifting,
    index: indexOfCurrentImage,
    onTransitionEnd: handleTransitionEnd
  }, slidesJsx)), /*#__PURE__*/_react["default"].createElement(Desc, null, descOfCurrentImage));
}