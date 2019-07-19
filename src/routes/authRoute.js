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
    const values = `'${user.first_name}', '${user.last_name}', '${user.email}', '${user.password}' `;
    User.insert('first_name, last_name, email, password', values, 'RETURNING  user_id, first_name, last_name, email')
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

export default router;