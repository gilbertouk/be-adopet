/* eslint-disable operator-linebreak */
import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line import/extensions
import validateUser from '../validators/userValidators.js';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

class UserController {
  static async getUsers(req, res) {
    try {
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async getOneUser(req, res) {
    const userId = req.params.id;
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async getOneUserWithAddress(req, res) {
    const userId = req.params.id;
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });
      const address = await prisma.address.findUnique({
        where: { user_id: Number(userId) },
      });
      const data = { ...user, ...address };
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async createUser(req, res) {
    const dataUser = req.body;

    const result = validateUser(dataUser);

    if (!result.success) {
      return res.status(400).json({ message: `${result.message}` });
    }

    try {
      const newUser = await prisma.user.create({ data: { ...dataUser } });
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async updateUser(req, res) {
    const userId = req.params.id;
    const dataUser = req.body;
    try {
      const userUpdated = await prisma.user.update({
        where: { id: Number(userId) },
        data: { ...dataUser },
      });
      return res.status(200).json(userUpdated);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async deleteUser(req, res) {
    const userId = req.params.id;
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (user === null) {
        return res.status(200).json({ message: 'User not found' });
      }

      const userDeleted = await prisma.user.delete({
        where: { id: Number(userId) },
      });
      return res
        .status(200)
        .json({ message: `User '${userDeleted.name}' has been deleted.` });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}

export default UserController;
