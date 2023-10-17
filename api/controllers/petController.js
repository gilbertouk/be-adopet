import PetModel from '../models/petModel.js';

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

  static async deletePet(req, res, next) {
    try {
      const petId = req.params.id;
      await PetModel.deletePet(petId);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}

export default PetController;
