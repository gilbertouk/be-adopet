/* eslint-disable import/extensions */
import express from 'express';
import UserController from '../controllers/userController.js';

const router = express.Router();

router
  .get('/users', UserController.getUsers)
  .get('/users/:id', UserController.getOneUser)
  .get('/users/:id/address', UserController.getOneUserWithAddress)
  .post('/users', UserController.createUser)
  .put('/users/:id', UserController.updateUser)
  .delete('/users/:id', UserController.deleteUser);

export default router;
