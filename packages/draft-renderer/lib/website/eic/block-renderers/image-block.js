"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImageBlock = ImageBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _reactImage = _interopRequireDefault(require("@readr-media/react-image"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var defaultImage = "/lib/public/57b35d645151e45c1816907625905202.png";
var Figure = _styledComponents["default"].figure.withConfig({
  displayName: "image-block__Figure",
  componentId: "sc-1v0uv2e-0"
})(["width:100%;", ";"], function (_ref) {
  var theme = _ref.theme;
  return theme.margin["default"];
});
var FigureCaption = _styledComponents["default"].figcaption.withConfig({
  displayName: "image-block__FigureCaption",
  componentId: "sc-1v0uv2e-1"
})(["width:100%;font-size:12px;line-height:1.25;text-align:justify;color:#373740;padding:0;margin:8px 0 0;", "{line-height:1.25;}"], function (_ref2) {
  var theme = _ref2.theme;
  return theme.breakpoint.xl;
});
var Anchor = _styledComponents["default"].a.withConfig({
  displayName: "image-block__Anchor",
  componentId: "sc-1v0uv2e-2"
})(["text-decoration:none;"]);
function ImageBlock(props) {
  var block = props.block,
    contentState = props.contentState;
  var entityKey = block.getEntityAt(0);
  var entity = contentState.getEntity(entityKey);
  var _entity$getData = entity.getData(),
    desc = _entity$getData.desc,
    name = _entity$getData.name,
    _entity$getData$resiz = _entity$getData.resized,
    resized = _entity$getData$resiz === void 0 ? {} : _entity$getData$resiz,
    _entity$getData$resiz2 = _entity$getData.resizedWebp,
    resizedWebp = _entity$getData$resiz2 === void 0 ? {} : _entity$getData$resiz2,
    url = _entity$getData.url,
    src = _entity$getData.src;

  // Check if resized images exist, otherwise fallback to src
  var hasResizedImages = resized && Object.keys(resized).length > 0;
  var imagesToUse = hasResizedImages ? resized : src ? {
    original: src
  } : {};
  var webpImagesToUse = resizedWebp && Object.keys(resizedWebp).length > 0 ? resizedWebp : {};
  var imgBlock = /*#__PURE__*/_react["default"].createElement(Figure, null, /*#__PURE__*/_react["default"].createElement(_reactImage["default"], {
    images: imagesToUse,
    imagesWebP: webpImagesToUse,
    defaultImage: defaultImage,
    alt: name || desc,
    rwd: {
      mobile: '100vw',
      tablet: '608px',
      desktop: '640px',
      "default": '100%'
    },
    priority: true
  }), /*#__PURE__*/_react["default"].createElement(FigureCaption, null, desc));
  if (url) {
    imgBlock = /*#__PURE__*/_react["default"].createElement(Anchor, {
      href: url,
      target: "_blank"
    }, imgBlock);
  }
  return imgBlock;
}