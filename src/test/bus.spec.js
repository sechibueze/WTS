import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import Model from '../models/model';
const Bus = new Model('bus');
const { expect } = chai;
chai.use(chaiHttp);

const bus = {
  number_plate: "ABC-123-XYZ",
  manufacturer: "Toyota",
  model: "camry",
  year: "2015",
  capacity: 14
};

describe('Register & Fetch All buses for trips', () => {
  before((done) => {
    Bus.delete('*').then(r => console.log('Refresh: All existing buses deleted'));
    done();
  });

  //register a bus for trip
  it('POST register-bus-for-trips /api/v1/bus', (done) => {
    chai.request(server)
      .post('/api/v1/bus')
      // .set('content-type', 'application/json; charset=utf-8')
      .send(bus)
      .end((err, res) => {
        console.log('res post', res.body)
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
      });
    done();
  });

  //Fetch All buses available for trip
  it('GET fetchAll-buses-for-trips /api/v1/bus', (done) => {
    chai.request(server)
      .get('/api/v1/bus')
      // .set('content-type', 'application/json; charset=utf-8')
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

      });
    done();
  });

});
