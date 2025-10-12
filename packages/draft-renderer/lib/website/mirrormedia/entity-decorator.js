"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _draftJs = require("draft-js");
require("./entity-decorator");
var _entityDecorators = require("./entity-decorators");
var annotationDecorator = _entityDecorators.entityDecorators.annotationDecorator,
  linkDecorator = _entityDecorators.entityDecorators.linkDecorator;
var decoratorsGenerator = function decoratorsGenerator() {
  var contentLayout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'normal';
  return new _draftJs.CompositeDecorator([annotationDecorator(contentLayout), linkDecorator(contentLayout)]);
};
var _default = exports["default"] = decoratorsGenerator;