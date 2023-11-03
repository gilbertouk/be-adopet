/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import './helpers/redisHelper.js';

const app = express();
app.use(cors());
app.use(express.json());
routes(app);

app.use((err, _req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, _req, res, next) => {
  if (err.code === 'P2003') {
    res.status(400).send({ message: 'shelter_id not found' });
  } else {
    next(err);
  }
});

app.use((err, _req, res, _next) => {
  console.log(err);
  res.status(500).send({ message: 'Something broke!' });
});

export default app;
