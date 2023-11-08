import AuthModel from '../models/authModel.js';
import UserModel from '../models/userModel.js';
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

      if (!userExist) {
        const objErr = {
          status: 400,
          message: 'invalid email/password',
        };

        throw objErr;
      }

      await AuthService.authenticate(password, userExist.password);

      const accessToken = await signAccessToken(userExist.id);
      const refreshToken = await signRefreshToken(userExist.id);

      res
        .status(200)
        .cookie('jwt', refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'None',
          maxAge: 365 * 24 * 60 * 60,
        })
        .send({ accessToken });
    } catch (err) {
      next(err);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      const { cookies } = req;
      console.dir(cookies);

      if (!cookies?.jwt) {
        return res.sendStatus(401);
      }

      const oldRefreshToken = cookies.jwt;

      const userId = await verifyRefreshToken(oldRefreshToken);

      const accessToken = await signAccessToken(userId);
      return res.send({ accessToken });
    } catch (err) {
      next(err);
    }
  }

  static async authLogout(req, res, next) {
    try {
      const { cookies } = req;
      if (!cookies?.jwt) {
        res.sendStatus(204);
      }

      const refreshToken = cookies.jwt;
      const userId = await verifyRefreshToken(refreshToken);
      await removeRefreshToken(userId);
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }

  static async authRegister(req, res, next) {
    try {
      const { body } = req;
      const userExist = await AuthModel.selectUserByEmail(body.email);

      if (userExist) {
        const objErr = {
          status: 400,
          message: 'email already in use',
        };
        throw objErr;
      }

      const userData = { ...body };

      userData.password = await AuthService.createHash(userData.password);

      const user = await UserModel.insertUser(userData);

      res.status(201).send({ user });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
