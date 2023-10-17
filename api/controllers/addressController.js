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

  static async updateAddress(req, res, next) {
    try {
      const userId = req.params.user_id;
      const shelterId = req.params.shelter_id;
      const { body } = req;

      console.log(userId, shelterId, body);

      res.status(200).send({ message: 'OK' });
    } catch (err) {
      next(err);
    }
  }

  static async deleteAddress(req, res, next) {
    try {
      const userId = req.params.user_id;
      const shelterId = req.params.shelter_id;
      const { body } = req;

      console.log(userId, shelterId, body);

      res.status(200).send({ message: 'OK' });
    } catch (err) {
      next(err);
    }
  }
}

export default AddressController;
