import AddressModel from '../models/addressModel.js';

class AddressController {
  static async createAddress(req, res, next) {
    try {
      const userId = req.params.user_id;
      const shelterId = req.params.shelter_id;
      const { body } = req;
      const insertedAddress = await AddressModel.insertAddress(
        userId,
        shelterId,
        body,
      );
      res.status(201).send({ address: insertedAddress });
    } catch (err) {
      next(err);
    }
  }

  static async updateUserAddress(req, res, next) {
    try {
      const userId = req.params.user_id;
      const { body } = req;

      const addressUpdated = await AddressModel.updateUserAddressById(
        userId,
        body,
      );

      res.status(200).send({ address: addressUpdated });
    } catch (err) {
      next(err);
    }
  }

  static async updateShelterAddress(req, res, next) {
    try {
      const shelterId = req.params.shelter_id;
      const { body } = req;

      const addressUpdated = await AddressModel.updateShelterAddressById(
        shelterId,
        body,
      );

      res.status(200).send({ address: addressUpdated });
    } catch (err) {
      next(err);
    }
  }

  static async deleteUserAddress(req, res, next) {
    try {
      const userId = req.params.user_id;
      await AddressModel.deleteUserAddressById(userId);

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }

  static async deleteShelterAddress(req, res, next) {
    try {
      const shelterId = req.params.shelter_id;
      await AddressModel.deleteShelterAddressById(shelterId);

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}

export default AddressController;
