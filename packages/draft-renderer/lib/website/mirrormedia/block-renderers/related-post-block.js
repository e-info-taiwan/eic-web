"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RelatedPostBlock = RelatedPostBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var RelatedPostRenderWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  width: 100%;\n"])));
var RelatedPostItem = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  flex: 0 0 33.3333%;\n  border: 1px solid rgba(0, 0, 0, 0.05);\n"])));
var RelatedPostImage = _styledComponents["default"].img(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: block;\n  width: 100%;\n  aspect-ratio: 2;\n  object-fit: cover;\n"])));
var RelatedPostTitle = _styledComponents["default"].p(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  margin: 0;\n  padding: 12px;\n"])));
function RelatedPostBlock(entity) {
  var _entity$getData = entity.getData(),
    posts = _entity$getData.posts;
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(RelatedPostRenderWrapper, null, posts.map(function (post) {
    var _post$heroImage;
    return /*#__PURE__*/_react["default"].createElement(RelatedPostItem, {
      key: post.id
    }, /*#__PURE__*/_react["default"].createElement(RelatedPostImage, {
      src: (_post$heroImage = post.heroImage) === null || _post$heroImage === void 0 || (_post$heroImage = _post$heroImage.resized) === null || _post$heroImage === void 0 ? void 0 : _post$heroImage.original,
      onError: function onError(e) {
        var _post$heroImage2;
        return e.currentTarget.src = (_post$heroImage2 = post.heroImage) === null || _post$heroImage2 === void 0 || (_post$heroImage2 = _post$heroImage2.imageFile) === null || _post$heroImage2 === void 0 ? void 0 : _post$heroImage2.url;
      }
    }), /*#__PURE__*/_react["default"].createElement(RelatedPostTitle, null, post.title));
  })));
}