import express from 'express';
import bodyParser from 'body-parser';
import debug from 'debug';
import { config } from 'dotenv';


const port = process.env.PORT || 5000;
const logger = debug('dev:app');
const app = express();
config(); //setup to read .env vars

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//import router files
import authRouter from './routes/authRoute';
import busRouter from './routes/busRouter';
import tripsRouter from './routes/tripsRouter';
import bookingsRouter from './routes/bookingsRouter';

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/bus', busRouter);
app.use('/api/v1/trips', tripsRouter);
app.use('/api/v1/bookings', bookingsRouter);
app.use('/api/v1', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to WTS API'
  });
});

app.listen(port, () => {
  logger(`[Server] started on port: ${port}`);
  console.log(`[Server] started on port: ${port}`);
});
export default app;
