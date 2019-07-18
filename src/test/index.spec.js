import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

const { expect } = chai;
chai.use(chaiHttp);

describe('GET ./ home-page', () => {
  it('should return status code of 200', (done) => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {

        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('status').to.equals('success');
        expect(res.body).to.have.property('message');
        done();
      });

  });
});

describe('/POST /auth/signup', () => {
  it('user must set first_name, last_name, email, password', (done) => {
    const user = {
      first_name: "sam",
      last_name: "samy",
      email: "sam@sam.com",
      password: "sam",
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .set('content-type', 'application/json')
      .send(user)
      .end((err, res) => {
        console.log('res post', res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res).to.be.json;//content-type header is json
        expect(res).to.have.header('content-type', 'application/json');
        expect(res.body).to.have.property('status').equals('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data').contain('first_name');
        expect(res.body).to.have.property('data').contain('last_name');
        expect(res.body).to.have.property('data').contain('email');
        expect(res.body.data).to.not.have.property('password'); //dont't return password 

        done();
      });

  });
});