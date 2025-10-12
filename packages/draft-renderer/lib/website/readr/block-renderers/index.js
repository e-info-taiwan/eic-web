"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blockRenderers = void 0;
var _backgroundImageBlock = require("./background-image-block");
var _backgroundVideoBlock = require("./background-video-block");
var _colorBoxBlock = require("./color-box-block");
var _dividerBlock = require("./divider-block");
var _embeddedCodeBlock = require("./embedded-code-block");
var _imageBlock = require("./image-block");
var _infoBoxBlock = require("./info-box-block");
var _mediaBlock = require("./media-block");
var _relatedPostBlock = require("./related-post-block");
var _sideIndexBlock = require("./side-index-block");
var _slideshowBlock = require("./slideshow-block");
var _tableBlock = require("./table-block");
var _videoBlock = require("./video-block");
var _audioBlock = require("./audio-block");
var blockRenderers = exports.blockRenderers = {
  BGImageBlock: _backgroundImageBlock.BGImageBlock,
  BGVideoBlock: _backgroundVideoBlock.BGVideoBlock,
  ColorBoxBlock: _colorBoxBlock.ColorBoxBlock,
  DividerBlock: _dividerBlock.DividerBlock,
  EmbeddedCodeBlock: _embeddedCodeBlock.EmbeddedCodeBlock,
  ImageBlock: _imageBlock.ImageBlock,
  InfoBoxBlock: _infoBoxBlock.InfoBoxBlock,
  MediaBlock: _mediaBlock.MediaBlock,
  RelatedPostBlock: _relatedPostBlock.RelatedPostBlock,
  SideIndexBlock: _sideIndexBlock.SideIndexBlock,
  SlideshowBlock: _slideshowBlock.SlideshowBlock,
  SlideshowBlockV2: _slideshowBlock.SlideshowBlockV2,
  TableBlock: _tableBlock.TableBlock,
  VideoBlock: _videoBlock.VideoBlock,
  AudioBlock: _audioBlock.AudioBlock
};