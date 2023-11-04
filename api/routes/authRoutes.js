import express from 'express';
import AuthController from '../controllers/authController.js';

const router = express.Router();

router
  .post('/login', AuthController.authLogin)
  .post('/refresh-token', AuthController.refreshToken)
  .delete('/logout', AuthController.authLogout)
  .post('/register', AuthController.authRegister);

export default router;
