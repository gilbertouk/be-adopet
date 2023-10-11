import users from './usersRoutes.js';
import shelters from './sheltersRoutes.js';
import pets from './petRoutes.js';
import adoptions from './adoptionsRoutes.js';

const routes = (app) => {
  app.get('/api', (req, res) => {
    res.status(200).send({ message: 'Welcome to Adopet API' });
  });

  app.use(users, shelters, pets, adoptions);
};

export default routes;
