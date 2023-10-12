import AdoptionModel from '../models/adoptionModel.js';

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

  static async deleteAdoption(req, res, next) {
    const adoptionId = req.params.id;
    try {
      await AdoptionModel.deletePetAdoption(adoptionId);

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}

export default AdoptionController;
