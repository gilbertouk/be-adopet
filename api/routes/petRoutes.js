import express from 'express';
// eslint-disable-next-line import/extensions
import PetController from '../controllers/petController.js';

const router = express.Router();

router
  .get('/pets', PetController.getAllPets)
  .get('/pet/:id', PetController.getOnePet)
  .post('/pet', PetController.createPet);

export default router;
