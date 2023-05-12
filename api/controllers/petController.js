import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line import/extensions
import petValidate from '../validators/petValidators.js';

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

    const ageString = dataPet.age;
    const ageDate = new Date(ageString);
    dataPet.age = ageDate;

    const result = petValidate(dataPet);

    if (!result.success) {
      return res.status(400).json({ message: `${result.message}` });
    }

    const shelterId = dataPet.shelter_id;

    try {
      const shelter = await prisma.shelter.findUnique({
        where: { id: Number(shelterId) },
      });

      console.log(shelter);

      if (!shelter) {
        return res.status(400).json({ message: 'No shelter found' });
      }
      const newPet = await prisma.pet.create({ data: { ...dataPet } });

      return res.status(201).json(newPet);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}

export default PetController;
