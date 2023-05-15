import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line import/extensions
import userValidate from '../validators/userValidators.js';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany();

      if (!users || users.length === 0) {
        return res.status(200).json('Users not found.');
      }

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

      if (!user || user.length === 0) {
        return res.status(200).json('User not found.');
      }

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
        include: {
          address: true,
        },
      });

      if (!user || user.length === 0) {
        return res.status(200).json('User not found.');
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async createUser(req, res) {
    const dataUser = req.body;

    const result = userValidate(dataUser);

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
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!user || user.length === 0) {
        return res.status(200).json('User not found.');
      }

      const newUserData = { ...user, ...dataUser };

      const result = userValidate(newUserData);

      if (!result.success) {
        return res.status(400).json({ message: `${result.message}` });
      }

      const userUpdated = await prisma.user.update({
        where: { id: Number(userId) },
        data: { ...newUserData },
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
        return res.status(200).json({ message: 'User not found.' });
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
