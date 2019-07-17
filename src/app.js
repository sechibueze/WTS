import express from 'express';

const port = process.env.PORT || 5000;

const app = express();

app.use('/', (req, res) => {
  res.json({ message: 'Welcome to WTS API' });
});

app.listen(port, () => {
  console.log(`[Server] started on port: ${port}`);
});
export default app;
