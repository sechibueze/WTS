import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import Model from '../models/model';
const User = new Model('users');
const { expect } = chai;
chai.use(chaiHttp);

const user = {
  first_name: "ekellia",
  last_name: "ekelliay",
  email: "ekellia@ekellia.com",
  password: "ekellia"
};
'
const login = {
  email: "ekellia@ekellia.com",
  password: "ekellia"
};


describe('register and login users', () => {
  beforeEach((done) => {
    User.delete('*').then(r => console.log('users deleted'));
    done();
  });

  //register new user
  it('POST signup-user /api/v1/auth/signup', (done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      // .set('content-type', 'application/json; charset=utf-8')
      .send(user)
      .end((err, res) => {
        console.log('res post', res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res).to.be.json;//content-type header is json
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

describe('/POST api/v1/auth/signup', () => {

});