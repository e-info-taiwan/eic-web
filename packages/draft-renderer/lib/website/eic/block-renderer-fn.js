"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.atomicBlockRenderer = atomicBlockRenderer;
var _blockRenderers = require("./block-renderers");
var EmbeddedCodeBlock = _blockRenderers.blockRenderers.EmbeddedCodeBlock,
  MediaBlock = _blockRenderers.blockRenderers.MediaBlock,
  ImageBlock = _blockRenderers.blockRenderers.ImageBlock,
  InfoBoxBlock = _blockRenderers.blockRenderers.InfoBoxBlock,
  SlideshowBlock = _blockRenderers.blockRenderers.SlideshowBlock,
  SlideshowBlockV2 = _blockRenderers.blockRenderers.SlideshowBlockV2,
  DividerBlock = _blockRenderers.blockRenderers.DividerBlock,
  TableBlock = _blockRenderers.blockRenderers.TableBlock,
  ColorBoxBlock = _blockRenderers.blockRenderers.ColorBoxBlock,
  BGImageBlock = _blockRenderers.blockRenderers.BGImageBlock,
  BGVideoBlock = _blockRenderers.blockRenderers.BGVideoBlock,
  RelatedPostBlock = _blockRenderers.blockRenderers.RelatedPostBlock,
  SideIndexBlock = _blockRenderers.blockRenderers.SideIndexBlock,
  VideoBlock = _blockRenderers.blockRenderers.VideoBlock,
  AudioBlock = _blockRenderers.blockRenderers.AudioBlock;
var AtomicBlock = function AtomicBlock(props) {
  var entity = props.contentState.getEntity(props.block.getEntityAt(0));
  var entityType = entity.getType();
  switch (entityType) {
    case 'audioLink':
    case 'imageLink':
    case 'videoLink':
      {
        return MediaBlock(entity);
      }
    case 'image':
      {
        return ImageBlock(props);
      }
    case 'slideshow':
      {
        return SlideshowBlock(entity);
      }
    case 'slideshow-v2':
      {
        return SlideshowBlockV2(entity);
      }
    case 'EMBEDDEDCODE':
      {
        return EmbeddedCodeBlock(entity);
      }
    case 'INFOBOX':
      {
        return InfoBoxBlock(props);
      }
    case 'DIVIDER':
      {
        return DividerBlock();
      }
    case 'TABLE':
      {
        return TableBlock(props);
      }
    case 'COLORBOX':
      {
        return ColorBoxBlock(props);
      }
    case 'BACKGROUNDIMAGE':
      {
        return BGImageBlock(props);
      }
    case 'BACKGROUNDVIDEO':
      {
        return BGVideoBlock(props);
      }
    case 'RELATEDPOST':
      {
        return RelatedPostBlock(entity);
      }
    case 'SIDEINDEX':
      {
        return SideIndexBlock(props);
      }
    case 'VIDEO':
      {
        return VideoBlock(entity);
      }
    case 'AUDIO':
      {
        return AudioBlock(entity);
      }
  }
  return null;
};
function atomicBlockRenderer(block) {
  if (block.getType() === 'atomic') {
    return {
      component: AtomicBlock,
      editable: false
    };
  }
  return null;
}