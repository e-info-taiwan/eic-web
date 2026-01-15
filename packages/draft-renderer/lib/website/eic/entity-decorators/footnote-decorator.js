"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.footnoteDecorator = void 0;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _templateObject;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var FootnoteLink = _styledComponents["default"].a(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  color: ", ";\n  text-decoration: none;\n  cursor: pointer;\n  font-weight: 500;\n\n  &:hover {\n    color: ", ";\n    text-decoration: underline;\n  }\n"])), function (_ref) {
  var theme = _ref.theme;
  return theme.colors.primary[40];
}, function (_ref2) {
  var theme = _ref2.theme;
  return theme.colors.primary[20];
});
function findFootnoteEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'FOOTNOTE';
  }, callback);
}
function Footnote(props) {
  var _props$contentState$g = props.contentState.getEntity(props.entityKey).getData(),
    number = _props$contentState$g.number;
  var handleClick = function handleClick(e) {
    e.preventDefault();
    // Create footnote anchor ID from number (e.g., "註1" -> "footnote-1")
    var footnoteNumber = number.replace(/[^0-9]/g, '');
    var footnoteId = "footnote-".concat(footnoteNumber);
    var element = document.getElementById(footnoteId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      // Add highlight effect
      element.classList.add('footnote-highlight');
      setTimeout(function () {
        element.classList.remove('footnote-highlight');
      }, 2000);
    }
  };
  var footnoteNumber = number.replace(/[^0-9]/g, '');
  return /*#__PURE__*/_react["default"].createElement(FootnoteLink, {
    id: "footnote-ref-".concat(footnoteNumber),
    href: "#footnote-".concat(footnoteNumber),
    onClick: handleClick,
    title: number
  }, props.children);
}
var footnoteDecorator = exports.footnoteDecorator = {
  strategy: findFootnoteEntities,
  component: Footnote
};