import express from 'express';
import ShelterController from '../controllers/shelterController.js';

const router = express.Router();

router
  .get('/shelters', ShelterController.getAllShelters)
  .get('/shelter/:id', ShelterController.getOneShelter)
  .get('/shelter/:id/address', ShelterController.getOneShelterWithAddress)
  .post('/shelter', ShelterController.createShelter)
  .put('/shelter/:id', ShelterController.updateShelter)
  .delete('/shelter/:id', ShelterController.deleteShelter);

export default router;
