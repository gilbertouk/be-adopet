import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line import/extensions
import shelterValidate from '../validators/shelterValidators.js';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

class ShelterController {
  static async getAllShelters(req, res) {
    try {
      const shelters = await prisma.shelter.findMany();

      if (!shelters || shelters.length === 0) {
        return res.status(200).json('Não encontrado.');
      }

      return res.status(200).json(shelters);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async getOneShelter(req, res) {
    const shelterId = req.params.id;
    try {
      const shelter = await prisma.shelter.findUnique({
        where: { id: Number(shelterId) },
      });

      if (!shelter) {
        return res.status(200).json('Não encontrado.');
      }

      return res.status(200).json(shelter);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async getOneShelterWithAddress(req, res) {
    const shelterId = req.params.id;
    try {
      const shelter = await prisma.shelter.findUnique({
        where: { id: Number(shelterId) },
        include: {
          address: true,
        },
      });

      if (!shelter) {
        return res.status(200).json('Não encontrado.');
      }

      return res.status(200).json(shelter);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async createShelter(req, res) {
    const dataShelter = req.body;

    const result = shelterValidate(dataShelter);

    if (!result.success) {
      return res.status(400).json({ message: `${result.message}` });
    }

    try {
      const newShelter = await prisma.shelter.create({
        data: { ...dataShelter },
      });
      return res.status(201).json(newShelter);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async updateShelter(req, res) {
    const shelterId = req.params.id;
    const dataShelter = req.body;
    try {
      const shelterUpdated = await prisma.shelter.update({
        where: { id: Number(shelterId) },
        data: { ...dataShelter },
      });
      return res.status(200).json(shelterUpdated);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}

export default ShelterController;
