import express from 'express';
const router = express.Router();

router.post('/signup', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to POST /signup',
    url: req.originalUrl
  });
});

export default router;