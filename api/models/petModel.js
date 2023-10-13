import { PrismaClient } from '@prisma/client';
import petValidate from '../validators/petValidators.js';
import stringToDate from '../utils/stringToDate.js';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

class PetModel {
  static async selectAllPets() {
    try {
      const pets = await prisma.pet.findMany();

      return pets;
    } catch (err) {
      const objErr = { status: err.status, message: err.message };
      throw objErr;
    }
  }
}

export default PetModel;
