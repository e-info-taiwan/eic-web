"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RelatedPostBlock = RelatedPostBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var RelatedPostWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  border: 2px solid #04295e;\n  border-width: 2px 2px 2px 12px;\n  padding: 16px;\n  ", ";\n\n  ", " {\n    padding: 24px;\n  }\n"])), function (_ref) {
  var theme = _ref.theme;
  return theme.margin["default"];
}, function (_ref2) {
  var theme = _ref2.theme;
  return theme.breakpoint.md;
});
var RelatedPostTitle = _styledComponents["default"].p(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  color: #04295e;\n  font-size: 14px;\n  line-height: 20px;\n  margin: 0 0 -8px;\n  ", " {\n    font-size: 16px;\n    line-height: 23px;\n  }\n"])), function (_ref3) {
  var theme = _ref3.theme;
  return theme.breakpoint.md;
});
var RelatedPostItem = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: flex;\n"])));
var RelatedPostAnchorWrapper = _styledComponents["default"].a(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  text-decoration: none;\n  display: inline-block;\n  margin: 12px 0 0;\n\n  &:hover span {\n    border-bottom: 2px solid #04295e;\n  }\n"])));
var RelatedPost = _styledComponents["default"].span(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  color: rgba(0, 9, 40, 0.87);\n  font-size: 18px;\n  line-height: 1.6;\n  border-bottom: 2px solid #ebf02c;\n  padding-bottom: 2px;\n"])));
function RelatedPostBlock(entity) {
  var _entity$getData = entity.getData(),
    posts = _entity$getData.posts;
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(RelatedPostWrapper, null, /*#__PURE__*/_react["default"].createElement(RelatedPostTitle, null, "\u63A8\u85A6\u95B1\u8B80"), posts.map(function (post) {
    return /*#__PURE__*/_react["default"].createElement(RelatedPostItem, {
      key: post.id
    }, /*#__PURE__*/_react["default"].createElement(RelatedPostAnchorWrapper, {
      href: "/post/".concat(post.id),
      target: "_blank"
    }, /*#__PURE__*/_react["default"].createElement(RelatedPost, null, post.name)));
  })));
}