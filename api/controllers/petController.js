import { PrismaClient } from '@prisma/client';
import petValidate from '../validators/petValidators.js';
import stringToDate from '../utils/stringToDate.js';
import PetModel from '../models/petModel.js';

const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

class PetController {
  static async getAllPets(_req, res, next) {
    try {
      const pets = await PetModel.selectAllPets();

      res.status(200).send({ pets });
    } catch (err) {
      next(err);
    }
  }

  static async getAvailablePets(_req, res, next) {
    try {
      const petsAvailable = await PetModel.selectAvailablePets();

      res.status(200).send({ petsAvailable });
    } catch (err) {
      next(err);
    }
  }

  static async getOnePet(req, res, next) {
    try {
      const petId = req.params.id;
      const pet = await PetModel.selectOnePetById(petId);

      res.status(200).send({ pet });
    } catch (err) {
      next(err);
    }
  }

  static async createPet(req, res, next) {
    try {
      const dataPet = req.body;
      const insertedPet = await PetModel.insertPet(dataPet);

      res.status(201).send({ pet: insertedPet });
    } catch (err) {
      next(err);
    }
  }

  static async updatePet(req, res, next) {
    try {
      const petId = req.params.id;
      const dataPet = req.body;

      const updatedPet = await PetModel.updatePet(petId, dataPet);

      res.status(200).send({ pet: updatedPet });
    } catch (err) {
      next(err);
    }
  }

  static async deletePet(req, res) {
    const petId = req.params.id;

    try {
      const pet = await prisma.pet.findUnique({
        where: { id: Number(petId) },
      });

      if (!pet || pet.length === 0) {
        return res.status(400).json({ message: 'Pet not found' });
      }

      const adoption = await prisma.adoption.findUnique({
        where: { pet_id: Number(petId) },
      });

      if (adoption) {
        return res.status(400).json({
          message:
            'It is necessary to delete the adoption first before deleting the pet',
        });
      }

      const petDeleted = await prisma.pet.delete({
        where: { id: Number(petId) },
      });

      return res
        .status(200)
        .json({ message: `Pet Id ${petDeleted.id} has been deleted` });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}

export default PetController;
