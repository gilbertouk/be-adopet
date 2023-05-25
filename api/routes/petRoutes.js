import express from 'express';
// eslint-disable-next-line import/extensions
import PetController from '../controllers/petController.js';

const router = express.Router();

router
  .get('/pets', PetController.getAllPets)
  .get('/pet/:id', PetController.getOnePet)
  .get('/pets/available', PetController.getAvailablePets)
  .post('/pet', PetController.createPet)
  .put('/pet/:id', PetController.updatePet)
  .delete('/pet/:id', PetController.deletePet);

export default router;
