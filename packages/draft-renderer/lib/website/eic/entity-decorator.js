"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _draftJs = require("draft-js");
var _entityDecorators = require("./entity-decorators");
var annotationDecorator = _entityDecorators.entityDecorators.annotationDecorator,
  linkDecorator = _entityDecorators.entityDecorators.linkDecorator;
var decorators = new _draftJs.CompositeDecorator([annotationDecorator, linkDecorator]);
var _default = exports["default"] = decorators;