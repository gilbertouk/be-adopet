/* eslint-disable prefer-promise-reject-errors */
import { PrismaClient } from '@prisma/client';
import adoptionValidate from '../validators/adoptionValidators.js';
import stringToDate from '../utils/stringToDate.js';

const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

class AdoptionModel {
  static async selectAdoption(query) {
    try {
      const { petId, adoptionId, userId } = query;
      const sqlQuery = { where: {} };

      if (petId) {
        if (!Number.isNaN(Number(petId))) {
          sqlQuery.where.pet_id = Number(petId);
        } else {
          const objErr = {
            status: 400,
            message: 'petId query must be a number',
          };
          throw objErr;
        }
      }

      if (adoptionId) {
        if (!Number.isNaN(Number(adoptionId))) {
          sqlQuery.where.id = Number(adoptionId);
        } else {
          const objErr = {
            status: 400,
            message: 'adoptionId query must be a number',
          };
          throw objErr;
        }
      }

      if (userId) {
        if (!Number.isNaN(Number(userId))) {
          sqlQuery.where.user_id = Number(userId);
        } else {
          const objErr = {
            status: 400,
            message: 'userId query must be a number',
          };
          throw objErr;
        }
      }

      const adoptions = await prisma.adoption.findMany(sqlQuery);

      if (!adoptions || adoptions.length === 0) {
        const objErr = {
          status: 404,
          message: 'adoptions not found',
        };
        throw objErr;
      }

      return adoptions;
    } catch (err) {
      const objErr = { status: err.status, message: err.message };
      throw objErr;
    }
  }

  static async insertPetAdoption(body) {
    try {
      const objAdoption = { ...body };

      if (objAdoption.date) {
        objAdoption.date = stringToDate(objAdoption.date);
      }

      const result = adoptionValidate(objAdoption);

      if (!result.success) {
        const objErr = { status: 400, message: result.message };
        throw objErr;
      }

      const pet = await prisma.pet.findUnique({
        where: {
          id: Number(objAdoption.pet_id),
        },
      });

      if (!pet) {
        const objErr = { status: 404, message: 'pet not found' };
        throw objErr;
      }

      if (pet.available === false) {
        const objErr = {
          status: 400,
          message: 'pet is not available for adoption',
        };
        throw objErr;
      }

      const user = await prisma.user.findUnique({
        where: { id: Number(objAdoption.user_id) },
      });

      if (!user) {
        const objErr = {
          status: 404,
          message: 'user not found',
        };
        throw objErr;
      }

      const adoptionAlreadyExists = await prisma.adoption.findUnique({
        where: { pet_id: Number(objAdoption.pet_id) },
      });

      if (adoptionAlreadyExists) {
        const objErr = {
          status: 400,
          message: `pet id ${objAdoption.pet_id} is not available for adoption`,
        };
        throw objErr;
      }

      const adoptionDataToInsert = {
        date: objAdoption.date,
        pet_id: objAdoption.pet_id,
        user_id: objAdoption.user_id,
      };

      const adoptionCreated = await prisma.adoption.create({
        data: { ...adoptionDataToInsert },
      });

      await prisma.pet.update({
        data: { available: false },
        where: { id: Number(objAdoption.pet_id) },
      });

      return adoptionCreated;
    } catch (err) {
      const objErr = { status: err.status, message: err.message };
      throw objErr;
    }
  }

  static async deletePetAdoption(adoptionId) {
    try {
      if (Number.isNaN(Number(adoptionId))) {
        const objErr = {
          status: 400,
          message: 'id must be a number',
        };
        throw objErr;
      }

      const adoption = await prisma.adoption.findUnique({
        where: { id: Number(adoptionId) },
      });

      if (!adoption || adoption.length === 0) {
        const objErr = {
          status: 404,
          message: 'adoption not found',
        };
        throw objErr;
      }

      const adoptionDeleted = await prisma.adoption.delete({
        where: { id: Number(adoptionId) },
      });

      await prisma.pet.update({
        data: { available: true },
        where: { id: adoptionDeleted.pet_id },
      });

      return;
    } catch (err) {
      const objErr = { status: err.status, message: err.message };
      throw objErr;
    }
  }
}

export default AdoptionModel;
