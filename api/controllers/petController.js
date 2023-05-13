/* eslint-disable import/extensions */
import { PrismaClient } from '@prisma/client';
import petValidate from '../validators/petValidators.js';
import adoptionValidate from '../validators/adoptionValidators.js';
import stringToDate from '../utils/stringToDate.js';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

class PetController {
  static async getAllPets(req, res) {
    try {
      const pets = await prisma.pet.findMany();

      if (!pets || pets.length === 0) {
        return res.status(200).json('Pets not found.');
      }

      return res.status(200).json(pets);
    } catch (error) {
      return res.status(500).json(error.message);
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

      const adoptionCreated = await prisma.adoption.create({
        data: { ...dataAdoption },
      });

      return res.status(201).json(adoptionCreated);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}

export default PetController;
