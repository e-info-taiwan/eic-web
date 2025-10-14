"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DraftRenderer;
var _draftJs = require("draft-js");
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireWildcard(require("styled-components"));
var _const = require("../../draft-js/const");
var _blockRendererFn = require("./block-renderer-fn");
var _entityDecorator = _interopRequireDefault(require("./entity-decorator"));
var _contentType = require("./shared-style/content-type");
var _index = require("./shared-style/index");
var _theme = _interopRequireDefault(require("./theme"));
var _types = require("./types");
var _common = require("./utils/common");
var _post = require("./utils/post");
var _templateObject; // eslint-disable-next-line prettier/prettier
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var DraftEditorWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  /* Rich-editor default setting (.RichEditor-root)*/\n  font-family: 'Georgia', serif;\n  text-align: left;\n\n  /* Custom setting */\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,\n    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',\n    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';\n  width: 100%;\n  height: 100%;\n  font-weight: 400;\n  color: #000000;\n\n  *:has(.bg) + *:has(.bg) {\n    section {\n      margin-top: 0 !important;\n    }\n  }\n\n  /* Draft built-in buttons' style */\n  .public-DraftStyleDefault-header-two {\n    ", "\n\n    & + * {\n      ", "\n    }\n  }\n\n  .public-DraftStyleDefault-ul {\n    ", "\n  }\n\n  .public-DraftStyleDefault-ol {\n    ", "\n  }\n\n  /* code-block */\n  .public-DraftStyleDefault-pre {\n    overflow: hidden;\n  }\n\n  .alignCenter * {\n    text-align: center;\n  }\n  .alignLeft * {\n    text-align: left;\n  }\n\n  /* image-block: text-around-picture */\n  figure.left {\n    ", " {\n      ", ";\n      float: left;\n      transform: translateX(calc(-50% - 32px));\n    }\n  }\n\n  figure.right {\n    ", " {\n      ", ";\n      float: right;\n      transform: translateX(32px);\n    }\n  }\n\n  ", "\n"])), _index.defaultH2Style, _index.narrowSpacingBetweenContent, _index.defaultUlStyle, _index.defaultOlStyle, function (_ref) {
  var theme = _ref.theme;
  return theme.breakpoint.xl;
}, _index.textAroundPictureStyle, function (_ref2) {
  var theme = _ref2.theme;
  return theme.breakpoint.xl;
}, _index.textAroundPictureStyle, function (_ref3) {
  var contentType = _ref3.contentType;
  switch (contentType) {
    case _types.ValidPostContentType.NORMAL:
    case _types.ValidPostContentType.ACTIONLIST:
      return _contentType.NormalStyle;
    case _types.ValidPostContentType.SUMMARY:
      return _contentType.SummaryStyle;
    case _types.ValidPostContentType.CITATION:
      return _contentType.CitationStyle;
    default:
      return _contentType.NormalStyle;
  }
});
var customStyleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2
  }
};
var customStyleFn = function customStyleFn(style) {
  return style.reduce(function (styles, styleName) {
    if (styleName !== null && styleName !== void 0 && styleName.startsWith(_const.CUSTOM_STYLE_PREFIX_FONT_COLOR)) {
      styles['color'] = styleName.split(_const.CUSTOM_STYLE_PREFIX_FONT_COLOR)[1];
    }
    if (styleName !== null && styleName !== void 0 && styleName.startsWith(_const.CUSTOM_STYLE_PREFIX_BACKGROUND_COLOR)) {
      var highlightColor = styleName.split(_const.CUSTOM_STYLE_PREFIX_BACKGROUND_COLOR)[1];
      styles['background'] = "linear-gradient(to top, transparent 25%, ".concat(highlightColor, " 25% 75%, transparent 75%)");
    }
    return styles;
  }, {});
};
var blockStyleFn = function blockStyleFn(editorState, block) {
  var _entity$getData;
  var entityKey = block.getEntityAt(0);
  var entity = entityKey ? editorState.getCurrentContent().getEntity(entityKey) : null;
  var result = '';
  var blockData = block.getData();
  if (blockData) {
    var textAlign = blockData === null || blockData === void 0 ? void 0 : blockData.get('textAlign');
    if (textAlign === 'center') {
      result += 'alignCenter ';
    } else if (textAlign === 'left') {
      result += 'alignLeft ';
    }
  }
  switch (block.getType()) {
    case 'header-two':
    case 'header-three':
    case 'header-four':
    case 'blockquote':
      result += 'public-DraftStyleDefault-' + block.getType();
      break;
    case 'atomic':
      if ((_entity$getData = entity.getData()) !== null && _entity$getData !== void 0 && _entity$getData.alignment) {
        // support all atomic block to set alignment
        result += ' ' + entity.getData().alignment;
      }
      break;
    default:
      break;
  }
  return result;
};
var blockRendererFn = function blockRendererFn(block) {
  var atomicBlockObj = (0, _blockRendererFn.atomicBlockRenderer)(block);
  return atomicBlockObj;
};
function DraftRenderer(_ref4) {
  var rawContentBlock = _ref4.rawContentBlock,
    _ref4$insertRecommend = _ref4.insertRecommend,
    insertRecommend = _ref4$insertRecommend === void 0 ? [] : _ref4$insertRecommend,
    _ref4$contentType = _ref4.contentType,
    contentType = _ref4$contentType === void 0 ? _types.ValidPostContentType.NORMAL : _ref4$contentType;
  //if `rawContentBlock` has no data, throw error
  if (!rawContentBlock || !rawContentBlock.blocks || !rawContentBlock.blocks.length) {
    throw new Error('There is no content in rawContentBlock, please check again.');
  }
  var contentState;

  //if `rawContentBlock` data need to insert recommends, use `insertRecommendInContent` utils
  if (insertRecommend.length) {
    var contentWithRecommend = (0, _post.insertRecommendInContentBlock)(rawContentBlock, insertRecommend);
    contentState = (0, _draftJs.convertFromRaw)(contentWithRecommend);
  } else {
    //if `rawContentBlock` data has no recommends, only remove empty content blocks
    var contentRemoveEmpty = (0, _common.removeEmptyContentBlock)(rawContentBlock);
    contentState = (0, _draftJs.convertFromRaw)(contentRemoveEmpty);
  }
  var editorState = _draftJs.EditorState.createWithContent(contentState, _entityDecorator["default"]);
  return /*#__PURE__*/_react["default"].createElement(_styledComponents.ThemeProvider, {
    theme: _theme["default"]
  }, /*#__PURE__*/_react["default"].createElement(DraftEditorWrapper, {
    contentType: contentType
  }, /*#__PURE__*/_react["default"].createElement(_draftJs.Editor, {
    editorState: editorState,
    customStyleMap: customStyleMap,
    blockStyleFn: blockStyleFn.bind(null, editorState),
    blockRendererFn: blockRendererFn,
    customStyleFn: customStyleFn,
    readOnly: true
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ,
    onChange: function onChange() {}
  })));
}