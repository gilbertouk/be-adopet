/* eslint-disable import/extensions */
import express from 'express';
import UserController from '../controllers/userController.js';

const router = express.Router();

router
  .get('/users', UserController.getAllUsers)
  .get('/user/:id', UserController.getOneUser)
  .get('/user/:id/address', UserController.getOneUserWithAddress)
  .post('/user', UserController.createUser)
  .put('/user/:id', UserController.updateUser)
  .delete('/user/:id', UserController.deleteUser);

export default router;
