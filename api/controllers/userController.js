import UserModel from '../models/userModel.js';

class UserController {
  static async getAllUsers(req, res, next) {
    try {
      const users = await UserModel.selectAllUsers();

      res.status(200).send({ users });
    } catch (err) {
      next(err);
    }
  }

  static async getOneUser(req, res, next) {
    try {
      const userId = req.params.id;
      const user = await UserModel.selectOneUserById(userId);

      res.status(200).send({ user });
    } catch (err) {
      next(err);
    }
  }

  static async getOneUserWithAddress(req, res, next) {
    try {
      const userId = req.params.id;
      const user = await UserModel.selectOneUserWithAddressById(userId);

      res.status(200).send({ user });
    } catch (err) {
      next(err);
    }
  }

  static async createUser(req, res, next) {
    try {
      const dataUser = req.body;
      const user = await UserModel.insertUser(dataUser);

      res.status(201).send({ user });
    } catch (err) {
      next(err);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const userId = req.params.id;
      const { body } = req;
      const user = await UserModel.updateUserById(userId, body);

      res.status(200).send({ user });
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const userId = req.params.id;
      await UserModel.deleteUserById(userId);

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;
