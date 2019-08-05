import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import debug from 'debug';
import Model from '../models/model';

const logger = debug('dev:authRouter');
const router = express.Router();
const User = new Model('users');
const saltRound = 10;
// User signup 
router.post('/signup', (req, res, next) => {
  const user = req.body;
  bcrypt.hash(user.password, saltRound, (err, hash) => {
    if (err) {
      //Bad Request
      return res.status(400).json({
        status: 'error',
        error: 'Bad Request: Check your inputs'
      });
    }
    user.password = hash;
    const fields = Object.keys(user).join(', ');
    const values = Object.values(user);
    const returns = `RETURNING  user_id, first_name, last_name, email, is_admin`;
    User.insert(fields, values, returns)
      .then(({ rows }) => {
        res.status(201).json({
          status: 'success',
          message: 'User created successfully',
          data: rows
        });
      }).catch(e => {
        //forbidden => conflict
        res.status(403).json({
          status: 'error',
          error: 'Failed to create user'
        });
      });

  });
});


//User Login
router.post('/login', (req, res, next) => {
  const login = req.body;
  User.select('user_id, email, first_name, last_name, password, is_admin', `WHERE email = '${login.email}'`)
    .then(({ rows }) => {
      if (rows.length !== 1) {
        return res.status(501).json({
          status: 'error',
          error: 'Auth failed: not implemented response'
        });
      }
      let user = rows[0];
      bcrypt.compare(login.password, user.password, (err, result) => {
        if (result) {
          //add token
          const payload = {
            user_id: user.user_id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_admin: user.is_admin
          };

          jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' }, (err, token) => {
            user.token = token;
            delete user.password; //DOn't send the password
            res.status(200).json({
              status: 'success',
              message: 'user login successful',
              data: user
            });
          });
        } else {
          res.status(401).json({
            status: 'error',
            error: 'Auth failed: unauthorized'
          });
        }
      });
    })
    .catch(e => {
      res.status(400).json({
        status: 'error',
        error: 'Auth failed: check login details'
      });
    });


});

export default router;