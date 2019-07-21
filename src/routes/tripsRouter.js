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
      newTrip.user_id = 3; //change later
      res.status(201).json({
        status: 'success',
        message: 'Trip created successfully',
        data: newTrip
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

router.get('/', (req, res, next) => {

  let clause = '';
  const fields = `trip_id, origin `;

  Bus.select(fields, clause)
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

  // });
});

router.get('/:trip_id', (req, res, next) => {

  let clause = '';
  const fields = `trip_id`;
  logger('req.params.trip_id : ', req.params.trip_id)
  if (req.params.trip_id) {
    clause = `WHERE trip_id = ${req.params.trip_id}`;
  }
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

export default router;