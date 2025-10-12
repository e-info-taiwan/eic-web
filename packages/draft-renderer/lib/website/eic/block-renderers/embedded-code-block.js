"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmbeddedCodeBlock = exports.Caption = exports.Block = void 0;
var _react = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _nodeHtmlParser = require("node-html-parser");
var _templateObject, _templateObject2;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var Block = exports.Block = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  position: relative;\n  white-space: normal;\n  /* styles for image link */\n  img.img-responsive {\n    margin: 0 auto;\n    max-width: 100%;\n    height: auto;\n    display: block;\n  }\n"])));
var Caption = exports.Caption = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  line-height: 1.43;\n  letter-spacing: 0.4px;\n  ", ";\n  color: #808080;\n  padding: 15px 15px 0 15px;\n"])), function (_ref) {
  var theme = _ref.theme;
  return theme.fontSize.xs;
});
var EmbeddedCodeBlock = exports.EmbeddedCodeBlock = function EmbeddedCodeBlock(entity) {
  var _entity$getData = entity.getData(),
    caption = _entity$getData.caption,
    embeddedCode = _entity$getData.embeddedCode;
  var embedded = (0, _react.useRef)(null);

  // `embeddedCode` is a string, which may includes
  // multiple script tags and other html tags.
  // Here we separate script tags and other html tags
  // by using the isomorphic html parser 'node-html-parser'
  // into scripts nodes and non-script nodes.
  //
  // For non-script nodes we simply put them into dangerouslySetInnerHtml.
  //
  // For scripts nodes we only append them on the client side. So we handle scripts
  // nodes when useEffect is called.
  // The reasons we don't insert script tags through dangerouslySetInnerHtml:
  // 1. Since react use setInnerHtml to append the htmlStirng received from
  //    dangerouslySetInnerHtml, scripts won't be triggered.
  // 2. Although the setInnerhtml way won't trigger script tags, those script tags
  //    will still show on the HTML provided from SSR. When the browser parse the
  //    html it will run those script and produce unexpected behavior.
  var nodes = (0, _react.useMemo)(function () {
    var ele = (0, _nodeHtmlParser.parse)("<div id=\"draft-embed\">".concat(embeddedCode, "</div>"));
    var scripts = ele.querySelectorAll('script');
    scripts.forEach(function (s) {
      s.remove();
    });
    var nonScripts = ele.querySelectorAll('div#draft-embed > :not(script)');
    var nonScriptsHtml = nonScripts.reduce(function (prev, next) {
      return prev + next.toString();
    }, '');
    return {
      scripts: scripts,
      nonScripts: nonScripts,
      nonScriptsHtml: nonScriptsHtml
    };
  }, [embeddedCode]);
  var scripts = nodes.scripts,
    nonScriptsHtml = nodes.nonScriptsHtml;
  (0, _react.useEffect)(function () {
    if (embedded.current) {
      var node = embedded.current;
      var fragment = document.createDocumentFragment();
      scripts.forEach(function (s) {
        var scriptEle = document.createElement('script');
        var attrs = s.attributes;
        for (var key in attrs) {
          scriptEle.setAttribute(key, attrs[key]);
        }
        scriptEle.text = s.text || '';
        fragment.appendChild(scriptEle);
      });
      node.appendChild(fragment);
    }
  }, [scripts]);
  var shouldShowCaption = caption && caption !== 'reporter-scroll-video';
  return (
    /*#__PURE__*/
    // only for READr
    // if `caption === 'reporter-scroll-video'`，embeddedCode need to cover header
    _react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("input", {
      hidden: true,
      disabled: true
    }), /*#__PURE__*/_react["default"].createElement(Block, {
      style: {
        zIndex: caption === 'reporter-scroll-video' ? 999 : 'auto'
      },
      ref: embedded,
      dangerouslySetInnerHTML: {
        __html: nonScriptsHtml
      }
    }), shouldShowCaption ? /*#__PURE__*/_react["default"].createElement(Caption, null, caption) : null)
  );
};