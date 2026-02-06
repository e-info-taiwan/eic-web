"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AudioBlock = AudioBlock;
var _react = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireWildcard(require("styled-components"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var audioPlay = "/lib/public/dc249b3412c5af890a004508287a3c3d.png";
var audioPause = "/lib/public/5b3cb1a908786c8750f1041860699cc1.png";
var buttonShareStyle = (0, _styledComponents.css)(["width:64px;height:64px;border-radius:50%;background-repeat:no-repeat;background-position:center center;background-size:22px;&:hover{opacity:0.8;}"]);
var audioTimeShareStyle = (0, _styledComponents.css)(["color:rgba(0,9,40,0.5);font-weight:400;font-size:11px;line-height:1em;position:absolute;bottom:0px;", "{font-size:13px;}"], function (_ref) {
  var theme = _ref.theme;
  return theme.breakpoint.md;
});
var AudioWrapper = _styledComponents["default"].div.withConfig({
  displayName: "audio-block__AudioWrapper",
  componentId: "sc-v5b30w-0"
})(["position:relative;outline:1px solid rgba(0,9,40,0.1);padding:16px 0px 16px 16px;display:flex;align-items:center;justify-content:space-between;max-width:480px;", " ", "{padding:24px 0px 28px 24px;}audio{max-height:40px;width:100%;position:relative;pointer-events:none;}audio::-webkit-media-controls-panel{background:#ffffff;}audio::-webkit-media-controls-volume-slider,audio::-webkit-media-controls-mute-button,audio::-webkit-media-controls-play-button{display:none;}audio::-webkit-media-controls-timeline{height:4px;opacity:0.3;padding:0;margin-bottom:10px;}audio::-webkit-media-controls-current-time-display{", " left:5px;}audio::-webkit-media-controls-time-remaining-display{", " left:36px;}"], function (_ref2) {
  var theme = _ref2.theme;
  return theme.margin["default"];
}, function (_ref3) {
  var theme = _ref3.theme;
  return theme.breakpoint.md;
}, audioTimeShareStyle, audioTimeShareStyle);
var AudioInfo = _styledComponents["default"].div.withConfig({
  displayName: "audio-block__AudioInfo",
  componentId: "sc-v5b30w-1"
})(["width:calc(100% - 70px);"]);
var AudioTitle = _styledComponents["default"].div.withConfig({
  displayName: "audio-block__AudioTitle",
  componentId: "sc-v5b30w-2"
})(["font-family:'Noto Sans TC';font-style:normal;font-weight:400;font-size:14px;line-height:1.4em;color:rgba(0,9,40,0.87);padding:0 40px 0px 10px;", "{font-size:16px;}"], function (_ref4) {
  var theme = _ref4.theme;
  return theme.breakpoint.md;
});
var PlayButton = _styledComponents["default"].button.withConfig({
  displayName: "audio-block__PlayButton",
  componentId: "sc-v5b30w-3"
})(["", " background-color:#f6f6fb;background-image:url(", ");&:hover{opacity:0.66;}"], buttonShareStyle, audioPlay);
var PauseButton = _styledComponents["default"].button.withConfig({
  displayName: "audio-block__PauseButton",
  componentId: "sc-v5b30w-4"
})(["", " background-color:rgba(0,9,40,0.87);background-image:url(", ");"], buttonShareStyle, audioPause);
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