"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _model = _interopRequireDefault(require("../models/model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

var User = new _model["default"]('users');
var saltRound = 10;
router.post('/signup', function (req, res, next) {
  var user = req.body;

  _bcrypt["default"].hash(user.password, saltRound, function (err, hash) {
    user.password = hash;
    var fields = Object.keys(user).join(', ');
    var values = Object.values(user);
    var returns = "RETURNING  user_id, first_name, last_name, email, is_admin";
    User.insert(fields, values, returns).then(function (_ref) {
      var rows = _ref.rows;
      res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: rows
      });
    })["catch"](function (e) {
      //forbidden => conflict
      res.status(409).json({
        status: 'error',
        error: 'Failed to create user, confirm that you have not been registered'
      });
    });
  });
});
var _default = router;
exports["default"] = _default;