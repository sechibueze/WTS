import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import Model from '../models/model';

const { expect } = chai;
chai.use(chaiHttp);

const User = new Model('users');
const Bus = new Model('bus');
const Trip = new Model('trips');
const Booking = new Model('bookings');

//TEMP: 
let user = {},
  bus = {},
  // trip_init = {},
  booking = {
    seat_number: 1
  };

const user_init = {
  first_name: "ekellia",
  last_name: "ekelliay",
  email: "ekellia@ekellia.com",
  password: "ekellia",
  is_admin: true
};

// const login = {
//   email: "ekellia@ekellia.com",
//   password: "ekellia"
// };

const bus_init = {
  "plate_number": "GHI-987-RST",
  "manufacturer": "Volkswagen",
  "model": "L300",
  "year": "2017",
  "capacity": 14
};

let trip_init = {
  // "bus_id": 1, => will be set with returns from bus
  "origin": "Sango",
  "destination": "Oshodi",
  "trip_date": "2019/12/07",
  "fare": 300
}


describe('Register users', () => {
  //Avoid Conflict: Delete ALL before inserting new one
  before((done) => {
    User.delete('* CASCADE').then(r => console.log('Refresh: All existing users deleted'));
    done();
  });
  //register new user
  it('POST signup-user /api/v1/auth/signup', (done) => {

    chai.request(server)
      .post('/api/v1/auth/signup')
      // .set('content-type', 'application/json; charset=utf-8')
      .send(user_init)
      .end((err, res) => {
        console.log('test::signup user response : ', res.body);

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

        //Return the user for use in Login
        user = res.body.data[0];
        user.password = user_init['password'];

        done();
      });

  });

});

describe('Login users', () => {

  it('/POST user-login /api/v1/auth/login', (done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .send({
        email: user.email,
        password: user.password
      })
      .end((err, res) => {
        console.log('test::user-login', res.body);
        //send token to user
        user.token = res.body.data['token'];

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

        console.log('Completed user reg/login for : ', user);
        done();
      });

  });

});



/**** BUS Test */

describe('Register bus for trips', () => {
  //Avoid Conflict: Delete ALL before inserting new one
  // before((done) => {
  //   Bus.delete('*').then(r => console.log('Refresh: All existing bus(es) deleted'));
  //   done();
  // });

  // register a bus for trip
  it('POST register-bus-for-trips /api/v1/bus', (done) => {
    chai.request(server)
      .post('/api/v1/bus')
      .set('Authorization', `Bearer ${user.token}`)
      .send(bus_init)
      .end((err, res) => {
        //console.log('res post', res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res).to.be.json; //content-type header is json
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
        console.log('Bus registered with id: ', res.body.data.bus_id);
        trip_init.bus_id = res.body.data.bus_id;
        done();
      });
  });

});

describe('Fetch All buses for trips', () => {
  //Fetch All buses available for trip
  it('GET fetchAll-buses-for-trips /api/v1/bus', (done) => {
    chai.request(server)
      .get('/api/v1/bus')
      .set('Authorization', `Bearer ${user.token}`)
      // .send(bus)
      .end((err, res) => {

        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;//content-type header is json
        expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(res.body).to.have.property('status').equals('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data').to.be.an('array');

        //Use bus data to create trip
        //trip_init.bus_id = res.body.data[0].bus_id;
        console.log('All buses for trips', res.body);
        done();
      });

  });

});

describe('Register a trip', () => {
  // register a trip
  it('POST admin-create-a-trip /api/v1/trips', (done) => {
    chai.request(server)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${user.token}`)
      .send(trip_init)
      .end((err, res) => {
        console.log('trip init', trip_init);
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

        booking.trip_id = res.body.data.trip_id;
        done();
      });

  });
});

describe('Fetch All trips', () => {
  //Fetch All available trip
  it('GET fetch-All-trips /api/v1/trips', (done) => {
    chai.request(server)
      .get('/api/v1/trips')
      .set('Authorization', `Bearer ${user.token}`)
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
      .set('Authorization', `Bearer ${user.token}`)
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
      .set('Authorization', `Bearer ${user.token}`)
      .send(booking)
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
      .set('Authorization', `Bearer ${user.token}`)
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
