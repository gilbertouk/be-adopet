import { PrismaClient } from '@prisma/client';
import petValidate from '../validators/petValidators.js';
import stringToDate from '../utils/stringToDate.js';

const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

class PetModel {
  static async selectAllPets() {
    try {
      const pets = await prisma.pet.findMany();

      return pets;
    } catch (err) {
      return err;
    }
  }

  static async selectAvailablePets() {
    try {
      const petsAvailable = await prisma.pet.findMany({
        where: { available: true },
      });

      return petsAvailable;
    } catch (err) {
      return err;
    }
  }

  static async selectOnePetById(petId) {
    try {
      if (Number.isNaN(Number(petId))) {
        const objErr = {
          status: 400,
          message: 'petId query must be a number',
        };
        throw objErr;
      }
      const pet = await prisma.pet.findUnique({
        where: { id: Number(petId) },
      });

      if (!pet) {
        const objErr = {
          status: 404,
          message: 'pet not found',
        };
        throw objErr;
      }

      return pet;
    } catch (err) {
      const objErr = { status: err.status, message: err.message };
      throw objErr;
    }
  }

  static async insertPet(body) {
    try {
      const objPet = { ...body };
      objPet.age = stringToDate(objPet.age);

      const result = petValidate(objPet);

      if (!result.success) {
        const objErr = {
          status: 400,
          message: result.message,
        };
        throw objErr;
      }

      const shelterId = objPet.shelter_id;

      const shelter = await prisma.shelter.findUnique({
        where: { id: Number(shelterId) },
      });

      if (!shelter) {
        const objErr = {
          status: 404,
          message: 'shelter_id not found',
        };
        throw objErr;
      }

      const insertedPet = await prisma.pet.create({ data: { ...objPet } });

      return insertedPet;
    } catch (err) {
      const objErr = { status: err.status, message: err.message };
      throw objErr;
    }
  }

  static async updatePet(petId, body) {
    try {
      if (Number.isNaN(Number(petId))) {
        const objErr = {
          status: 400,
          message: 'pet_id query must be a number',
        };
        throw objErr;
      }

      const pet = await prisma.pet.findUnique({
        where: { id: Number(petId) },
      });

      if (!pet || pet.length === 0) {
        const objErr = {
          status: 404,
          message: 'pet not found',
        };
        throw objErr;
      }

      const newPetData = { ...pet, ...body };

      newPetData.age = stringToDate(newPetData.age);

      const result = petValidate(newPetData);

      if (!result.success) {
        const objErr = {
          status: 400,
          message: result.message,
        };
        throw objErr;
      }

      const petUpdated = await prisma.pet.update({
        where: { id: Number(petId) },
        data: { ...newPetData },
      });

      return petUpdated;
    } catch (err) {
      const objErr = { status: err.status, message: err.message };
      throw objErr;
    }
  }
}

export default PetModel;
