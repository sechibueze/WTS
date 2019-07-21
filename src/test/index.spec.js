import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import Model from '../models/model';
const User = new Model('users');
// const Bus = new Model('bus');
const { expect } = chai;
chai.use(chaiHttp);

const user = {
  first_name: "ekellia",
  last_name: "ekelliay",
  email: "ekellia@ekellia.com",
  password: "ekellia",
  is_admin: true
};

const login = {
  email: "ekellia@ekellia.com",
  password: "ekellia"
};


// const bus = {
//   number_plate: "ABC-123-XYZ",
//   manufacturer: "Toyota",
//   model: "camry",
//   year: "2015",
//   capacity: 14
// };

// const trip = {
//   "bus_id": 1,
//   "origin": "Sango",
//   "destination": "Oshodi",
//   "trip_date": "2019/12/07",
//   "fare": 300
// };

before((done) => {
  User.delete('*').then(r => console.log('Refresh: All existing users deleted'));
  done();
});
// //Register and login user
describe('Register users', () => {


  //register new user
  it('POST signup-user /api/v1/auth/signup', (done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      // .set('content-type', 'application/json; charset=utf-8')
      .send(user)
      .end((err, res) => {
        console.log('test::signup user', res.body)
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

describe('Login users', () => {

  it('/POST user-login /api/v1/auth/login', (done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .send(login)
      .end((err, res) => {
        console.log('test::user-login', res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;//content-type header is json
        expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(res.body).to.have.property('status').equals('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data').to.be.an('object');
        expect(res.body.data).to.have.property('first_name'); //.contain('first_name');
        expect(res.body.data).to.have.property('last_name');
        expect(res.body.data).to.have.property('email');
        expect(res.body.data).to.have.property('token');
        expect(res.body.data).to.have.property('is_admin');
        expect(res.body.data).to.not.have.property('password');
        done();
      });

  });

});
//   //register a trip
//   it('POST register-a-trip /api/v1/trips', (done) => {
//     chai.request(server)
//       .post('/api/v1/trips')
//       // .set('content-type', 'application/json; charset=utf-8')
//       .send(trip)
//       .end((err, res) => {
//         console.log('res post', res.body)
//         expect(err).to.be.null;
//         expect(res).to.have.status(201);
//         expect(res).to.be.json;//content-type header is json
//         expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
//         expect(res.body).to.have.property('status').equals('success');
//         expect(res.body).to.have.property('message');
//         expect(res.body).to.have.property('data').to.be.an('object');

//         expect(res.body.data).to.have.property('user_id'); //.contain('first_name');
//         expect(res.body.data).to.have.property('bus-id');
//         expect(res.body.data).to.have.property('trip_id');
//         expect(res.body.data).to.have.property('origin');
//         expect(res.body.data).to.have.property('destination');
//         expect(res.body.data).to.have.property('fare');
//         expect(res.body.data).to.have.property('trip_date');

//       });
//     done();
//   });
// });