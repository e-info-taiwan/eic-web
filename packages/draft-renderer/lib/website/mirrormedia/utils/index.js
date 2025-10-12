"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertEmbeddedToAmp = convertEmbeddedToAmp;
exports.extractFileExtension = extractFileExtension;
exports.removeEmptyContentBlock = exports.hasContentInRawContentBlock = exports.getContentTextBlocks = exports.getContentBlocksH2H3 = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var hasContentInRawContentBlock = exports.hasContentInRawContentBlock = function hasContentInRawContentBlock(rawContentBlock) {
  if (!rawContentBlock || !rawContentBlock.blocks || !rawContentBlock.blocks.length) {
    return false;
  }
  var hasAtomicBlock = Boolean(rawContentBlock.blocks.some(function (block) {
    return block.type === 'atomic';
  }));
  if (hasAtomicBlock) {
    return hasAtomicBlock;
  }
  var defaultBlockHasContent = Boolean(rawContentBlock.blocks.filter(function (block) {
    return block.type !== 'atomic';
  }).some(function (block) {
    return block.text.trim();
  }));
  return defaultBlockHasContent;
};
var removeEmptyContentBlock = exports.removeEmptyContentBlock = function removeEmptyContentBlock(rawContentBlock) {
  var hasContent = hasContentInRawContentBlock(rawContentBlock);
  if (!hasContent) {
    throw new Error('There is no content in rawContentBlock, please check again.');
  }
  var blocksWithHideEmptyBlock = rawContentBlock.blocks.map(function (block) {
    if (block.type === 'atomic' || block.text.trim()) {
      return block;
    } else {
      return undefined;
    }
  }).filter(function (item) {
    return !!item;
  });
  return _objectSpread(_objectSpread({}, rawContentBlock), {}, {
    blocks: blocksWithHideEmptyBlock
  });
};
var getContentBlocksH2H3 = exports.getContentBlocksH2H3 = function getContentBlocksH2H3(rawContentBlock) {
  try {
    var contentBlocks = removeEmptyContentBlock(rawContentBlock);
    return contentBlocks.blocks.filter(function (block) {
      return block.type === 'header-two' || block.type === 'header-three';
    }).map(function (block) {
      return {
        key: block.key,
        text: block.text,
        type: block.type
      };
    });
  } catch (error) {
    console.warn("Because ".concat(error, ", Function 'getContentBlocksH2H3' return an empty array"));
    return [];
  }
};
function extractFileExtension(url) {
  var parts = url === null || url === void 0 ? void 0 : url.split('.');
  if ((parts === null || parts === void 0 ? void 0 : parts.length) > 1) {
    return parts[parts.length - 1];
  }
  return null;
}
var getContentTextBlocks = exports.getContentTextBlocks = function getContentTextBlocks(rawContentBlock) {
  try {
    var contentBlocks = removeEmptyContentBlock(rawContentBlock);
    return contentBlocks.blocks.filter(function (block) {
      return block.type === 'header-two' || block.type === 'header-three' || block.type === 'unstyled';
    }).map(function (block) {
      return {
        key: block.key,
        text: block.text,
        type: block.type
      };
    });
  } catch (error) {
    console.warn("Because ".concat(error, ", Function 'getContentTextBlocks' return an empty array"));
    return [];
  }
};
function convertToAmpFacebook(embeddedCode) {
  var facebookRegex = /facebook.com\/plugins\/post\.php/i;
  if (!facebookRegex.test(embeddedCode)) return embeddedCode;
  var urlRegex = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/plugins\/post\.php\?href=([^&"\s]+)/g;
  var widthRegex = /width="([^"]+)"/;
  var heightRegex = /height="([^"]+)"/;
  var urlMatch = urlRegex.exec(embeddedCode);
  var widthMatch = widthRegex.exec(embeddedCode);
  var heightMatch = heightRegex.exec(embeddedCode);
  if (urlMatch && widthMatch && heightMatch) {
    var url = decodeURIComponent(urlMatch[1]);
    var width = widthMatch[1];
    var height = heightMatch[1];
    var ampFacebookCode = "<amp-facebook\n      width=\"".concat(width, "\"\n      height=\"").concat(height, "\"\n      layout=\"responsive\"\n      data-href=\"").concat(url, "\"\n    ></amp-facebook>");
    return ampFacebookCode;
  } else {
    return 'Invalid Facebook embedded code';
  }
}
function convertEmbeddedToAmp(embeddedCode) {
  // Use regex to replace Instagram embedded code with <amp-instagram>
  var igEmbedRegex = /<blockquote class="instagram-media"[^>]* data-instgrm-permalink="([^"]+)"[^>]*>[\s\S]*?<\/blockquote>/g;
  var ampInstagramCode = embeddedCode.replace(igEmbedRegex, function (igEmbedMatch, permalink) {
    var hasCaptioned = igEmbedMatch.includes('data-instgrm-captioned');
    // Extract shortcode from the permalink
    var shortcodeMatch = permalink.match(/\/p\/([^/?]+)/);
    if (shortcodeMatch) {
      var shortcode = shortcodeMatch[1];
      return "<amp-instagram width=\"1\" height=\"1\" data-shortcode=\"".concat(shortcode, "\" ").concat(hasCaptioned ? 'data-captioned' : '', " layout=\"responsive\"></amp-instagram>");
    }
    // Keep it as-is if unable to extract the shortcode
    return igEmbedMatch;
  });
  var ampFacebook = convertToAmpFacebook(ampInstagramCode);

  // Use regex to match Twitter embedded code
  var twitterRegex = /<blockquote[^>]* class="twitter-tweet"[^>]*>[\s\S]*?<\/blockquote>/g;
  var ampTwitterCode = ampFacebook.replace(twitterRegex, function (twitterMatch) {
    // Use regex to extract the value of the data-tweet-id attribute
    var tweetIdMatch = twitterMatch.match(/twitter\.com\/[^/]+\/status\/(\d+)/i);
    if (tweetIdMatch && tweetIdMatch[1]) {
      var tweetId = tweetIdMatch[1];
      if (tweetIdMatch && tweetId) {
        // Replace with <amp-twitter> tag
        return "<amp-twitter width=\"375\" height=\"472\" data-tweetid=\"".concat(tweetId, "\"></amp-twitter>");
      }
    }
    // Keep it as-is if unable to extract the tweet ID
    return twitterMatch;
  });

  // Use regex to replace <script> tags with <amp-script>
  var scriptRegex = /<script([^>]*)><\/script>/g;
  var ampScriptEmbeddedCode = ampTwitterCode.replace(scriptRegex, function (match, attributes) {
    // Get the value of the 'src' attribute
    var srcMatch = /src="([^"]*)"/.exec(attributes);
    if (srcMatch && srcMatch[1]) {
      // Replace <script> with <amp-script> and add an absolute 'src' attribute
      var absoluteSrc = "https:".concat(srcMatch[1]);
      return "<amp-script src=\"".concat(absoluteSrc, "\"></amp-script>");
    }
    // If 'src' attribute is missing, replace <script> with <amp-script>
    return "<amp-script".concat(attributes, "></amp-script>");
  });

  // Use regex to replace <amp-img> tags with empty string if 'src' attribute is missing
  var imgRegex = /<amp-img([^>]*)>/g;
  var ampImgEmbeddedCode = ampScriptEmbeddedCode.replace(imgRegex, function (match, attributes) {
    // Check if <amp-img> includes 'src' attribute
    if (attributes.includes('src=')) {
      // Replace <amp-img> with empty string
      return "<amp-img".concat(attributes, "></amp-img>");
    }
    // If 'src' attribute is missing, return an empty string
    return '';
  });

  // Use regex to replace <audio> tags with <amp-audio>
  var audioRegex = /<audio([^>]*)><\/audio>/g;
  var ampAudioCode = ampImgEmbeddedCode.replace(audioRegex, function (match, attributes) {
    // Replace with <amp-audio> tag
    return "<amp-audio".concat(attributes, "></amp-audio>");
  });

  // Use regex to replace <video> tags with <amp-video>
  var videoRegex = /<video([^>]*)><\/video>/g;
  var ampVideoCode = ampAudioCode.replace(videoRegex, function (match, attributes) {
    // Replace with <amp-video> tag
    return "<amp-video".concat(attributes.replace('controls="true"', 'controls'), "></amp-video>");
  });

  // Use regex to replace TikTok embedded code with <amp-tiktok>
  var tiktokRegex = /<blockquote class="tiktok-embed"[^>]* data-video-id="([^"]+)"[^>]*>[\s\S]*?<\/blockquote>/g;
  var ampTikTokCode = ampVideoCode.replace(tiktokRegex, function (tiktokMatch, videoId) {
    return "<amp-tiktok width=\"325\" height=\"731\" data-src=\"".concat(videoId, "\"></amp-tiktok>");
  });

  // Use regex to replace Google Maps embedded code with <amp-iframe>
  var googleMapsRegex = /<iframe[^>]*src="https:\/\/www\.google\.com\/maps\/embed\?([^"]+)"[^>]*><\/iframe>/g;
  var ampGoogleMapsCode = ampTikTokCode.replace(googleMapsRegex, function (googleMapsMatch, queryParams) {
    return "<amp-iframe width=\"600\" height=\"450\" layout=\"responsive\" sandbox=\"allow-scripts allow-same-origin allow-popups\" src=\"https://www.google.com/maps/embed?".concat(queryParams, "\"></amp-iframe>");
  });
  var scriptStyleRegex = /<script|<style|<iframe|<embed|<nft-card/g;
  if (scriptStyleRegex.test(ampGoogleMapsCode)) {
    // css hover 效果由 mm-next 的 amp-main決定。
    // a href 由 amp-proxy 決定
    return "\n    <a class='link-to-story' style='\n      display: flex; \n      flex-direction: column;\n      justify-content: center;\n      align-items: center;\n      width: 100%; \n      height: 210px;\n      box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.15) inset;\n      color: #888;\n      font-family: PingFang TC;\n      font-size: 16px;\n      font-style: normal;\n      font-weight: 300;\n      line-height: 180%;'><div>AMP\u4E0D\u652F\u63F4\u6B64\u529F\u80FD\uFF0C\u8ACB</div><div style='font-weight: 600; margin-bottom: 4.5px;'>\u9EDE\u64CA\u9023\u7D50\u89C0\u770B\u5B8C\u6574\u5167\u5BB9</div><svg width=\"24\" height=\"20\" viewBox=\"0 0 24 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n      <path d=\"M13.1929 1.18239C12.7694 1.50222 12.4755 1.9516 12.3383 2.45154C11.6583 2.30243 10.9226 2.41624 10.3664 2.8688C9.91637 3.21518 9.62245 3.66456 9.51118 4.19041C8.83114 4.0413 8.09483 4.20757 7.53862 4.66013C7.24725 4.89969 7.0336 5.21697 6.87242 5.53363L4.33315 2.99436C3.47809 2.1393 2.06301 2.05155 1.13579 2.8233C0.606133 3.24932 0.283761 3.88262 0.249587 4.53865C0.215413 5.19469 0.443525 5.84755 0.909921 6.31394L7.62084 13.0249C6.28159 13.1722 5.16727 14.2347 5.04646 15.5474C4.95856 16.309 5.21131 17.0927 5.7289 17.6634C6.22057 18.2081 6.92461 18.5405 7.68492 18.5575C8.20823 18.6561 12.0812 19.3435 13.8078 19.6897C14.6187 19.8634 15.4612 19.591 16.0452 19.0069L23.2393 11.8128C24.195 10.8572 24.24 9.30936 23.2813 8.35066C21.027 6.09641 16.3371 1.40654 16.3371 1.40654C15.4555 0.578027 14.1195 0.463092 13.1929 1.18239ZM22.1669 9.41315C22.5297 9.7759 22.5221 10.4054 22.1504 10.777L14.9829 17.9446C14.7439 18.1835 14.4279 18.2922 14.0879 18.2177C12.2039 17.8734 7.91255 17.0862 7.86009 17.0868C7.80764 17.0874 7.78173 17.0615 7.72927 17.0622C7.36207 17.0666 6.99677 16.9137 6.79012 16.654C6.53101 16.3948 6.43055 16.0289 6.48745 15.6611C6.51718 15.3722 6.67773 15.1081 6.86355 14.9222C7.12902 14.6568 7.49813 14.4949 7.86533 14.4905L9.33414 14.4727C9.64888 14.4689 9.88716 14.2824 10.0218 13.9923C10.1299 13.7288 10.0813 13.4146 9.87397 13.2074L1.91932 5.25272C1.73795 5.07134 1.66212 4.83624 1.69121 4.59986C1.7203 4.36349 1.80185 4.12647 2.01358 3.96656C2.35805 3.67391 2.88199 3.72001 3.21883 4.05685L7.1832 8.02122L7.28684 8.12486L9.48927 10.3273C9.77429 10.6123 10.2464 10.6066 10.5384 10.3146C10.8304 10.0226 10.8361 9.55045 10.5511 9.26543L8.3487 7.063C8.16733 6.88163 8.0915 6.64652 8.12059 6.41014C8.14968 6.17377 8.23122 5.93676 8.44296 5.77684C8.78743 5.4842 9.31137 5.5303 9.64821 5.86714L9.8555 6.07442L11.8247 8.04365C12.1097 8.32867 12.5819 8.32295 12.8739 8.03094C13.1659 7.73893 13.1716 7.26681 12.8866 6.98179L11.021 5.11621C10.8156 4.75155 10.9263 4.27816 11.2701 4.03797C11.6139 3.79778 12.1119 3.81797 12.4488 4.15481L12.7338 4.43983L14.1071 5.81311C14.3921 6.09813 14.8642 6.09241 15.1562 5.8004C15.4482 5.50839 15.454 5.03627 15.1689 4.75125L13.8734 3.4557C13.668 3.09105 13.7787 2.61766 14.1225 2.37747C14.4663 2.13728 14.9644 2.15747 15.3012 2.49431C15.2228 2.46904 19.9127 7.1589 22.1669 9.41315Z\" fill=\"#9D9D9D\"/>\n      </svg></a>\n    ";
  }
  var codeWithoutWrongWidth = ampGoogleMapsCode.replace(/width="auto"|width="100%"/, 'width="300px"');
  return codeWithoutWrongWidth;
}