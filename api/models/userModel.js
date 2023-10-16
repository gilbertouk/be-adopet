import { PrismaClient } from '@prisma/client';
import userValidate from '../validators/userValidators.js';

const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

class UserModel {
  static async selectAllUsers() {
    try {
      const users = await prisma.user.findMany();

      return users;
    } catch (err) {
      return err;
    }
  }

  static async selectOneUserById(userId) {
    try {
      if (Number.isNaN(+userId)) {
        const objErr = {
          status: 400,
          message: 'userId query must be a number',
        };

        throw objErr;
      }
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!user || user.length === 0) {
        const objErr = {
          status: 404,
          message: 'user not found',
        };

        throw objErr;
      }

      return user;
    } catch (err) {
      const objErr = {
        status: err.status,
        message: err.message,
      };

      throw objErr;
    }
  }

  static async selectOneUserWithAddressById(userId) {
    try {
      if (Number.isNaN(+userId)) {
        const objErr = {
          status: 400,
          message: 'userId query must be a number',
        };

        throw objErr;
      }

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: {
          address: true,
        },
      });

      if (!user || user.length === 0) {
        const objErr = {
          status: 404,
          message: 'user not found',
        };

        throw objErr;
      }

      return user;
    } catch (err) {
      const objErr = {
        status: err.status,
        message: err.message,
      };

      throw objErr;
    }
  }

  static async insertUser(dataUser) {
    try {
      const result = userValidate(dataUser);

      if (!result.success) {
        const objErr = {
          status: 400,
          message: result.message,
        };

        throw objErr;
      }

      const userDataToInsert = {
        name: dataUser.name,
        email: dataUser.email,
        password: dataUser.password,
        phone: dataUser.phone,
        about: dataUser.about,
        role: dataUser.role,
      };

      const newUser = await prisma.user.create({
        data: { ...userDataToInsert },
      });

      return newUser;
    } catch (err) {
      const objErr = {
        status: err.status,
        message: err.message,
      };

      throw objErr;
    }
  }

  static async updateUserById(userId, dataUser) {
    try {
      if (Number.isNaN(+userId)) {
        const objErr = {
          status: 400,
          message: 'userId query must be a number',
        };

        throw objErr;
      }

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!user || user.length === 0) {
        const objErr = {
          status: 404,
          message: 'user not found',
        };

        throw objErr;
      }

      const newUserData = { ...user, ...dataUser };

      const result = userValidate(newUserData);

      if (!result.success) {
        const objErr = {
          status: 400,
          message: result.message,
        };

        throw objErr;
      }

      const userDataToUpdate = {
        name: dataUser.name,
        email: dataUser.email,
        password: dataUser.password,
        phone: dataUser.phone,
        about: dataUser.about,
        role: dataUser.role,
        url_photo: dataUser.url_photo,
        active: dataUser.active,
        createdAt: dataUser.createdAt,
        updatedAt: dataUser.updatedAt,
      };

      const userUpdated = await prisma.user.update({
        where: { id: Number(userId) },
        data: { ...userDataToUpdate },
      });

      return userUpdated;
    } catch (err) {
      const objErr = {
        status: err.status,
        message: err.message,
      };

      throw objErr;
    }
  }

  static async deleteUserById(userId) {
    try {
      if (Number.isNaN(+userId)) {
        const objErr = {
          status: 400,
          message: 'userId query must be a number',
        };

        throw objErr;
      }

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (user === null) {
        const objErr = {
          status: 404,
          message: 'user not found',
        };

        throw objErr;
      }

      const adoptions = await prisma.adoption.findFirst({
        where: { user_id: Number(userId) },
      });

      if (adoptions) {
        const objErr = {
          status: 400,
          message:
            'it was not possible to delete the user because it has registered pets adoption',
        };

        throw objErr;
      }

      const userDeleted = await prisma.user.delete({
        where: { id: Number(userId) },
      });

      return userDeleted;
    } catch (err) {
      const objErr = {
        status: err.status,
        message: err.message,
      };

      throw objErr;
    }
  }
}

export default UserModel;
