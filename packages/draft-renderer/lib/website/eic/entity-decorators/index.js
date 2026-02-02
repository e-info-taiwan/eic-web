"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.entityDecorators = void 0;
var _annotationDecorator = require("./annotation-decorator");
var _emailDecorator = require("./email-decorator");
var _footnoteDecorator = require("./footnote-decorator");
var _linkDecorator = require("./link-decorator");
var entityDecorators = exports.entityDecorators = {
  annotationDecorator: _annotationDecorator.annotationDecorator,
  emailDecorator: _emailDecorator.emailDecorator,
  footnoteDecorator: _footnoteDecorator.footnoteDecorator,
  linkDecorator: _linkDecorator.linkDecorator
};