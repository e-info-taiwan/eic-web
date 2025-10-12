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
  VideoBlockV2 = _blockRenderers.blockRenderers.VideoBlockV2,
  AudioBlock = _blockRenderers.blockRenderers.AudioBlock,
  AudioBlockV2 = _blockRenderers.blockRenderers.AudioBlockV2,
  YoutubeBlock = _blockRenderers.blockRenderers.YoutubeBlock;
var AtomicBlock = function AtomicBlock(props) {
  var entity = props.contentState.getEntity(props.block.getEntityAt(0));
  var contentLayout = props.blockProps.contentLayout;
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
        return SlideshowBlockV2(entity, contentLayout);
      }
    case 'EMBEDDEDCODE':
      {
        return EmbeddedCodeBlock(entity, contentLayout);
      }
    case 'INFOBOX':
      {
        return InfoBoxBlock(props, contentLayout);
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
        return ColorBoxBlock(props, contentLayout);
      }
    case 'BACKGROUNDIMAGE':
      {
        return BGImageBlock(props, contentLayout);
      }
    case 'BACKGROUNDVIDEO':
      {
        return BGVideoBlock(props, contentLayout);
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
        return VideoBlock(entity, contentLayout);
      }
    case 'VIDEO-V2':
      {
        return VideoBlockV2(entity, contentLayout);
      }
    case 'AUDIO':
      {
        return AudioBlock(entity, contentLayout);
      }
    case 'AUDIO-V2':
      {
        return AudioBlockV2(entity, contentLayout);
      }
    case 'YOUTUBE':
      {
        return YoutubeBlock(entity, contentLayout);
      }
  }
  return null;
};
function atomicBlockRenderer(block, contentLayout, firstImageAdComponent) {
  if (block.getType() === 'atomic') {
    return {
      component: AtomicBlock,
      editable: false,
      props: {
        contentLayout: contentLayout,
        firstImageAdComponent: firstImageAdComponent
      }
    };
  }
  return null;
}