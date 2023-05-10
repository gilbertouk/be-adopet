/* eslint-disable import/extensions */
import users from './usersRoutes.js';

const routes = (app) => {
  app.get('/', (req, res) => {
    res.send('Welcome to Adopet API');
  });

  app.use(users);
};

export default routes;
