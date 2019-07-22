import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import server from '../app';
// import Model from '../models/model';
// const Trip = new Model('trips');
const { expect } = chai;
chai.use(chaiHttp);

const bus = {
  plate_number: "ABC-123-XYZp",
  manufacturer: "Toyota",
  model: "camry",
  year: "2015",
  capacity: 14
};

const trip = {
  "bus_id": 1,
  "origin": "Sango",
  "destination": "Oshodi",
  "trip_date": "2019/12/07",
  "fare": 300
}
const payload = {
  user_id: 10,
  email: "ekellia@ekellia.com",
  is_admin: true
};
const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
console.log('token : ', token);
/**** BUS Test */

describe('Register bus for trips', () => {
  // register a bus for trip
  it('POST register-bus-for-trips /api/v1/bus', (done) => {
    chai.request(server)
      .post('/api/v1/bus')
      .set('Authorization', `Bearer ${token}`)
      .send(bus)
      .end((err, res) => {
        //console.log('res post', res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res).to.be.json;//content-type header is json
        expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(res.body).to.have.property('status').equals('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data').to.be.an('object');
        expect(res.body.data).to.have.property('plate_number'); //.contain('first_name');
        expect(res.body.data).to.have.property('manufacturer');
        expect(res.body.data).to.have.property('bus_id');
        expect(res.body.data).to.have.property('capacity');
        expect(res.body.data).to.have.property('year');
        expect(res.body.data).to.have.property('model');
        done();
      });
  });

});

describe('Fetch All buses for trips', () => {
  //Fetch All buses available for trip
  it('GET fetchAll-buses-for-trips /api/v1/bus', (done) => {
    chai.request(server)
      .get('/api/v1/bus')
      .set('Authorization', `Bearer ${token}`)
      // .send(bus)
      .end((err, res) => {
        // console.log('res post', res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;//content-type header is json
        expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(res.body).to.have.property('status').equals('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data').to.be.an('array');
        done();
      });

  });

});

describe('Register a trip', () => {
  // register a trip
  it('POST admin-create-a-trip /api/v1/trips', (done) => {
    chai.request(server)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${token}`)
      .send(trip)
      .end((err, res) => {
        console.log('test => admin:create-trip', res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res).to.be.json;//content-type header is json
        expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(res.body).to.have.property('status').equals('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data').to.be.an('object');

        // expect(res.body.data).to.have.property('user_id'); //.contain('first_name');
        expect(res.body.data).to.have.property('bus_id');
        expect(res.body.data).to.have.property('trip_id');
        expect(res.body.data).to.have.property('origin');
        expect(res.body.data).to.have.property('destination');
        expect(res.body.data).to.have.property('fare');
        expect(res.body.data).to.have.property('trip_date');
        done();
      });

  });
});

describe('Fetch All trips', () => {
  //Fetch All available trip
  it('GET fetch-All-trips /api/v1/trips', (done) => {
    chai.request(server)
      .get('/api/v1/trips')
      .set('Authorization', `Bearer ${token}`)
      // .send(bus)
      .end((err, res) => {
        // console.log('res post', res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;//content-type header is json
        expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(res.body).to.have.property('status').equals('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data').to.be.an('array');
        done();
      });

  });

});
