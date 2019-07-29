import express from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import debug from 'debug';

import Model from '../models/model';
import Auth from '../middleware/Auth';
const logger = debug('dev:busRouter');
const router = express.Router();
const Bus = new Model('bus');
// const saltRound = 10;
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

  let clause = '';
  const fields = `bus_id, plate_number, manufacturer, model, year, capacity, seats`;
  // logger('req.params.bus_id : ', req.params.bus_id)
  // if (req.params.bus_id) {
  //   clause = `WHERE bus_id = ${req.params.bus_id}`;
  // }
  Bus.select(fields, clause)
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
        error: 'Failed to add a bus for trip'
      });
    });

  // });
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
        url: `localhost:5000/${req.originalUrl}`,
        data: rows[0]
      });
    }).catch(e => {
      //forbidden => conflict
      res.status(409).json({
        status: 'error',
        error: 'Failed to add a bus for trip'
      });
    });

  // });
});

//User Login
// router.get('/login', (req, res, next) => {
//   const login = req.body;
//   User.select('user_id, email, first_name, last_name, password, is_admin', `WHERE email = '${login.email}'`)
//     .then(({ rows }) => {
//       if (rows.length !== 1) {
//         return res.status(404).json({
//           status: 'error',
//           error: 'Auth failed'
//         });
//       }
//       let user = rows[0];
//       bcrypt.compare(login.password, user.password, (err, result) => {
//         if (result) {
//           //add token
//           const payload = {
//             user_id: user.user_id,
//             email: user.email,
//             is_admin: user.is_admin
//           };

//           jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' }, (err, token) => {
//             user.token = token;
//             delete user.password; //DOn't send the password
//             res.status(200).json({
//               status: 'success',
//               message: 'user login successful',
//               data: user
//             });
//           });
//         } else {
//           res.status(404).json({
//             status: 'error',
//             error: 'Auth failed'
//           });
//         }
//       });
//     })
//     .catch(e => {
//       res.status(404).json({
//         status: 'error',
//         error: 'Auth failed'
//       });
//     });


// });

export default router;