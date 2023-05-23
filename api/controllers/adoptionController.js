/* eslint-disable import/extensions */
import { PrismaClient } from '@prisma/client';
import adoptionValidate from '../validators/adoptionValidators.js';
import stringToDate from '../utils/stringToDate.js';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

class AdoptionController {
  static async getAllAdoption(req, res) {
    try {
      const adoptions = await prisma.adoption.findMany();

      if (!adoptions || adoptions.length === 0) {
        return res.status(200).json('Adoptions not found.');
      }

      return res.status(200).json(adoptions);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  // static async getOneAdoption(req, res) {
  //   const { petId } = req.query;
  //   const { adoptionId } = req.query;
  //   const { userId } = req.query;

  //   return res.status(200).json({ message: 'teste' });
  // }

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
}

export default AdoptionController;
