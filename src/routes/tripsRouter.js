import express from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import debug from 'debug';

import Model from '../models/model';
import Auth from '../middleware/Auth';
const logger = debug('dev:tripsRouter');
const router = express.Router();
const Trip = new Model('trips');
// const saltRound = 10;
// Admin  create trips
router.post('/', Auth.isAdmin, (req, res, next) => {
  const trip = req.body;
  const fields = Object.keys(trip).join(', ');
  const values = Object.values(trip);
  const returns = `RETURNING  * `;
  Trip.insert(fields, values, returns)
    .then(({ rows }) => {
      let newTrip = rows[0];
      // newTrip.user_id = 3; //change later
      res.status(201).json({
        status: 'success',
        message: 'Trip created successfully',
        data: rows[0]
      });
    }).catch(e => {
      //forbidden => conflict
      res.status(409).json({
        status: 'error',
        error: 'Failed to create trip'
      });
    });

  // });
});
//Auth.isUser,
router.get('/', Auth.isUser, (req, res, next) => {
  const fields = `trip_id, bus_id, origin, destination, trip_date, state, bus.plate_number, bus.manufacturer, bus.model, fare  `;
  const clause = 'NATURAL JOIN bus WHERE bus.bus_id = trips.bus_id';
  Trip.select(fields, clause)
    .then(({ rows }) => {
      //logger('rows from GET trips', rows);
      res.status(200).json({
        status: 'success',
        message: 'All trips scheduled',
        data: rows
      });
    }).catch(e => {
      //forbidden => conflict
      res.status(404).json({
        status: 'error',
        error: 'Failed to fetch trips'
      });
    });

  // });
});

router.get('/:trip_id', Auth.isUser, (req, res, next) => {
  logger('req.params.trip_id : ', req.params.trip_id);
  const fields = `trip_id, bus_id, origin, destination, trip_date, state, bus.plate_number, bus.manufacturer, bus.model, fare  `;
  const clause = `NATURAL JOIN bus WHERE trips.trip_id = ${req.params.trip_id}`;

  Trip.select(fields, clause)
    .then(({ rows }) => {
      res.status(200).json({
        status: 'success',
        message: `Trip spec/data for ${req.params.trip_id}`,
        url: `localhost:5000/${req.originalUrl}`,
        data: rows[0]
      });
    }).catch(e => {
      //forbidden => conflict
      res.status(409).json({
        status: 'error',
        error: 'Failed to get trip'
      });
    });

  // });
});

router.patch('/:trip_id', Auth.isAdmin, (req, res, next) => {
  logger('Update trip : ', req.params.trip_id);
  let value = '';
  let trip_id = '';
  let constraint = '';
  try {
    value = req.body['state'];
    trip_id = req.params['trip_id'];
    constraint = `WHERE trip_id = ${trip_id} RETURNING *`;
  } catch{
    //forbidden => conflict
    return res.status(409).json({
      status: 'error',
      error: 'Failed to update trip : unidentified instance'
    });
  }
  Trip.update('state', value, constraint)
    .then(({ rows }) => {
      res.status(200).json({
        status: 'success',
        message: `[Update]: updated trip ${req.params.trip_id} successfully`,
        url: `localhost:5000/${req.originalUrl}`,
        data: rows[0]
      });
    }).catch(e => {
      //forbidden => conflict
      res.status(409).json({
        status: 'error',
        error: 'Failed to update trip'
      });
    });

});

export default router;