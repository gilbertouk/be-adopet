import { PrismaClient } from '@prisma/client';
import AdoptionModel from '../models/adoptionModel.js';

const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

class AdoptionController {
  static async getAllAdoption(req, res, next) {
    const { query } = req;

    try {
      const adoptions = await AdoptionModel.selectAdoption(query);
      res.status(200).send({ adoptions });
    } catch (err) {
      next(err);
    }
  }

  static async createPetAdoption(req, res, next) {
    const { body } = req;

    try {
      const adoption = await AdoptionModel.insertPetAdoption(body);

      res.status(201).send({ adoption });
    } catch (err) {
      next(err);
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
