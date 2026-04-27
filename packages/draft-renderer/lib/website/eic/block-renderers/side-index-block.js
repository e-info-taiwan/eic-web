"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SideIndexBlock = SideIndexBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _sharedStyle = require("../shared-style");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var sideIndexDefaultSpacing = 32;
var SideIndexBlockWrapper = _styledComponents["default"].div.withConfig({
  displayName: "side-index-block__SideIndexBlockWrapper",
  componentId: "sc-rim3u6-0"
})(["margin-top:", "px;scroll-margin-top:calc(var(--header-height,80px) + 16px);h2{", " margin:0;}"], sideIndexDefaultSpacing, _sharedStyle.defaultH2Style);
function SideIndexBlock(props) {
  var block = props.block,
    contentState = props.contentState;
  var entityKey = block.getEntityAt(0);
  if (!entityKey) {
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null);
  }
  var entity = contentState.getEntity(entityKey);
  var _entity$getData = entity.getData(),
    h2Text = _entity$getData.h2Text;
  if (!h2Text) {
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null);
  }

  // Compute this block's index among SIDEINDEX blocks in document order.
  // Must match the same Nth-occurrence indexing in
  // utils/post.ts → getSideIndexEntityData, since convertFromRaw remaps
  // entityMap keys to internal identifiers we can't share with raw content.
  var blocks = contentState.getBlocksAsArray();
  var sideIndexNumber = -1;
  var counter = 0;
  var _iterator = _createForOfIteratorHelper(blocks),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var b = _step.value;
      var ek = b.getEntityAt(0);
      if (!ek) continue;
      if (contentState.getEntity(ek).getType() !== 'SIDEINDEX') continue;
      if (b.getKey() === block.getKey()) {
        sideIndexNumber = counter;
        break;
      }
      counter++;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return /*#__PURE__*/_react["default"].createElement(SideIndexBlockWrapper, {
    id: "header-".concat(sideIndexNumber)
  }, /*#__PURE__*/_react["default"].createElement("h2", null, h2Text));
}