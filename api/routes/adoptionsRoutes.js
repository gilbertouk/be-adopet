import express from 'express';
import AdoptionController from '../controllers/adoptionController.js';

const router = express.Router();

router
  .get('/adoption', AdoptionController.getAllAdoption)
  .post('/adoption', AdoptionController.createPetAdoption)
  .delete('/adoption/:id', AdoptionController.deleteAdoption);

export default router;
