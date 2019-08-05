import express from 'express';
import debug from 'debug';

const router = express.Router();
const logger = debug('dev:bookingsRouter');

import Model from '../models/model';
import Auth from '../middleware/Auth';
const Booking = new Model('bookings');
const User = new Model('users');
const Trip = new Model('trips');

// Users can book a seat 
router.post('/', Auth.isUser, (req, res, next) => {
  let booking = req.body;
  // let trip_date = TO_CHAR(trip_date, 'yyyy/mm/dd'); format
  // change date-time-stamp to YYYY-MM-DD
  const tripDataRequest = `trip_id, bus_id, TO_CHAR(trip_date, 'yyyy/mm/dd') AS trip_date, origin, destination, fare`;
  Trip.select(tripDataRequest, `WHERE trip_id = ${booking.trip_id}`)
    .then(({ rows }) => {
      const tripRecord = rows[0];
      //copy user data from token(req.headers) into tripRecord
      //req.userData is passed from Auth middleware
      let bookingRecord = Object.assign(tripRecord, req.userData);
      bookingRecord['seat_number'] = booking['seat_number'];

      //Remove some unwanted data => unfit for DB
      delete bookingRecord['iat'];
      delete bookingRecord['is_admin'];
      delete bookingRecord['exp'];

      //prepare for DB
      const fields = Object.keys(bookingRecord).join(', ');
      const values = Object.values(bookingRecord);
      const returns = `RETURNING  * `;//everything

      Booking.insert(fields, values, returns)
        .then(({ rows }) => {
          booking = rows[0];
          res.status(201).json({
            status: 'success',
            message: 'Successfully booked a seat',
            data: booking
          });
        }).catch(e => {
          //Conflict
          res.status(409).json({
            status: 'error',
            error: 'Failed to book trip'
          });
        });
    })
    .catch(e => {
      res.status(405).json({
        status: 'error',
        error: 'Method Not Allowed: Cannot get trip data for your booking'
      });
    });
});

// Users can view ONLY their bookings while Admin can view ALL bookings
router.get('/', Auth.isUser, (req, res, next) => {

  let clause = req.userData.is_admin === false
    ? `WHERE user_id = ${req.userData.user_id}` : '';

  Booking.select('*', clause)
    .then(({ rows }) => {
      // let results = rows.length === 0 ? `No Bookings yet` : rows;
      res.status(200).json({
        status: 'success',
        message: 'All your bookings so far',
        data: rows
      });
    }).catch(e => {
      //Not Found
      res.status(404).json({
        status: 'error',
        error: 'Failed to fetch bookings'
      });
    });

});

//Users can delete their bookings
router.delete('/:booking_id', Auth.isUser, (req, res, next) => {
  logger('DELETE /bookings req.params.booking_id : ', req.params.booking_id);

  let clause = `WHERE user_id = ${req.userData.user_id} AND booking_id = ${req.params.booking_id}`;

  Booking.delete(clause)
    .then(({ rows }) => {
      res.status(200).json({
        status: 'success',
        message: `Deleted booking successfully `,
        data: rows
      });
    }).catch(e => {
      //forbidden => conflict
      res.status(409).json({
        status: 'error',
        error: 'Failed to delete booking'
      });
    });

});

export default router;