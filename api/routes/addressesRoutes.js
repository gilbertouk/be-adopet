import express from 'express';

const router = express.Router();

router
  .post('/user/:id/address')
  .put('/user/:id/address')
  .delete('/user/:id/address/:address_id');

export default router;
