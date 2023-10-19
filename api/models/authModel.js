import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

class AuthModel {
  static async selectUserByEmail(email) {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      return user;
    } catch (err) {
      return err;
    }
  }
}

export default AuthModel;
