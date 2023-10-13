import { PrismaClient } from '@prisma/client';
import petValidate from '../validators/petValidators.js';
import stringToDate from '../utils/stringToDate.js';
import PetModel from '../models/petModel.js';

const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

class PetController {
  static async getAllPets(req, res, next) {
    try {
      const pets = await PetModel.selectAllPets();

      res.status(200).send({ pets });
    } catch (err) {
      next(err);
    }
  }

  static async getAvailablePets(req, res) {
    try {
      const petsAvailable = await prisma.pet.findMany({
        where: { available: true },
      });

      return res.status(200).json(petsAvailable);
    } catch (error) {
      return res.status(200).json(error.message);
    }
  }

  static async getOnePet(req, res) {
    const petId = req.params.id;

    try {
      const pet = await prisma.pet.findUnique({
        where: { id: Number(petId) },
      });

      if (!pet) {
        return res.status(200).json('Pet not found.');
      }

      return res.status(200).json(pet);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async createPet(req, res) {
    const dataPet = req.body;

    dataPet.age = stringToDate(dataPet.age);

    const result = petValidate(dataPet);

    if (!result.success) {
      return res.status(400).json({ message: `${result.message}` });
    }

    const shelterId = dataPet.shelter_id;

    try {
      const shelter = await prisma.shelter.findUnique({
        where: { id: Number(shelterId) },
      });

      if (!shelter) {
        return res.status(400).json({ message: 'No shelter found' });
      }

      const newPet = await prisma.pet.create({ data: { ...dataPet } });

      return res.status(201).json(newPet);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async updatePet(req, res) {
    const petId = req.params.id;
    const dataPet = req.body;

    try {
      const pet = await prisma.pet.findUnique({
        where: { id: Number(petId) },
      });

      if (!pet || pet.length === 0) {
        return res.status(400).json('Pet not found.');
      }

      const newPetData = { ...pet, ...dataPet };

      newPetData.age = stringToDate(newPetData.age);

      const result = petValidate(newPetData);

      if (!result.success) {
        return res.status(400).json({ message: `${result.message}` });
      }

      const petUpdated = await prisma.pet.update({
        where: { id: Number(petId) },
        data: { ...newPetData },
      });

      return res.status(200).json(petUpdated);
    } catch (error) {
      return res.status(500).json(error.message);
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
