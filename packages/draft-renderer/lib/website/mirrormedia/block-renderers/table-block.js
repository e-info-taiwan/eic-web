"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableEditorBlock = exports.TableBlock = void 0;
var _react = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _draftJs = require("draft-js");
var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var _ = {
  cloneDeep: _cloneDeep["default"]
};
var ActionType = /*#__PURE__*/function (ActionType) {
  ActionType["Insert"] = "insert";
  ActionType["Delete"] = "delete";
  ActionType["Update"] = "update";
  return ActionType;
}(ActionType || {});
var TableEnum = /*#__PURE__*/function (TableEnum) {
  TableEnum["Row"] = "row";
  TableEnum["Column"] = "column";
  return TableEnum;
}(TableEnum || {});
function createEmptyRow() {
  var colLen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var emptyValue = arguments.length > 1 ? arguments[1] : undefined;
  var rtn = [];
  for (var i = 0; i < colLen; i++) {
    rtn.push(emptyValue);
  }
  return rtn;
}
function resolveTableStyles(action, tableStyles) {
  switch (action === null || action === void 0 ? void 0 : action.type) {
    case ActionType.Insert:
      {
        if (action.target === TableEnum.Row) {
          var rows = [].concat(_toConsumableArray(tableStyles.rows.slice(0, action.index)), [{}], _toConsumableArray(tableStyles.rows.slice(action.index)));
          return Object.assign({}, tableStyles, {
            rows: rows
          });
        }
        // TODO: handle target === TableEnum.Column if needed
        return tableStyles;
      }
    case ActionType.Delete:
      {
        if (action.target === TableEnum.Row) {
          var _rows = [].concat(_toConsumableArray(tableStyles.rows.slice(0, action.index)), _toConsumableArray(tableStyles.rows.slice(action.index + 1)));
          return Object.assign({}, tableStyles, {
            rows: _rows
          });
        }
        // TODO: handle target === TableEnum.Column if needed
        return tableStyles;
      }
    // TODO: handle action.type === ActionType.Update if needed
    default:
      {
        return tableStyles;
      }
  }
}
function resolveTableData(action, tableData) {
  switch (action === null || action === void 0 ? void 0 : action.type) {
    case ActionType.Insert:
      {
        var _tableData$;
        if (typeof (action === null || action === void 0 ? void 0 : action.index) !== 'number') {
          return tableData;
        }
        if ((action === null || action === void 0 ? void 0 : action.target) === TableEnum.Column) {
          // add the new column at specific position in each row
          return tableData.map(function (r) {
            return [].concat(_toConsumableArray(r.slice(0, action === null || action === void 0 ? void 0 : action.index)), [_draftJs.EditorState.createEmpty()], _toConsumableArray(r.slice(action === null || action === void 0 ? void 0 : action.index)));
          });
        }
        // add the new row
        return [].concat(_toConsumableArray(tableData.slice(0, action === null || action === void 0 ? void 0 : action.index)), [createEmptyRow(tableData === null || tableData === void 0 || (_tableData$ = tableData[0]) === null || _tableData$ === void 0 ? void 0 : _tableData$.length, _draftJs.EditorState.createEmpty())], _toConsumableArray(tableData.slice(action === null || action === void 0 ? void 0 : action.index)));
      }
    case ActionType.Delete:
      {
        if (typeof (action === null || action === void 0 ? void 0 : action.index) !== 'number') {
          return tableData;
        }
        if ((action === null || action === void 0 ? void 0 : action.target) === 'column') {
          // delete the column at specific position in each row
          return tableData.map(function (r) {
            return [].concat(_toConsumableArray(r.slice(0, action.index)), _toConsumableArray(r.slice(action.index + 1)));
          });
        }
        // delete the column
        return [].concat(_toConsumableArray(tableData.slice(0, action.index)), _toConsumableArray(tableData.slice(action.index + 1)));
      }
    case ActionType.Update:
      {
        // The reason we copy the array is to make sure
        // that React component re-renders.
        var copiedData = _toConsumableArray(tableData);
        if (typeof (action === null || action === void 0 ? void 0 : action.rIndex) !== 'number' || typeof (action === null || action === void 0 ? void 0 : action.cIndex) !== 'number') {
          return copiedData;
        }
        copiedData[action.rIndex][action.cIndex] = action === null || action === void 0 ? void 0 : action.value;
        return copiedData;
      }
    default:
      {
        return tableData;
      }
  }
}
function convertTableDataFromRaw(rawTableData) {
  return rawTableData.map(function (rowData) {
    return rowData.map(function (colData) {
      var contentState = (0, _draftJs.convertFromRaw)(colData);
      return _draftJs.EditorState.createWithContent(contentState);
    });
  });
}
function convertTableDataToRaw(tableData) {
  return tableData.map(function (rowData) {
    return rowData.map(function (colData) {
      return (0, _draftJs.convertToRaw)(colData.getCurrentContent());
    });
  });
}
var Table = _styledComponents["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: table;\n  width: 95%;\n  border-collapse: collapse;\n"])));
var Tr = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  display: table-row;\n"])));
var Td = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: table-cell;\n  border-width: 1px;\n  min-width: 100px;\n  min-height: 40px;\n  padding: 10px;\n"])));
var StyledFirstRow = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  display: table-row;\n  height: 10px;\n\n  div {\n    display: table-cell;\n    position: relative;\n  }\n\n  span {\n    cursor: pointer;\n    line-height: 10px;\n  }\n\n  span:first-child {\n    position: absolute;\n    right: 50%;\n    transform: translateX(50%);\n  }\n\n  span:first-child:before {\n    content: '\u2022';\n  }\n\n  span:first-child:hover:before {\n    content: '\u2796';\n  }\n\n  span:last-child {\n    position: absolute;\n    right: -5px;\n  }\n\n  span:last-child:before {\n    content: '\u2022';\n  }\n\n  span:last-child:hover:before {\n    content: '\u2795';\n  }\n"])));
var StyledFirstColumn = _styledComponents["default"].div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  display: table-cell;\n  width: 10px;\n  position: relative;\n\n  span {\n    cursor: pointer;\n  }\n\n  span:first-child {\n    position: absolute;\n    bottom: 50%;\n    right: 0px;\n    transform: translateY(50%);\n  }\n\n  span:first-child:before {\n    content: '\u2022';\n  }\n\n  span:first-child:hover:before {\n    content: '\u2796';\n  }\n\n  span:last-child {\n    position: absolute;\n    bottom: -10px;\n    right: 0px;\n  }\n\n  span:last-child:before {\n    content: '\u2022';\n  }\n\n  span:last-child:hover:before {\n    content: '\u2795';\n  }\n"])));
var TableBlockContainer = _styledComponents["default"].div(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  margin: 15px 0;\n  position: relative;\n  overflow: scroll;\n  padding: 15px;\n"])));
var StyledTable = _styledComponents["default"].div(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  display: table;\n  width: 95%;\n  border-collapse: collapse;\n"])));
var StyledTr = _styledComponents["default"].div(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n  display: table-row;\n"])));
var StyledTd = _styledComponents["default"].div(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n  display: table-cell;\n  border: 1px solid #e1e5e9;\n  min-width: 100px;\n  min-height: 40px;\n  padding: 10px;\n"])));
var TableEditorBlock = exports.TableEditorBlock = function TableEditorBlock(props) {
  var _tableData$2;
  var block = props.block,
    blockProps = props.blockProps,
    contentState = props.contentState;
  var onEditStart = blockProps.onEditStart,
    onEditFinish = blockProps.onEditFinish,
    getMainEditorReadOnly = blockProps.getMainEditorReadOnly;
  var entityKey = block.getEntityAt(0);
  var entity = contentState.getEntity(entityKey);
  var _entity$getData = entity.getData(),
    rawTableData = _entity$getData.tableData,
    _tableStyles = _entity$getData.tableStyles;
  var _useState = (0, _react.useState)(convertTableDataFromRaw(rawTableData)),
    _useState2 = _slicedToArray(_useState, 2),
    tableData = _useState2[0],
    setTableData = _useState2[1];
  // deep clone `_tableStyles` to prevent updating the entity data directly
  var _useState3 = (0, _react.useState)(_.cloneDeep(_tableStyles)),
    _useState4 = _slicedToArray(_useState3, 2),
    tableStyles = _useState4[0],
    setTableStyles = _useState4[1];
  var tableRef = (0, _react.useRef)(null);

  // `TableBlock` will render other inner/nested DraftJS Editors inside the main Editor.
  // However, main Editor's `readOnly` needs to be mutually exclusive with nested Editors' `readOnly`.
  // If the main Editor and nested Editor are editable (`readOnly={false}`) at the same time,
  // there will be a DraftJS Edtior Selection bug.
  var _useState5 = (0, _react.useState)(!getMainEditorReadOnly()),
    _useState6 = _slicedToArray(_useState5, 2),
    cellEditorReadOnly = _useState6[0],
    setCellEditorReadOnly = _useState6[1];

  // The user clicks the table for editing
  var onTableClick = function onTableClick() {
    // call `onEditStart` function to tell the main DraftJS Editor
    // that we are going to interact with the custom atomic block.
    onEditStart();

    // make nested DraftJS Editors editable
    setCellEditorReadOnly(false);
  };
  (0, _react.useEffect)(function () {
    // The user clicks other places except the table,
    // so we think he/she doesn't want to edit the table anymore.
    // Therefore, we call `onEditFinish` function to pass modified table data
    // back to the main DraftJS Edtior.
    function handleClickOutside(event) {
      // `!cellEditorReadOnly` condition is needed.
      //  If there are two tables in the main Editor,
      //  this `handleClickOutside` will only handle the just updated one.
      if (tableRef.current && !tableRef.current.contains(event.target) && !cellEditorReadOnly) {
        // make inner DraftJS Editors NOT editable
        setCellEditorReadOnly(true);

        // call `onEditFinish` function tell the main DraftJS Editor
        // that we are finishing interacting with the custom atomic block.
        onEditFinish({
          entityKey: entityKey,
          entityData: {
            tableData: convertTableDataToRaw(tableData),
            tableStyles: tableStyles
          }
        });
      }
    }
    console.debug('(rich-text-editor/table): add click outside event listener');
    document.addEventListener('mousedown', handleClickOutside);
    return function () {
      // Unbind the event listener on clean up
      console.debug('(rich-text-editor/table): remove click outside event listener');
      document.removeEventListener('mousedown', handleClickOutside);
    };
  },
  // Skip running effect if `tableData` and `cellEditorReadOnly` are not changed.
  [tableData, cellEditorReadOnly]);
  return /*#__PURE__*/_react["default"].createElement(TableBlockContainer, null, /*#__PURE__*/_react["default"].createElement(Table, {
    key: entityKey,
    onClick: onTableClick,
    ref: tableRef
  }, /*#__PURE__*/_react["default"].createElement(StyledFirstRow, null, /*#__PURE__*/_react["default"].createElement("div", null), tableData === null || tableData === void 0 || (_tableData$2 = tableData[0]) === null || _tableData$2 === void 0 ? void 0 : _tableData$2.map(function (colData, cIndex) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      key: "col_".concat(cIndex + 1)
    }, /*#__PURE__*/_react["default"].createElement("span", {
      onClick: function onClick() {
        var deleteColumn = {
          type: ActionType.Delete,
          target: TableEnum.Column,
          index: cIndex
        };
        var updatedTableData = resolveTableData(deleteColumn, tableData);
        setTableData(updatedTableData);
      }
    }), /*#__PURE__*/_react["default"].createElement("span", {
      onClick: function onClick() {
        var insertColumn = {
          type: ActionType.Insert,
          target: TableEnum.Column,
          index: cIndex + 1
        };
        var updatedTableData = resolveTableData(insertColumn, tableData);
        setTableData(updatedTableData);
      }
    }));
  })), tableData.map(function (rowData, rIndex) {
    var _tableStyles$rows;
    var colsJsx = rowData.map(function (colData, cIndex) {
      return /*#__PURE__*/_react["default"].createElement(Td, {
        key: "col_".concat(cIndex)
      }, /*#__PURE__*/_react["default"].createElement(_draftJs.Editor, {
        onChange: function onChange(editorState) {
          var updateAction = {
            type: ActionType.Update,
            cIndex: cIndex,
            rIndex: rIndex,
            value: editorState
          };
          var updatedTableData = resolveTableData(updateAction, tableData);
          setTableData(updatedTableData);
        },
        editorState: colData,
        readOnly: cellEditorReadOnly
      }));
    });
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, {
      key: "row_".concat(rIndex)
    }, /*#__PURE__*/_react["default"].createElement(Tr, {
      style: tableStyles === null || tableStyles === void 0 || (_tableStyles$rows = tableStyles.rows) === null || _tableStyles$rows === void 0 ? void 0 : _tableStyles$rows[rIndex]
    }, /*#__PURE__*/_react["default"].createElement(StyledFirstColumn, null, /*#__PURE__*/_react["default"].createElement("span", {
      onClick: function onClick() {
        var deleteRowAction = {
          type: ActionType.Delete,
          target: TableEnum.Row,
          index: rIndex
        };
        var updatedTableData = resolveTableData(deleteRowAction, tableData);
        setTableData(updatedTableData);
        setTableStyles(resolveTableStyles(deleteRowAction, tableStyles));
      }
    }), /*#__PURE__*/_react["default"].createElement("span", {
      onClick: function onClick() {
        var addRowAction = {
          type: ActionType.Insert,
          target: TableEnum.Row,
          index: rIndex + 1
        };
        var updatedTableData = resolveTableData(addRowAction, tableData);
        setTableData(updatedTableData);
        setTableStyles(resolveTableStyles(addRowAction, tableStyles));
      }
    })), colsJsx));
  })));
};
var TableBlock = exports.TableBlock = function TableBlock(props) {
  var block = props.block,
    contentState = props.contentState;
  var entityKey = block.getEntityAt(0);
  var entity = contentState.getEntity(entityKey);
  var _entity$getData2 = entity.getData(),
    rawTableData = _entity$getData2.tableData;
  var _useState7 = (0, _react.useState)(convertTableDataFromRaw(rawTableData)),
    _useState8 = _slicedToArray(_useState7, 1),
    tableData = _useState8[0];
  var tableRef = (0, _react.useRef)(null);
  return /*#__PURE__*/_react["default"].createElement(TableBlockContainer, null, /*#__PURE__*/_react["default"].createElement(StyledTable, {
    key: entityKey,
    ref: tableRef
  }, tableData.map(function (rowData, rIndex) {
    var colsJsx = rowData.map(function (colData, cIndex) {
      return /*#__PURE__*/_react["default"].createElement(StyledTd, {
        key: "col_".concat(cIndex)
      }, /*#__PURE__*/_react["default"].createElement(_draftJs.Editor, {
        editorState: colData,
        readOnly: true
      }));
    });
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, {
      key: "row_".concat(rIndex)
    }, /*#__PURE__*/_react["default"].createElement(StyledTr, null, colsJsx));
  })));
};