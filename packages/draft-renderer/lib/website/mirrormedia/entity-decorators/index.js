"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.entityDecorators = void 0;
var _annotationDecorator = require("./annotation-decorator");
var _linkDecorator = require("./link-decorator");
var entityDecorators = exports.entityDecorators = {
  annotationDecorator: _annotationDecorator.annotationDecorator,
  linkDecorator: _linkDecorator.linkDecorator
};