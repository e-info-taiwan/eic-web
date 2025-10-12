"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.draftEditorCssExternal = void 0;
var _styledComponents = require("styled-components");
var _index = require("./index");
var _draftRenderer = require("../draft-renderer");
var _templateObject, _templateObject2;
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var narrowMarginBottom = (0, _styledComponents.css)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  margin-bottom: 16px;\n"])));

/**
 * Since the `content` of the externals posts is in `string` format and not draft data (ex: blocks.entityMap).
 * So we create `draftEditorCssExternal` to manage `/external/[slug]` page's `content` style.
 * The styles are similar to `draftEditorCssNormal`, but there are differences in the block styles.(ex: image-block)
 */
var draftEditorCssExternal = exports.draftEditorCssExternal = (0, _styledComponents.css)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  width: 100%;\n  height: 100%;\n  border: 0;\n  padding: 0px;\n  font-size: 18px;\n  line-height: ", ";\n  color: black;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,\n    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',\n    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';\n  font-weight: normal;\n\n  //last item in raw-content block should not have margin-bottom\n  > div {\n    > * {\n      ", "\n    }\n    > *:last-child {\n      > *:last-child {\n        margin-bottom: 0;\n      }\n    }\n  }\n\n  h2 {\n    font-size: 36px;\n    line-height: 1.5;\n  }\n\n  h3 {\n    font-size: 30px;\n    line-height: 1.5;\n  }\n\n  blockquote {\n    color: rgba(97, 184, 198, 1);\n    border-image: linear-gradient(\n        to right,\n        rgba(97, 184, 198, 1) 42.5%,\n        transparent 42.5%,\n        transparent 57.5%,\n        rgba(97, 184, 198, 1) 57.5%\n      )\n      100% 1;\n    &::before {\n      background-color: rgba(97, 184, 198, 1);\n    }\n  }\n\n  img {\n    ", "\n    ", "\n  }\n\n  a {\n    color: #054f77;\n    text-decoration: underline;\n    text-underline-offset: 2px;\n    &:active {\n      color: rgba(157, 157, 157, 1);\n    }\n  }\n\n  ol {\n    margin-left: 18px;\n    ", "\n\n    > * {\n      ", "\n    }\n\n    > li {\n      position: relative;\n      counter-increment: list;\n      padding-left: 6px;\n      &::before {\n        content: counter(list) '.';\n        position: absolute;\n        color: #054f77;\n        left: -15px;\n        width: auto;\n      }\n    }\n  }\n\n  ul {\n    margin-left: 18px;\n    list-style: none;\n    ", "\n\n    > * {\n      ", "\n    }\n\n    > li {\n      position: relative;\n      &::before {\n        content: '';\n        position: absolute;\n        top: calc((1rem * ", ") / 2);\n        left: -12px;\n        width: 6px;\n        height: 6px;\n        transform: translateX(-50%);\n        border-radius: 50%;\n        background-color: #054f77;\n      }\n    }\n  }\n"])), _draftRenderer.draftEditorLineHeight, _index.defaultMarginBottom, _index.defaultMarginTop, narrowMarginBottom, _index.defaultMarginBottom, _draftRenderer.noSpacingBetweenContent.list, _index.defaultMarginBottom, _draftRenderer.noSpacingBetweenContent.list, _draftRenderer.draftEditorLineHeight);