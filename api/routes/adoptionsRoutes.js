import express from 'express';
// eslint-disable-next-line import/extensions
import AdoptionController from '../controllers/adoptionController.js';

const router = express.Router();

router.post('/adoption', AdoptionController.createPetAdoption);

export default router;
