import express from 'express';

const port = process.env.PORT || 5000;

const app = express();

//import router files
import authRouter from './routes/authRoute';
app.use('/api/v1/auth', authRouter);
app.use('/api/v1', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to WTS API'
  });
});

app.listen(port, () => {
  console.log(`[Server] started on port: ${port}`);
});
export default app;
