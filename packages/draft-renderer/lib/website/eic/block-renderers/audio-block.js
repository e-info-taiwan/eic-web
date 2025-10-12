"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AudioBlock = AudioBlock;
var _react = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireWildcard(require("styled-components"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var audioPlay = "https://unpkg.com/@eic-web/draft-renderer@1.4.4/lib/public/dc249b3412c5af890a004508287a3c3d.png";
var audioPause = "https://unpkg.com/@eic-web/draft-renderer@1.4.4/lib/public/5b3cb1a908786c8750f1041860699cc1.png";
var buttonShareStyle = (0, _styledComponents.css)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  width: 64px;\n  height: 64px;\n  border-radius: 50%;\n  background-repeat: no-repeat;\n  background-position: center center;\n  background-size: 22px;\n\n  &:hover {\n    opacity: 0.8;\n  }\n"])));
var audioTimeShareStyle = (0, _styledComponents.css)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  color: rgba(0, 9, 40, 0.5);\n  font-weight: 400;\n  font-size: 11px;\n  line-height: 1em;\n  position: absolute;\n  bottom: 0px;\n\n  ", " {\n    font-size: 13px;\n  }\n"])), function (_ref) {
  var theme = _ref.theme;
  return theme.breakpoint.md;
});
var AudioWrapper = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  position: relative;\n  outline: 1px solid rgba(0, 9, 40, 0.1);\n  padding: 16px 0px 16px 16px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  max-width: 480px;\n  ", "\n\n  ", " {\n    padding: 24px 0px 28px 24px;\n  }\n\n  audio {\n    max-height: 40px;\n    width: 100%;\n    position: relative;\n    pointer-events: none;\n  }\n\n  audio::-webkit-media-controls-panel {\n    background: #ffffff;\n  }\n\n  //remove default audio style: volume, mute, play\n  audio::-webkit-media-controls-volume-slider,\n  audio::-webkit-media-controls-mute-button,\n  audio::-webkit-media-controls-play-button {\n    display: none;\n  }\n\n  //\u6642\u9593\u9032\u5EA6\u689D\n  audio::-webkit-media-controls-timeline {\n    height: 4px;\n    opacity: 0.3;\n    padding: 0;\n    margin-bottom: 10px;\n  }\n\n  //\u76EE\u524D\u64AD\u653E\u6642\u9593\n  audio::-webkit-media-controls-current-time-display {\n    ", "\n    left: 5px;\n  }\n\n  //\u7E3D\u6642\u9577\n  audio::-webkit-media-controls-time-remaining-display {\n    ", "\n    left: 36px;\n  }\n"])), function (_ref2) {
  var theme = _ref2.theme;
  return theme.margin["default"];
}, function (_ref3) {
  var theme = _ref3.theme;
  return theme.breakpoint.md;
}, audioTimeShareStyle, audioTimeShareStyle);
var AudioInfo = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  width: calc(100% - 70px);\n"])));
var AudioTitle = _styledComponents["default"].div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  font-family: 'Noto Sans TC';\n  font-style: normal;\n  font-weight: 400;\n  font-size: 14px;\n  line-height: 1.4em;\n  color: rgba(0, 9, 40, 0.87);\n  padding: 0 40px 0px 10px;\n\n  ", " {\n    font-size: 16px;\n  }\n"])), function (_ref4) {
  var theme = _ref4.theme;
  return theme.breakpoint.md;
});
var PlayButton = _styledComponents["default"].button(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  ", "\n  background-color: #f6f6fb;\n  background-image: url(", ");\n\n  &:hover {\n    opacity: 0.66;\n  }\n"])), buttonShareStyle, audioPlay);
var PauseButton = _styledComponents["default"].button(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  ", "\n  background-color: rgba(0, 9, 40, 0.87);\n  background-image: url(", ");\n"])), buttonShareStyle, audioPause);
function AudioBlock(entity) {
  var _entity$getData = entity.getData(),
    audio = _entity$getData.audio;
  var audioRef = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    isPlaying = _useState2[0],
    setIsPlaying = _useState2[1];
  var handlePlay = function handlePlay() {
    audioRef === null || audioRef === void 0 || audioRef.current.play();
    setIsPlaying(true);
  };
  var handlePause = function handlePause() {
    audioRef === null || audioRef === void 0 || audioRef.current.pause();
    setIsPlaying(false);
  };
  return /*#__PURE__*/_react["default"].createElement(AudioWrapper, null, isPlaying ? /*#__PURE__*/_react["default"].createElement(PauseButton, {
    onClick: handlePause
  }) : /*#__PURE__*/_react["default"].createElement(PlayButton, {
    onClick: handlePlay
  }), /*#__PURE__*/_react["default"].createElement(AudioInfo, null, /*#__PURE__*/_react["default"].createElement(AudioTitle, null, audio === null || audio === void 0 ? void 0 : audio.name), /*#__PURE__*/_react["default"].createElement("audio", {
    controls: true,
    id: "player",
    ref: audioRef,
    src: audio === null || audio === void 0 ? void 0 : audio.url,
    controlsList: "nodownload noremoteplayback noplaybackrate nofullscreen",
    preload: "auto"
  })));
}