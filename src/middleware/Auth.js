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
            logger('Found Admin');
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
}