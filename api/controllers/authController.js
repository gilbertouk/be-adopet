import AuthModel from '../models/authModel.js';
import AuthService from '../services/authService.js';

class AuthController {
  static async authLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      const userExist = await AuthModel.selectUserByEmail(email);

      const isMatch = await AuthService.authenticate(
        password,
        userExist.password,
      );
      res.status(200).send({ message: isMatch });
    } catch (err) {
      next(err);
    }
  }

  static async authLogout(req, res, next) {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      res.status(200).send({ message: 'okay' });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
