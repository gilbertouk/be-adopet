import users from './usersRoutes.js';
import shelters from './sheltersRoutes.js';
import pets from './petRoutes.js';
import adoptions from './adoptionsRoutes.js';
import addresses from './addressesRoutes.js';
import auth from './authRoutes.js';

const routes = (app) => {
  app.get('/api', (_req, res) => {
    res.status(200).send({ message: 'Welcome to Adopet API' });
  });

  app.use('/api', users, shelters, pets, adoptions, addresses, auth);
};

export default routes;
