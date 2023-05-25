/* eslint-disable import/extensions */
import { PrismaClient } from '@prisma/client';
import adoptionValidate from '../validators/adoptionValidators.js';
import stringToDate from '../utils/stringToDate.js';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

class AdoptionController {
  static async getAllAdoption(req, res) {
    const sqlQuery = { where: {} };
    let { petId } = req.query;
    let { adoptionId } = req.query;
    let { userId } = req.query;

    if (petId) {
      petId = Number(petId);
      if (!Number.isNaN(petId)) {
        sqlQuery.where.pet_id = Number(petId);
      } else {
        return res
          .status(400)
          .json({ message: 'petId field must be a number' });
      }
    }

    if (adoptionId) {
      adoptionId = Number(adoptionId);
      if (!Number.isNaN(adoptionId)) {
        sqlQuery.where.id = Number(adoptionId);
      } else {
        return res
          .status(400)
          .json({ message: 'adoptionId field must be a number' });
      }
    }

    if (userId) {
      userId = Number(userId);
      if (!Number.isNaN(userId)) {
        sqlQuery.where.user_id = Number(userId);
      } else {
        return res
          .status(400)
          .json({ message: 'userId field must be a number' });
      }
    }

    try {
      const adoptions = await prisma.adoption.findMany(sqlQuery);

      if (!adoptions || adoptions.length === 0) {
        return res.status(200).json('Adoptions not found.');
      }

      return res.status(200).json(adoptions);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async createPetAdoption(req, res) {
    const petId = req.body.pet_id;
    const userId = req.body.user_id;
    const dataAdoption = req.body;

    dataAdoption.date = stringToDate(dataAdoption.date);

    const result = adoptionValidate(dataAdoption);

    if (!result.success) {
      return res.status(400).json({ message: `${result.message}` });
    }

    try {
      const pet = await prisma.pet.findUnique({
        where: {
          id: Number(petId),
        },
      });

      if (!pet) {
        return res.status(400).json({ message: 'No pet found' });
      }

      if (pet.available === false) {
        return res
          .status(400)
          .json({ message: 'Pet is not available for adoption' });
      }

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!user) {
        return res.status(400).json({ message: 'No user found' });
      }

      const adoptionAlreadyExists = await prisma.adoption.findUnique({
        where: { pet_id: Number(petId) },
      });

      if (adoptionAlreadyExists) {
        return res
          .status(400)
          .json({ message: `Pet Id ${petId} is not available for adoption.` });
      }

      const adoptionCreated = await prisma.adoption.create({
        data: { ...dataAdoption },
      });

      await prisma.pet.update({
        data: { available: false },
        where: { id: Number(petId) },
      });

      return res.status(201).json(adoptionCreated);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async deleteAdoption(req, res) {
    const adoptionId = req.params.id;
    try {
      const adoption = await prisma.adoption.findUnique({
        where: { id: Number(adoptionId) },
      });

      if (!adoption || adoption.length === 0) {
        return res.status(400).json({ message: 'Adoption not found' });
      }

      const adoptionDeleted = await prisma.adoption.delete({
        where: { id: Number(adoptionId) },
      });
      await prisma.pet.update({
        data: { available: true },
        where: { id: adoptionDeleted.pet_id },
      });

      return res.status(200).json({
        message: `Adoption Id ${adoptionDeleted.id} has been deleted`,
      });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}

export default AdoptionController;
