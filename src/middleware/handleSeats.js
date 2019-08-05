/***
 * Not in use yet
 */
import debug from 'debug';
import Model from '../models/model';
const logger = debug('dev:handle-seats-middleware');


export default class HandleSeating {


  static getSeats(req, res, next) {
    //Available seat wil depend on the bus capacity and bookings fror that bus
    //SELECT bus.capacity, bookings.seat_number 
    //from bus NATURAL JOIN bookings WHERE bookings.bus_id = 1;
    const Bus = new Model('bus');
    Bus.select('bus.bus_id, bus.capacity, bookings.seat_number', `NATURAL JOIN bookings WHERE bookings.bus_id = bus.bus_id`)
      .then(({ rows }) => {
        return res.status(200).json({
          message: 'fetched available seats successfully',
          data: rows
        });
      })
      .catch(e => {
        return res.status(404).json({
          status: 'error',
          error: 'Cannot get available seeats'

        });
      });

  }

}