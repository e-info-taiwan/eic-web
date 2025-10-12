"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertRecommendInContentBlock = exports.getSideIndexEntityData = exports.getFirstBlockEntityType = void 0;
var _common = require("./common");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // eslint-disable-next-line prettier/prettier
var insertRecommendInContentBlock = exports.insertRecommendInContentBlock = function insertRecommendInContentBlock(rawContentBlock, insertRecommend) {
  var relatedPostsEntityMaps = insertRecommend === null || insertRecommend === void 0 ? void 0 : insertRecommend.map(function (post) {
    return {
      data: {
        posts: [{
          heroImage: (post === null || post === void 0 ? void 0 : post.heroImage) || {},
          id: (post === null || post === void 0 ? void 0 : post.id) || '',
          name: (post === null || post === void 0 ? void 0 : post.title) || '',
          ogImage: (post === null || post === void 0 ? void 0 : post.ogImage) || null,
          slug: (post === null || post === void 0 ? void 0 : post.slug) || '',
          subtitle: null
        }]
      },
      type: 'RELATEDPOST',
      mutability: 'IMMUTABLE'
    };
  });
  var insertRelatedEntities = relatedPostsEntityMaps.reduce(function (accumulator, current) {
    var _current$data;
    // +1000 to increase diversity to avoid `key` duplication
    var entityKey = Number(current === null || current === void 0 || (_current$data = current.data) === null || _current$data === void 0 ? void 0 : _current$data.posts[0].id) + 1000;
    return _objectSpread(_objectSpread({}, accumulator), {}, _defineProperty({}, entityKey, current));
  }, {});
  var entityMapWithInsertRecommend = _objectSpread(_objectSpread({}, rawContentBlock.entityMap), insertRelatedEntities);
  var relatedPostsBlocks = insertRecommend.map(function (post, index) {
    // +1000 to increase diversity to avoid `key` duplication
    var entityKey = Number(post.id) + 1000;
    return {
      key: "insertRecommend-".concat(index),
      data: {},
      text: ' ',
      //notice: if text: '' will show error
      type: 'atomic',
      depth: 0,
      entityRanges: [{
        key: entityKey,
        length: 1,
        offset: 0
      }],
      inlineStyleRanges: []
    };
  });
  function insertRecommendBlocks(data) {
    var i = 0;
    var count = 0;

    // B: insert recommends based on related-posts amount
    var paragraphs = data === null || data === void 0 ? void 0 : data.filter(function (item) {
      return (item === null || item === void 0 ? void 0 : item.type) === 'unstyled' && (item === null || item === void 0 ? void 0 : item.text.length);
    });
    var divideAmount;
    if (relatedPostsBlocks.length) {
      divideAmount = Math.round((paragraphs === null || paragraphs === void 0 ? void 0 : paragraphs.length) / (relatedPostsBlocks.length + 1)) || (paragraphs !== null && paragraphs !== void 0 && paragraphs.length ? 1 : 0);
    } else {
      divideAmount = 0;
    }
    if (data !== null && data !== void 0 && data.length) {
      while (i < data.length && divideAmount) {
        var _data$i, _data$i2;
        if (((_data$i = data[i]) === null || _data$i === void 0 ? void 0 : _data$i.type) === 'unstyled' && (_data$i2 = data[i]) !== null && _data$i2 !== void 0 && _data$i2.text.length) {
          count++;
          var item = relatedPostsBlocks[count / divideAmount - 1];
          if (count % divideAmount === 0 && item) {
            data.splice(i + 1, 0, item);
          }
        }
        i++;
      }
    }

    // A: insert recommends each 5 paragraphs (same as READr 2.0)
    // if (data?.length) {
    //   while (i < data.length) {
    //     if (data[i]?.type === 'unstyled' && data[i]?.text.length) {
    //       count++

    //       const item = relatedPostsBlocks[count / 5 - 1]
    //       if (count % 5 === 0 && item) {
    //         data.splice(i + 1, 0, item)
    //       }
    //     }
    //     i++
    //   }
    // }
    return data;
  }
  var contentWithoutEmptyBlock = (0, _common.removeEmptyContentBlock)(rawContentBlock);
  var contentWithInsertRecommend = {
    blocks: insertRecommendBlocks(contentWithoutEmptyBlock === null || contentWithoutEmptyBlock === void 0 ? void 0 : contentWithoutEmptyBlock.blocks),
    entityMap: entityMapWithInsertRecommend
  };
  return contentWithInsertRecommend;
};
var getFirstBlockEntityType = exports.getFirstBlockEntityType = function getFirstBlockEntityType(rawContentBlock) {
  var contentBlocks = (0, _common.removeEmptyContentBlock)(rawContentBlock);
  if (contentBlocks) {
    var _contentBlocks$entity;
    return contentBlocks === null || contentBlocks === void 0 || (_contentBlocks$entity = contentBlocks.entityMap[0]) === null || _contentBlocks$entity === void 0 ? void 0 : _contentBlocks$entity.type;
  } else {
    return undefined;
  }
};
var getSideIndexEntityData = exports.getSideIndexEntityData = function getSideIndexEntityData(rawContentBlock) {
  var contentBlocks = (0, _common.removeEmptyContentBlock)(rawContentBlock);
  if (contentBlocks !== null && contentBlocks !== void 0 && contentBlocks.entityMap) {
    return Object.values(contentBlocks.entityMap).filter(function (entity) {
      return entity.type === 'SIDEINDEX';
    }).map(function (entity) {
      var _entity$data;
      var content = (_entity$data = entity.data) !== null && _entity$data !== void 0 ? _entity$data : {};
      var sideIndexTitle = content.sideIndexText || content.h2Text || '';
      var key = sideIndexTitle.replace(/\s+/g, '');
      return {
        title: sideIndexTitle,
        id: "header-".concat(key),
        href: (content === null || content === void 0 ? void 0 : content.sideIndexUrl) || null,
        isActive: false
      };
    });
  } else {
    return undefined;
  }
};