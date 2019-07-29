import express from 'express';
import debug from 'debug';

import Model from '../models/model';
import Auth from '../middleware/Auth';
const logger = debug('dev:bookingsRouter');
const router = express.Router();
const Booking = new Model('bookings');
const User = new Model('users');
const Trip = new Model('trips');

// Users book a seat  Auth.isAdmin,
router.post('/', Auth.isUser, (req, res, next) => {
  let booking = req.body;
  //let trip_date = TO_CHAR(trip_date, 'yyyy/mm/dd');
  const tripData = `trip_id, bus_id, TO_CHAR(trip_date, 'yyyy/mm/dd') AS trip_date, origin, destination, fare`;
  Trip.select(tripData, `WHERE trip_id = ${booking.trip_id} `)
    .then(({ rows }) => {
      const tripRecord = rows[0];

      //copy user data from token(req.headers) into tripRecord
      let bookingRecord = Object.assign(tripRecord, req.userData);
      bookingRecord['seat_number'] = booking['seat_number'];
      //logger('bookingRecord b4', bookingRecord, tripRecord);
      //Remove some unwanted data => unfit for DB
      delete bookingRecord['iat'];
      delete bookingRecord['is_admin'];
      delete bookingRecord['exp'];

      //logger('bookingRecord after4', bookingRecord, tripRecord);
      //prepare for DB
      const fields = Object.keys(bookingRecord).join(', ');
      const values = Object.values(bookingRecord);
      const returns = `RETURNING  * `;

      Booking.insert(fields, values, returns)
        .then(({ rows }) => {
          booking = rows[0];
          res.status(201).json({
            status: 'success',
            message: 'Successfully booked a seat',
            data: booking
          });

        }).catch(e => {
          //forbidden => conflict
          res.status(409).json({
            status: 'error',
            error: 'Failed to book trip'
          });
        });

    })
    .catch(e => {
      res.status(409).json({
        status: 'error',
        error: 'Cannot get trip data for your booking'
      });
    });


});
// //Auth.isUser,
// router.get('/', Auth.isUser, (req, res, next) => {
//   const fields = `trip_id, bus_id, origin, destination, trip_date, state, bus.plate_number, bus.manufacturer, bus.model, fare  `;
//   const clause = 'NATURAL JOIN bus WHERE bus.bus_id = trips.bus_id';
//   Trip.select(fields, clause)
//     .then(({ rows }) => {
//       res.status(200).json({
//         status: 'success',
//         message: 'All trips scheduled',
//         data: rows
//       });
//     }).catch(e => {
//       //forbidden => conflict
//       res.status(404).json({
//         status: 'error',
//         error: 'Failed to fetch trips'
//       });
//     });

//   // });
// });

// router.get('/:trip_id', Auth.isUser, (req, res, next) => {
//   logger('req.params.trip_id : ', req.params.trip_id);
//   const fields = `trip_id, bus_id, origin, destination, trip_date, state, bus.plate_number, bus.manufacturer, bus.model, fare  `;
//   const clause = `NATURAL JOIN bus WHERE trips.trip_id = ${req.params.trip_id}`;

//   Trip.select(fields, clause)
//     .then(({ rows }) => {
//       res.status(200).json({
//         status: 'success',
//         message: `Trip spec/data for ${req.params.trip_id}`,
//         url: `localhost:5000/${req.originalUrl}`,
//         data: rows[0]
//       });
//     }).catch(e => {
//       //forbidden => conflict
//       res.status(409).json({
//         status: 'error',
//         error: 'Failed to get trip'
//       });
//     });

//   // });
// });

// router.patch('/:trip_id', Auth.isAdmin, (req, res, next) => {
//   logger('Update trip : ', req.params.trip_id);
//   let value = '';
//   let trip_id = '';
//   let constraint = '';
//   try {
//     value = req.body['state'];
//     trip_id = req.params['trip_id'];
//     constraint = `WHERE trip_id = ${trip_id} RETURNING *`;
//   } catch{
//     //forbidden => conflict
//     return res.status(409).json({
//       status: 'error',
//       error: 'Failed to update trip : unidentified instance'
//     });
//   }
//   Trip.update('state', value, constraint)
//     .then(({ rows }) => {
//       res.status(200).json({
//         status: 'success',
//         message: `[Update]: updated trip ${req.params.trip_id} successfully`,
//         url: `localhost:5000/${req.originalUrl}`,
//         data: rows[0]
//       });
//     }).catch(e => {
//       //forbidden => conflict
//       res.status(409).json({
//         status: 'error',
//         error: 'Failed to update trip'
//       });
//     });

// });

export default router;