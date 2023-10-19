import AuthModel from '../models/authModel.js';
import AuthService from '../services/authService.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  removeRefreshToken,
} from '../services/jwtService.js';

class AuthController {
  static async authLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      const userExist = await AuthModel.selectUserByEmail(email);

      await AuthService.authenticate(password, userExist.password);

      const accessToken = await signAccessToken(userExist.id);
      const refreshToken = await signRefreshToken(userExist.id);

      res.status(200).send({ accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const userId = await verifyRefreshToken(refreshToken);
      const accessToken = await signAccessToken(userId);
      const newRefreshToken = await signRefreshToken(userId);
      res.send({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
      next(err);
    }
  }

  static async authLogout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const userId = await verifyRefreshToken(refreshToken);
      console.log(userId);
      await removeRefreshToken(userId);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
