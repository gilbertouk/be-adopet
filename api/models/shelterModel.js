import { PrismaClient } from '@prisma/client';
import shelterValidate from '../validators/shelterValidators.js';

const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

class ShelterModel {
  static async selectAllShelters() {
    try {
      const shelters = await prisma.shelter.findMany();
      return shelters;
    } catch (err) {
      return err;
    }
  }

  static async selectOneShelterById(shelterId) {
    try {
      if (Number.isNaN(Number(shelterId))) {
        const objErr = {
          status: 400,
          message: 'shelterId query must be a number',
        };
        throw objErr;
      }

      const shelter = await prisma.shelter.findUnique({
        where: { id: Number(shelterId) },
      });

      if (!shelter) {
        const objErr = {
          status: 404,
          message: 'shelter not found',
        };
        throw objErr;
      }

      return shelter;
    } catch (err) {
      const objErr = {
        status: err.status,
        message: err.message,
      };
      throw objErr;
    }
  }

  static async selectOneShelterWithAddressById(shelterId) {
    try {
      if (Number.isNaN(Number(shelterId))) {
        const objErr = {
          status: 400,
          message: 'shelterId query must be a number',
        };
        throw objErr;
      }

      const shelter = await prisma.shelter.findUnique({
        where: { id: Number(shelterId) },
        include: {
          address: true,
        },
      });

      if (!shelter || shelter.length === 0) {
        const objErr = {
          status: 404,
          message: 'shelter not found',
        };
        throw objErr;
      }

      return shelter;
    } catch (err) {
      const objErr = {
        status: err.status,
        message: err.message,
      };
      throw objErr;
    }
  }

  static async insertShelter(dataShelter) {
    try {
      const result = shelterValidate(dataShelter);

      if (!result.success) {
        const objErr = {
          status: 400,
          message: result.message,
        };
        throw objErr;
      }

      const shelterDataToInsert = {
        name: dataShelter.name,
        email: dataShelter.email,
        password: dataShelter.password,
        phone: dataShelter.phone,
        about: dataShelter.about,
      };

      const newShelter = await prisma.shelter.create({
        data: { ...shelterDataToInsert },
      });

      return newShelter;
    } catch (err) {
      const objErr = {
        status: err.status,
        message: err.message,
      };
      throw objErr;
    }
  }

  static async updateShelterById(shelterId, dataShelter) {
    try {
      if (Number.isNaN(Number(shelterId))) {
        const objErr = {
          status: 400,
          message: 'shelterId query must be a number',
        };
        throw objErr;
      }

      const shelter = await prisma.shelter.findUnique({
        where: { id: Number(shelterId) },
      });

      if (!shelter) {
        const objErr = {
          status: 404,
          message: 'shelter not found',
        };
        throw objErr;
      }

      const newShelterData = { ...shelter, ...dataShelter };

      const result = shelterValidate(newShelterData);

      if (!result.success) {
        const objErr = {
          status: 400,
          message: result.message,
        };
        throw objErr;
      }

      const shelterDataToUpdate = {
        name: newShelterData.name,
        email: newShelterData.email,
        password: newShelterData.password,
        phone: newShelterData.phone,
        about: newShelterData.about,
        id: newShelterData.id,
        active: newShelterData.active,
        createdAt: newShelterData.createdAt,
        updatedAt: newShelterData.updatedAt,
      };

      const updatedShelter = await prisma.shelter.update({
        where: { id: Number(shelterId) },
        data: { ...shelterDataToUpdate },
      });
      return updatedShelter;
    } catch (err) {
      const objErr = {
        status: err.status,
        message: err.message,
      };
      throw objErr;
    }
  }

  static async deleteShelterById(shelterId) {
    try {
      if (Number.isNaN(+shelterId)) {
        const objErr = {
          status: 400,
          message: 'shelterId query must be a number',
        };
        throw objErr;
      }

      const pets = await prisma.pet.findFirst({
        where: { shelter_id: Number(shelterId) },
      });

      if (pets) {
        const objErr = {
          status: 400,
          message:
            'it was not possible to delete the shelter because it has registered pets',
        };
        throw objErr;
      }

      const shelter = await prisma.shelter.findUnique({
        where: { id: Number(shelterId) },
      });

      if (shelter === null) {
        const objErr = {
          status: 404,
          message: 'shelter not found',
        };
        throw objErr;
      }

      const shelterDeleted = await prisma.shelter.delete({
        where: { id: Number(shelterId) },
      });

      return shelterDeleted;
    } catch (err) {
      const objErr = {
        status: err.status,
        message: err.message,
      };
      throw objErr;
    }
  }
}

export default ShelterModel;
