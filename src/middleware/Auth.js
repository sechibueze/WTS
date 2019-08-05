import jwt from 'jsonwebtoken';
import debug from 'debug';
import Model from '../models/model';
const logger = debug('dev:auth-middleware');
const User = new Model('users');


export default class Auth {

  static isAdmin(req, res, next) {
    try {
      //Take out 'Bearer'
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      User.select('email', `WHERE email = '${decoded.email}'`)
        .then(({ rows }) => {
          if (rows.length == 1 && rows[0].email === decoded.email && decoded.is_admin === true) {
            //found Admin
            logger('Found Admin in token : ', rows[0].email);
            req.userData = decoded;
            next();//pass control to next middleware
          } else {
            return res.status(401).json({
              status: 'error',
              error: 'Auth failed - unauthorized'
            });
          }
        })
        .catch(e => {
          return res.status(409).json({
            status: 'error',
            error: 'Auth failed'
          });
        });

    } catch (error) {
      logger('Has Not Token: ');
      //forbidden
      return res.status(403).json({
        status: 'error',
        error: 'Auth failed'
      });
    }
  }

  static isUser(req, res, next) {
    try {
      //Take out 'Bearer'
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      User.select('user_id, email', `WHERE email = '${decoded.email}'`)
        .then(({ rows }) => {
          if (rows.length == 1 && rows[0].email === decoded.email) {
            //found User
            logger('Found/Decoded user in token', rows[0].email);
            req.userData = decoded;
            next();
          } else {
            return res.status(404).json({
              status: 'error',
              error: 'Auth failed'
            });
          }
        })
        .catch(e => {
          return res.status(404).json({
            status: 'error',
            error: 'Auth failed'
          });
        });

    } catch (error) {
      logger('Has NOT token');
      return res.status(404).json({
        status: 'error',
        error: 'Auth failed'

      });
    }
  }

  // static getSeats(req, res, next) {
  //   //Available seat wil depend on the bus capacity and bookings fror that bus
  //   //SELECT bus.capacity, bookings.seat_number 
  //   //from bus NATURAL JOIN bookings WHERE bookings.bus_id = 1;
  //   const Bus = new Model('bus');
  //   Bus.select('bus.bus_id, bus.capacity, bookings.seat_number', `NATURAL JOIN bookings WHERE bookings.bus_id = bus.bus_id`)
  //     .then(({ rows }) => {
  //       return res.status(200).json({
  //         message: 'fetched available seats successfully',
  //         data: rows
  //       });
  //     })
  //     .catch(e => {
  //       return res.status(404).json({
  //         status: 'error',
  //         error: 'Cannot get available seeats'

  //       });
  //     });

  // }

}