import express from 'express';
import routes from './routes/index.js';

const app = express();
app.use(express.json());
routes(app);

app.use((err, _req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something broke!' });
});

export default app;
