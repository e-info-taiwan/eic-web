"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImageBlock = ImageBlock;
var _react = _interopRequireDefault(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _reactImage = _interopRequireDefault(require("@readr-media/react-image"));
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var defaultImage = "https://unpkg.com/@eic-web/draft-renderer@1.4.4/lib/public/722f90c535fa64c27555ec6ee5f22393.png";
var Figure = _styledComponents["default"].figure(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  width: 100%;\n  ", ";\n"])), function (_ref) {
  var theme = _ref.theme;
  return theme.margin["default"];
});
var FigureCaption = _styledComponents["default"].figcaption(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  width: 100%;\n  font-size: 12px;\n  line-height: 1.25;\n  text-align: justify;\n  color: #373740;\n  padding: 0;\n  margin: 8px 0 0;\n\n  ", " {\n    line-height: 1.25;\n  }\n"])), function (_ref2) {
  var theme = _ref2.theme;
  return theme.breakpoint.xl;
});
var Anchor = _styledComponents["default"].a(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  text-decoration: none;\n"])));
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