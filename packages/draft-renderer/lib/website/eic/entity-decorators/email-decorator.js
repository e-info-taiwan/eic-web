"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emailDecorator = void 0;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _templateObject;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var EmailLinkWrapper = _styledComponents["default"].a(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: inline;\n  border-bottom: 2px solid ", ";\n  letter-spacing: 0.01em;\n  text-align: justify;\n  color: ", ";\n  padding-bottom: 2px;\n\n  &:hover {\n    border-bottom: 2px solid ", ";\n  }\n"])), function (_ref) {
  var theme = _ref.theme;
  return theme.colors.primary[40];
}, function (_ref2) {
  var theme = _ref2.theme;
  return theme.colors.primary[20];
}, function (_ref3) {
  var theme = _ref3.theme;
  return theme.colors.primary[0];
});

// Email regex pattern
var EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Strategy function: scan text for email patterns
function findEmailPatterns(contentBlock, callback, contentState) {
  var text = contentBlock.getText();
  var match;

  // Reset regex lastIndex for fresh search
  EMAIL_REGEX.lastIndex = 0;
  while ((match = EMAIL_REGEX.exec(text)) !== null) {
    var start = match.index;
    var end = start + match[0].length;

    // Check if this range already has a LINK entity (avoid double-linking)
    var entityKey = contentBlock.getEntityAt(start);
    if (entityKey) {
      var entity = contentState.getEntity(entityKey);
      if (entity && entity.getType() === 'LINK') {
        // Skip - already a link
        continue;
      }
    }
    callback(start, end);
  }
}

// Component: render email as mailto: link
function EmailLink(props) {
  var emailText = props.decoratedText;
  return /*#__PURE__*/_react["default"].createElement(EmailLinkWrapper, {
    href: "mailto:".concat(emailText)
  }, props.children);
}
var emailDecorator = exports.emailDecorator = {
  strategy: findEmailPatterns,
  component: EmailLink
};