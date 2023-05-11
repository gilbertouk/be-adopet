/* eslint-disable import/extensions */
import users from './usersRoutes.js';
import shelters from './sheltersRoutes.js';

const routes = (app) => {
  app.get('/', (req, res) => {
    res.send('Welcome to Adopet API');
  });

  app.use(users, shelters);
};

export default routes;
