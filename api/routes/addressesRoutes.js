import express from 'express';
import AddressController from '../controllers/addressController.js';

const router = express.Router();

router
  .post('/user/:user_id/address', AddressController.createAddress)
  .put('/user/:user_id/address', AddressController.updateUserAddress)
  .delete('/user/:user_id/address', AddressController.deleteUserAddress)
  .post('/shelter/:shelter_id/address', AddressController.createAddress)
  .put('/shelter/:shelter_id/address', AddressController.updateShelterAddress)
  .delete(
    '/shelter/:shelter_id/address',
    AddressController.deleteShelterAddress,
  );

export default router;
