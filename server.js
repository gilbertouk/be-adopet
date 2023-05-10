import dotenv from 'dotenv';
import app from './api/index.js';

dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`'REST API server ready at: http://localhost:${port}`);
});
