import express from 'express';
import AuthController from '../controllers/authController.js';

const router = express.Router();

router
  .post('/login', AuthController.authLogin)
  .post('/logout', AuthController.authLogout);

export default router;
