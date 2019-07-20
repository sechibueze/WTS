"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _debug = _interopRequireDefault(require("debug"));

var _authRoute = _interopRequireDefault(require("./routes/authRoute"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var port = process.env.PORT || 5000;
var logger = (0, _debug["default"])('dev:app');
var app = (0, _express["default"])();
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use(_bodyParser["default"].json()); //import router files

app.use('/api/v1/auth', _authRoute["default"]);
app.use('/api/v1', function (req, res) {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to WTS API'
  });
});
app.listen(port, function () {
  logger("[Server] started on port: ".concat(port));
  console.log("[Server] started on port: ".concat(port));
});
var _default = app;
exports["default"] = _default;