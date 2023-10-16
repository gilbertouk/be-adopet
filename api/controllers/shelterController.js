/* eslint-disable no-unused-vars */
import ShelterModel from '../models/shelterModel.js';

class ShelterController {
  static async getAllShelters(req, res, next) {
    try {
      const shelters = await ShelterModel.selectAllShelters();

      res.status(200).json({ shelters });
    } catch (err) {
      next(err);
    }
  }

  static async getOneShelter(req, res, next) {
    const shelterId = req.params.id;
    try {
      const shelter = await ShelterModel.selectOneShelterById(shelterId);

      res.status(200).send({ shelter });
    } catch (err) {
      next(err);
    }
  }

  static async getOneShelterWithAddress(req, res, next) {
    try {
      const shelterId = req.params.id;
      const shelter = await ShelterModel.selectOneShelterWithAddressById(
        shelterId,
      );

      res.status(200).send({ shelter });
    } catch (err) {
      next(err);
    }
  }

  static async createShelter(req, res, next) {
    try {
      const dataShelter = req.body;
      const shelter = await ShelterModel.insertShelter(dataShelter);

      res.status(201).send({ shelter });
    } catch (err) {
      next(err);
    }
  }

  static async updateShelter(req, res, next) {
    try {
      const shelterId = req.params.id;
      const { body } = req;
      const shelter = await ShelterModel.updateShelterById(shelterId, body);

      res.status(200).send({ shelter });
    } catch (err) {
      next(err);
    }
  }

  static async deleteShelter(req, res, next) {
    try {
      const shelterId = req.params.id;
      await ShelterModel.deleteShelterById(shelterId);

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}

export default ShelterController;
