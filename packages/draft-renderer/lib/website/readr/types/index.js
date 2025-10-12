"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidPostContentType = void 0;
var ValidPostStyle = /*#__PURE__*/function (ValidPostStyle) {
  ValidPostStyle["NEWS"] = "news";
  ValidPostStyle["FRAME"] = "frame";
  ValidPostStyle["BLANK"] = "blank";
  ValidPostStyle["REPORT"] = "report";
  ValidPostStyle["PROJECT3"] = "project3";
  ValidPostStyle["EMBEDDED"] = "embedded";
  ValidPostStyle["REVIEW"] = "review";
  ValidPostStyle["MEMO"] = "memo";
  ValidPostStyle["DUMMY"] = "dummy";
  ValidPostStyle["CARD"] = "card";
  ValidPostStyle["QA"] = "qa";
  ValidPostStyle["SCROLLABLE_VIDEO"] = "scrollablevideo";
  return ValidPostStyle;
}(ValidPostStyle || {});
var ValidPostContentType = exports.ValidPostContentType = /*#__PURE__*/function (ValidPostContentType) {
  ValidPostContentType["SUMMARY"] = "summary";
  ValidPostContentType["NORMAL"] = "normal";
  ValidPostContentType["ACTIONLIST"] = "actionlist";
  ValidPostContentType["CITATION"] = "citation";
  return ValidPostContentType;
}({});