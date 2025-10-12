"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DraftRenderer;
exports.noSpacingBetweenContent = exports.draftEditorLineHeight = void 0;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireWildcard(require("styled-components"));
var _draftJs = require("draft-js");
var _blockRendererFn = require("./block-renderer-fn");
var _entityDecorator = _interopRequireDefault(require("./entity-decorator"));
var _const = require("../../draft-js/const");
var _sharedStyle = require("./shared-style");
var _theme = _interopRequireDefault(require("./theme"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var blockquoteDecoration = "https://unpkg.com/@eic-web/draft-renderer@1.4.4/lib/public/662d20f531567a273f99efc70e8c85a6.png";
var draftEditorLineHeight = exports.draftEditorLineHeight = 2;
/**
 * Due to the data structure from draftjs, each default block contain one HTML element which class name is `public-DraftStyleDefault-block`.
 * So we use this behavior to create spacing between blocks by assign margin-bottom of which.
 * However, some block should not set spacing (e.g. block in <li> and <blockquote>), so we need to unset its margin-top.
 */

var noSpacingBetweenContent = exports.noSpacingBetweenContent = {
  blockquote: (0, _styledComponents.css)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    margin-bottom: unset;\n  "]))),
  list: (0, _styledComponents.css)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    margin-bottom: 4px;\n  "])))
};
var draftEditorCssNormal = (0, _styledComponents.css)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  color: black;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,\n    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',\n    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';\n  font-weight: normal;\n  .public-DraftStyleDefault-header-two {\n    font-size: 36px;\n    line-height: 1.5;\n  }\n  .public-DraftStyleDefault-header-three {\n    font-size: 30px;\n    line-height: 1.5;\n  }\n  .public-DraftStyleDefault-header-four {\n  }\n\n  .public-DraftStyleDefault-blockquote {\n    color: rgba(97, 184, 198, 1);\n    border-image: linear-gradient(\n        to right,\n        rgba(97, 184, 198, 1) 42.5%,\n        transparent 42.5%,\n        transparent 57.5%,\n        rgba(97, 184, 198, 1) 57.5%\n      )\n      100% 1;\n    &::before {\n      background-color: rgba(97, 184, 198, 1);\n    }\n  }\n"])));
var draftEditorCssWide = (0, _styledComponents.css)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  color: rgba(64, 64, 64, 0.87);\n  font-family: 'Noto Serif TC', source-han-serif-tc, 'Songti TC', serif,\n    PMingLiU;\n  font-weight: 600;\n  font-size: 18px;\n  line-height: 2;\n  [style*='font-weight:bold'] {\n    font-weight: 900 !important;\n  }\n  .public-DraftStyleDefault-header-two {\n    text-align: center;\n    color: black;\n    font-size: 36px;\n    font-weight: 700;\n  }\n  .public-DraftStyleDefault-header-three {\n    text-align: center;\n    color: black;\n    font-size: 32px;\n    font-weight: 700;\n  }\n  .public-DraftStyleDefault-header-four {\n  }\n  .public-DraftStyleDefault-blockquote {\n    color: rgba(0, 0, 0, 1);\n    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',\n      Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,\n      'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',\n      'Noto Color Emoji';\n    font-weight: 400;\n\n    border-image: linear-gradient(\n        to right,\n        rgba(0, 0, 0, 1) 42.5%,\n        transparent 42.5%,\n        transparent 57.5%,\n        rgba(0, 0, 0, 1) 57.5%\n      )\n      100% 1;\n    &::before {\n      background-color: rgba(0, 0, 0, 1);\n    }\n  }\n"])));
var draftEditorCssPremium = (0, _styledComponents.css)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  color: black;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,\n    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',\n    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';\n  font-weight: normal;\n  .public-DraftStyleDefault-header-two {\n    color: rgba(5, 79, 119, 1);\n    font-weight: 500;\n    text-align: center;\n    font-size: 36px;\n    line-height: 1.5;\n  }\n  .public-DraftStyleDefault-header-three {\n    color: rgba(5, 79, 119, 1);\n    text-align: center;\n    font-weight: 500;\n    font-size: 30px;\n    line-height: 1.5;\n  }\n  .public-DraftStyleDefault-header-four {\n  }\n\n  .public-DraftStyleDefault-blockquote {\n    color: rgba(5, 79, 119, 1);\n    border-image: linear-gradient(\n        to right,\n        rgba(5, 79, 119, 1) 42.5%,\n        transparent 42.5%,\n        transparent 57.5%,\n        rgba(5, 79, 119, 1) 57.5%\n      )\n      100% 1;\n    &::before {\n      background-color: rgba(5, 79, 119, 1);\n    }\n  }\n"])));

//目前 Photography 文末樣式僅支援：H2, H3, 粗體、底線、斜體、超連結
//目前 photography 裡的 <figure> 都會被隱藏（因此 video、infobox、colorbox，就算在 CMS 裡上稿也都無法呈現 )
// Todo: 新增一個 util function 篩選出 Image
var draftEditorCssPhotography = (0, _styledComponents.css)(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  color: white;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,\n    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',\n    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';\n  font-weight: normal;\n  .public-DraftStyleDefault-header-two {\n    font-weight: 500;\n    text-align: center;\n    font-size: 24px;\n    line-height: 1.5;\n\n    ", " {\n      font-size: 32px;\n    }\n  }\n  .public-DraftStyleDefault-header-three {\n    text-align: center;\n    font-weight: 500;\n    font-size: 18px;\n    line-height: 1.5;\n\n    ", " {\n      font-size: 24px;\n    }\n  }\n"])), function (_ref) {
  var theme = _ref.theme;
  return theme.breakpoint.md;
}, function (_ref2) {
  var theme = _ref2.theme;
  return theme.breakpoint.md;
});
var DraftEditorWrapper = _styledComponents["default"].div(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  width: 100%;\n  height: 100%;\n  border: 0;\n  padding: 0px;\n  font-size: 18px;\n  line-height: ", ";\n\n  .public-DraftStyleDefault-block {\n    ", "\n  }\n\n  //last item in raw-content block should not have margin-bottom\n  .public-DraftEditor-content {\n    > div {\n      > *:last-child {\n        > *:last-child {\n          margin-bottom: 0;\n        }\n      }\n    }\n  }\n\n  /* Draft built-in buttons' style */\n\n  .public-DraftStyleDefault-blockquote {\n    position: relative;\n    width: 100%;\n    margin: 0 auto;\n    max-width: 480px;\n    text-align: left;\n    margin: 48px auto;\n    padding-top: 34px;\n    border-top: 2px solid;\n    &::before {\n      content: '';\n      position: absolute;\n      top: 0;\n      left: 50%;\n      transform: translate(-50%, -50%);\n      width: 100%;\n      height: 20px;\n      mask-image: url(", ");\n      mask-repeat: no-repeat;\n      mask-position: center center;\n    }\n    ", "\n    ", " {\n      padding-top: 26px;\n    }\n  }\n  .public-DraftStyleDefault-ul {\n    margin-left: 18px;\n    list-style: none;\n    ", "\n    .public-DraftStyleDefault-block {\n      ", "\n    }\n  }\n  .public-DraftStyleDefault-unorderedListItem {\n    position: relative;\n    &::before {\n      content: '';\n      position: absolute;\n      top: calc((1rem * ", ") / 2);\n      left: -12px;\n      width: 6px;\n      height: 6px;\n      transform: translateX(-50%);\n      border-radius: 50%;\n      background-color: #054f77;\n    }\n  }\n  .public-DraftStyleDefault-ol {\n    margin-left: 18px;\n    ", "\n    .public-DraftStyleDefault-block {\n      ", "\n    }\n  }\n  .public-DraftStyleDefault-orderedListItem {\n    position: relative;\n    counter-increment: list;\n    padding-left: 6px;\n    &::before {\n      content: counter(list) '.';\n      position: absolute;\n      color: #054f77;\n      left: -15px;\n      width: auto;\n    }\n  }\n  /* code-block */\n  .public-DraftStyleDefault-pre {\n  }\n\n  ", "\n  .alignCenter * {\n    text-align: center;\n  }\n  .alignLeft * {\n    text-align: left;\n  }\n"])), draftEditorLineHeight, _sharedStyle.defaultMarginBottom, blockquoteDecoration, noSpacingBetweenContent.blockquote, function (_ref3) {
  var theme = _ref3.theme;
  return theme.breakpoint.md;
}, _sharedStyle.defaultMarginBottom, noSpacingBetweenContent.list, draftEditorLineHeight, _sharedStyle.defaultMarginBottom, noSpacingBetweenContent.list, function (_ref4) {
  var contentLayout = _ref4.contentLayout;
  switch (contentLayout) {
    case 'normal':
      return draftEditorCssNormal;
    case 'wide':
      return draftEditorCssWide;
    case 'premium':
      return draftEditorCssPremium;
    case 'photography':
      return draftEditorCssPhotography;
    default:
      return draftEditorCssNormal;
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
      styles['backgroundColor'] = styleName.split(_const.CUSTOM_STYLE_PREFIX_BACKGROUND_COLOR)[1];
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
/**
 * TODO: add type of params `rawContentBlock`
 */
function DraftRenderer(_ref5) {
  var rawContentBlock = _ref5.rawContentBlock,
    _ref5$contentLayout = _ref5.contentLayout,
    contentLayout = _ref5$contentLayout === void 0 ? 'normal' : _ref5$contentLayout,
    firstImageAdComponent = _ref5.firstImageAdComponent;
  var contentState = (0, _draftJs.convertFromRaw)(rawContentBlock);
  var decorators = (0, _entityDecorator["default"])(contentLayout);
  var editorState = _draftJs.EditorState.createWithContent(contentState, decorators);
  var blockRendererFn = function blockRendererFn(block) {
    var atomicBlockObj = (0, _blockRendererFn.atomicBlockRenderer)(block, contentLayout, firstImageAdComponent);
    return atomicBlockObj;
  };
  return /*#__PURE__*/_react["default"].createElement(_styledComponents.ThemeProvider, {
    theme: _theme["default"]
  }, /*#__PURE__*/_react["default"].createElement(DraftEditorWrapper, {
    contentLayout: contentLayout
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