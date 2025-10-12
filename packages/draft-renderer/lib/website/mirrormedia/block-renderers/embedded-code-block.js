"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmbeddedCodeBlock = exports.Caption = exports.Block = void 0;
var _react = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _ampEmbeddedCodeBlock = _interopRequireDefault(require("./amp/amp-embedded-code-block"));
var _sharedStyle = require("../shared-style");
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var Wrapper = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  position: relative;\n  ", "\n  ", "\n"])), _sharedStyle.defaultMarginTop, _sharedStyle.defaultMarginBottom);
var Block = exports.Block = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  position: relative;\n\n  /* styles for image link */\n  img.img-responsive {\n    margin: 0 auto;\n    max-width: 100%;\n    height: auto;\n    display: block;\n  }\n  //some embedded code won't set itself in the middle\n  iframe {\n    max-width: 100%;\n    margin-right: auto;\n    margin-left: auto;\n  }\n"])));
var Caption = exports.Caption = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  line-height: 1.43;\n  letter-spacing: 0.4px;\n  font-size: 14px;\n  color: #808080;\n  margin-top: 8px;\n  padding: 0 15px;\n"])));
var EmbeddedCodeBlock = exports.EmbeddedCodeBlock = function EmbeddedCodeBlock(entity, contentLayout) {
  var _entity$getData = entity.getData(),
    caption = _entity$getData.caption,
    embeddedCode = _entity$getData.embeddedCode;
  var embedded = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (!embedded.current) return;
    var node = embedded.current;
    var fragment = document.createDocumentFragment();

    // `embeddedCode` is a string, which may includes
    // multiple '<script>' tags and other html tags.
    // For executing '<script>' tags on the browser,
    // we need to extract '<script>' tags from `embeddedCode` string first.
    //
    // The approach we have here is to parse html string into elements,
    // and we could use DOM element built-in functions,
    // such as `querySelectorAll` method, to query '<script>' elements,
    // and other non '<script>' elements.
    var parser = new DOMParser();
    var ele = parser.parseFromString("<div id=\"draft-embed\">".concat(embeddedCode, "</div>"), 'text/html');
    var scripts = ele.querySelectorAll('script');
    var nonScripts = ele.querySelectorAll('div#draft-embed > :not(script)');
    nonScripts.forEach(function (ele) {
      fragment.appendChild(ele);
    });
    scripts.forEach(function (s) {
      var scriptEle = document.createElement('script');
      var attrs = s.attributes;
      for (var i = 0; i < attrs.length; i++) {
        scriptEle.setAttribute(attrs[i].name, attrs[i].value);
      }
      scriptEle.text = s.text || '';
      fragment.appendChild(scriptEle);
    });
    node.appendChild(fragment);
  }, [embeddedCode]);
  if (contentLayout === 'amp') {
    return /*#__PURE__*/_react["default"].createElement(_ampEmbeddedCodeBlock["default"], {
      embeddedCode: embeddedCode,
      caption: caption
    });
  }
  return /*#__PURE__*/_react["default"].createElement(Wrapper, null, /*#__PURE__*/_react["default"].createElement(Block, {
    ref: embedded
  }), caption ? /*#__PURE__*/_react["default"].createElement(Caption, null, caption) : null);
};