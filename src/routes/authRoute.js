import express from 'express';
import bcrypt from 'bcrypt';
import Model from '../models/model';

const router = express.Router();
const User = new Model('users');
const saltRound = 10;
router.post('/signup', (req, res, next) => {
  const user = req.body;
  bcrypt.hash(user.password, saltRound, (err, hash) => {
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
        res.status(409).json({
          status: 'error',
          error: 'Failed to create user, confirm that you have not been registered'
        });
      });

  });
});


//User Login
router.post('/login', (req, res, next) => {
  const login = req.body;
  res.json({
    message: '/POST user-login',
    login
  });

});

export default router;