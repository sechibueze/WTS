"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pg = require("pg");

var _db = _interopRequireDefault(require("../db.config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// const logger = debug('dev:model');
var Model =
/*#__PURE__*/
function () {
  function Model(table) {
    _classCallCheck(this, Model);

    //DB connection data is automatically picked from .env
    var connectionString = process.env.DATABASE_URL || _db["default"].dbURL;
    this.pool = new _pg.Pool({
      connectionString: connectionString
    });
    this.table = table;
  }

  _createClass(Model, [{
    key: "select",
    value: function select(fields) {
      var clause = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var query = "SELECT ".concat(fields, " FROM ").concat(this.table, " ").concat(clause); //logger(`${this.table} select query : `, query);

      return this.pool.query(query);
    }
  }, {
    key: "prepareFields",
    value: function prepareFields(arr) {
      var newArr = [];
      arr.forEach(function (val, index) {
        var num = "".concat(index + 1);
        newArr.push('$' + num);
      });
      return newArr.join(', ');
    }
  }, {
    key: "insert",
    value: function insert(fields, values) {
      var clause = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var placeholder = this.prepareFields(values); //Object.keys(fields);

      var query = "INSERT INTO ".concat(this.table, " (").concat(fields, ") VALUES (").concat(placeholder, ") ").concat(clause);
      console.log("".concat(this.table, " insert query : "), query, values);
      return this.pool.query(query, values);
    }
  }, {
    key: "update",
    value: function update(field, value) {
      var constraint = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      //UPDATE customers SET email = 'segoo@gmail.com', status = TRUE WHERE id = 5 RETURNING email;
      var query = "UPDATE ".concat(this.table, " SET ").concat(field, " = '").concat(value, "' ").concat(constraint);
      logger("".concat(this.table, " update query : "), query);
      return this.pool.query(query);
    }
  }, {
    key: "delete",
    value: function _delete(clause) {
      var query = "DELETE FROM ".concat(this.table, " ").concat(clause);
      console.log("".concat(this.table, " delete query : "), query);
      return this.pool.query(query);
    }
  }]);

  return Model;
}();

exports["default"] = Model;