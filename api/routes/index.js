/* eslint-disable import/extensions */
import users from './usersRoutes.js';
import shelters from './sheltersRoutes.js';
import pets from './petRoutes.js';

const routes = (app) => {
  app.get('/', (req, res) => {
    res.send('Welcome to Adopet API');
  });

  app.use(users, shelters, pets);
};

export default routes;
