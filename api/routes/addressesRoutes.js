import express from 'express';
import AddressController from '../controllers/addressController.js';

const router = express.Router();

router
  .post('/user/:user_id/address', AddressController.createAddress)
  .put('/user/:user_id/address', AddressController.updateAddress)
  .delete('/user/:user_id/address/:address_id', AddressController.deleteAddress)
  .post('/shelter/:shelter_id/address', AddressController.createAddress)
  .put('/shelter/:shelter_id/address', AddressController.updateAddress)
  .delete(
    '/shelter/:shelter_id/address/:address_id',
    AddressController.deleteAddress,
  );

export default router;
