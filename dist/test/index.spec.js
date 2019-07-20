"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _app = _interopRequireDefault(require("../app"));

var _model = _interopRequireDefault(require("../models/model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var User = new _model["default"]('users');
var expect = _chai["default"].expect;

_chai["default"].use(_chaiHttp["default"]);

var user = {
  first_name: "ekellia",
  last_name: "ekelliay",
  email: "ekellia@ekellia.com",
  password: "ekellia"
};
var login = {
  email: "ekellia@ekellia.com",
  password: "ekellia"
};
describe('register and login users', function () {
  beforeEach(function (done) {
    User["delete"]('*').then(function (r) {
      return console.log('users deleted');
    });
    done();
  }); //register new user

  it('POST signup-user /api/v1/auth/signup', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/signup') // .set('content-type', 'application/json; charset=utf-8')
    .send(user).end(function (err, res) {
      console.log('res post', res.body);
      expect(err).to.be["null"];
      expect(res).to.have.status(201);
      expect(res).to.be.json; //content-type header is json

      expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
      expect(res.body).to.have.property('status').equals('success');
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('data').to.be.an('array');
      expect(res.body.data[0]).to.have.property('first_name'); //.contain('first_name');

      expect(res.body.data[0]).to.have.property('last_name');
      expect(res.body.data[0]).to.have.property('email');
      expect(res.body.data[0]).to.have.property('is_admin');
      expect(res.body.data[0]).to.not.have.property('password'); //dont't return password 

      done();
    });
  });
});
describe('/POST api/v1/auth/signup', function () {});