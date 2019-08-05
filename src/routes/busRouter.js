import express from 'express';
import debug from 'debug';

const router = express.Router();
const logger = debug('dev:busRouter');


import Model from '../models/model';
import Auth from '../middleware/Auth';
const Bus = new Model('bus');

const capacityToSeat = (capacity) => {
  return [...Array(capacity).keys()];
}
router.post('/', Auth.isAdmin, (req, res, next) => {
  let bus = req.body;
  bus.seats = `{ ${capacityToSeat(bus.capacity + 1)} }`;
  logger('new bus: ', bus);
  const fields = Object.keys(bus).join(', ');
  const values = Object.values(bus);
  const returns = `RETURNING bus_id, plate_number, manufacturer, model, year, capacity, seats`;
  Bus.insert(fields, values, returns)
    .then(({ rows }) => {
      res.status(201).json({
        status: 'success',
        message: 'Bus created successfully',
        data: rows[0]
      });
    }).catch(e => {
      //forbidden => conflict
      res.status(409).json({
        status: 'error',
        error: 'Failed to add a bus for trip'
      });
    });

});

router.get('/', Auth.isAdmin, (req, res, next) => {

  const fields = `bus_id, plate_number, manufacturer, model, year, capacity, seats`;
  Bus.select(fields)
    .then(({ rows }) => {
      res.status(200).json({
        status: 'success',
        message: 'All buses scheduled for trips',
        data: rows
      });
    }).catch(e => {
      //forbidden => conflict
      res.status(409).json({
        status: 'error',
        error: 'Failed to fetch bus for trip'
      });
    });
});

router.get('/:bus_id', (req, res, next) => {

  let clause = '';
  const fields = `bus_id, plate_number, manufacturer, model, year, capacity, seats`;
  logger('req.params.bus_id : ', req.params.bus_id)
  if (req.params.bus_id) {
    clause = `WHERE bus_id = ${req.params.bus_id}`;
  }
  Bus.select(fields, clause)
    .then(({ rows }) => {
      res.status(200).json({
        status: 'success',
        message: `Bus spec/data for ${req.params.bus_id}`,
        url: `${req.protocol}://${req.hostname}${req.originalUrl}`,
        data: rows[0]
      });
    }).catch(e => {
      //forbidden => conflict
      res.status(409).json({
        status: 'error',
        error: 'Failed to add a bus for trip'
      });
    });
});

export default router;