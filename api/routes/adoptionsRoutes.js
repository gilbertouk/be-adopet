import express from 'express';
// eslint-disable-next-line import/extensions
import AdoptionController from '../controllers/adoptionController.js';

const router = express.Router();

router
  .get('/adoption', AdoptionController.getAllAdoption)
  .get('/adoption/pet', AdoptionController.getOneAdoption)
  .post('/adoption', AdoptionController.createPetAdoption);

export default router;
