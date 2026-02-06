"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RelatedPostBlock = RelatedPostBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var RelatedPostWrapper = _styledComponents["default"].div.withConfig({
  displayName: "related-post-block__RelatedPostWrapper",
  componentId: "sc-1bqo42r-0"
})(["display:flex;flex-direction:column;width:100%;border:2px solid #04295e;border-width:2px 2px 2px 12px;padding:16px;", ";", "{padding:24px;}"], function (_ref) {
  var theme = _ref.theme;
  return theme.margin["default"];
}, function (_ref2) {
  var theme = _ref2.theme;
  return theme.breakpoint.md;
});
var RelatedPostTitle = _styledComponents["default"].p.withConfig({
  displayName: "related-post-block__RelatedPostTitle",
  componentId: "sc-1bqo42r-1"
})(["color:#04295e;font-size:14px;line-height:20px;margin:0 0 -8px;", "{font-size:16px;line-height:23px;}"], function (_ref3) {
  var theme = _ref3.theme;
  return theme.breakpoint.md;
});
var RelatedPostItem = _styledComponents["default"].div.withConfig({
  displayName: "related-post-block__RelatedPostItem",
  componentId: "sc-1bqo42r-2"
})(["display:flex;"]);
var RelatedPostAnchorWrapper = _styledComponents["default"].a.withConfig({
  displayName: "related-post-block__RelatedPostAnchorWrapper",
  componentId: "sc-1bqo42r-3"
})(["text-decoration:none;display:inline-block;margin:12px 0 0;&:hover span{border-bottom:2px solid #04295e;}"]);
var RelatedPost = _styledComponents["default"].span.withConfig({
  displayName: "related-post-block__RelatedPost",
  componentId: "sc-1bqo42r-4"
})(["color:rgba(0,9,40,0.87);font-size:18px;line-height:1.6;border-bottom:2px solid #ebf02c;padding-bottom:2px;"]);
function RelatedPostBlock(entity) {
  var _entity$getData = entity.getData(),
    posts = _entity$getData.posts;
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(RelatedPostWrapper, null, /*#__PURE__*/_react["default"].createElement(RelatedPostTitle, null, "\u63A8\u85A6\u95B1\u8B80"), posts.map(function (post) {
    return /*#__PURE__*/_react["default"].createElement(RelatedPostItem, {
      key: post.id
    }, /*#__PURE__*/_react["default"].createElement(RelatedPostAnchorWrapper, {
      href: "/node/".concat(post.id),
      target: "_blank"
    }, /*#__PURE__*/_react["default"].createElement(RelatedPost, null, post.name)));
  })));
}