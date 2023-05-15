/* eslint-disable import/extensions */
import { PrismaClient } from '@prisma/client';
import adoptionValidate from '../validators/adoptionValidators.js';
import stringToDate from '../utils/stringToDate.js';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

class AdoptionController {
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
      const pet = await prisma.pet.findUnique({ where: { id: Number(petId) } });

      if (!pet) {
        return res.status(400).json({ message: 'No pet found' });
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

      return res.status(201).json(adoptionCreated);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}

export default AdoptionController;
