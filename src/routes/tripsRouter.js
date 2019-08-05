import express from 'express';
import debug from 'debug';

const logger = debug('dev:tripsRouter');
const router = express.Router();

import Model from '../models/model';
import Auth from '../middleware/Auth';
const Trip = new Model('trips');

// Admin can create a trip
router.post('/', Auth.isAdmin, (req, res, next) => {
  const trip = req.body;
  const fields = Object.keys(trip).join(', ');
  const values = Object.values(trip);
  const returns = `RETURNING  * `;
  Trip.insert(fields, values, returns)
    .then(({ rows }) => {
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
});
//Auth.isUser,
router.get('/', Auth.isUser, (req, res, next) => {
  const fields = `trip_id, bus_id, origin, destination, trip_date, state, bus.plate_number, bus.manufacturer, bus.model, fare  `;
  let clause = 'NATURAL JOIN bus WHERE bus.bus_id = trips.bus_id';
  if (req.query.origin) {
    clause = ` ${clause} AND LOWER(origin) = LOWER('${req.query['origin']}')`;
  } else if (req.query.destination) {
    clause = ` ${clause} AND LOWER(destination) = LOWER('${req.query['destination']}')`;
  }
  logger('trip filter: ', clause);
  Trip.select(fields, clause)
    .then(({ rows }) => {
      res.status(200).json({
        status: 'success',
        message: 'All trips scheduled',
        data: rows
      });
    }).catch(e => {
      //forbidden => conflict
      res.status(409).json({
        status: 'error',
        error: 'Failed to fetch trips'
      });
    });

});


router.get('/:trip_id', Auth.isUser, (req, res, next) => {

  const fields = `trip_id, bus_id, origin, destination, trip_date, state, bus.plate_number, bus.manufacturer, bus.model, fare  `;
  const clause = `NATURAL JOIN bus WHERE trips.trip_id = ${req.params.trip_id}`;

  Trip.select(fields, clause)
    .then(({ rows }) => {
      res.status(200).json({
        status: 'success',
        message: `Trip data`,
        url: `get from bus route`,
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
  let value = '',
    trip_id = '',
    constraint = '';
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