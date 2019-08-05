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
  first_name: "ekellia",
  last_name: "ekelliay",
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
        console.log('GET fetch-All-trips /api/v1/trips DATA', res.body)
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

describe('Update set status [active/cancel] for trip', () => {
  // register a bus for trip
  it('PATCH update-cancel/active-trips /api/v1/trips', (done) => {
    chai.request(server)
      .patch('/api/v1/trips/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ state: 'cancelled' })

      .end((err, res) => {
        console.log('PATCH update-cancel/active-trips /api/v1/bus', res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;//content-type header is json
        expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(res.body).to.have.property('status').equals('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data').to.be.an('object');
        expect(res.body.data).to.have.property('state').equals('cancelled');
        done();
      });
  });

});

/**** Bookings  */
describe('POST users-book-seat /api/v1/bookings', () => {
  it('Users can book a seat on a trip', (done) => {
    chai
      .request(server)
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user_id: 1,
        trip_id: 1,
        seat_number: 10
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res).to.be.json;//content-type header is json
        expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(res.body).to.have.property('status').equals('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data').to.be.an('object');

        expect(res.body.data).to.have.property('booking_id');
        expect(res.body.data).to.have.property('user_id');
        expect(res.body.data).to.have.property('trip_id');
        expect(res.body.data).to.have.property('bus_id');
        expect(res.body.data).to.have.property('trip_date');
        expect(res.body.data).to.have.property('seat_number');
        expect(res.body.data).to.have.property('first_name');
        expect(res.body.data).to.have.property('last_name');
        expect(res.body.data).to.have.property('email');

        done();
      });
  });
});

// // Users can see their bookings while Admin can see All Boolings
describe('GET see-bookings /api/v1/bookings', () => {
  it('GET an array of bookings for user/admin', (done) => {
    chai.request(server)
      .get('/api/v1/bookings')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        expect(res.body).to.have.property('status').to.equal('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');

        expect(res.body.data[0]).to.have.property('booking_id');
        expect(res.body.data[0]).to.have.property('user_id');
        expect(res.body.data[0]).to.have.property('trip_id');
        expect(res.body.data[0]).to.have.property('bus_id');
        expect(res.body.data[0]).to.have.property('trip_date');
        expect(res.body.data[0]).to.have.property('seat_number');
        expect(res.body.data[0]).to.have.property('first_name');
        expect(res.body.data[0]).to.have.property('last_name');
        expect(res.body.data[0]).to.have.property('email');

        done();
      });
  });
});

// // Users can delete their bookings
// describe('DELETE user-booking /api/v1/bookings/:booking_id', () => {
//   it('GET an array of bookings for user/admin', (done) => {
//     chai.request(server)
//       .delete('/api/v1/bookings/:booking_id')
//       .set('Authorization', `Bearer ${token}`)
//       .end((err, res) => {
//         expect(err).to.be.null;
//         expect(res).to.be.json;
//         expect(res).to.have.status(200);

//         expect(res.body).to.have.property('status').to.equal('success');
//         expect(res.body).to.have.property('message');

//         done();
//       });
//   });
// });