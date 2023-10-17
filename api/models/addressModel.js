import { PrismaClient } from '@prisma/client';
import addressValidate from '../validators/addressValidators.js';

const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

class AddressModel {
  static async insertAddress(userId, shelterId, body) {
    try {
      const objAddress = {
        number: body.number,
        postcode: body.postcode,
        address: body.address,
        city: body.city,
        country: body.country || null,
        user_id: null,
        shelter_id: null,
      };

      if (userId) {
        if (Number.isNaN(+userId)) {
          const objErr = {
            status: 400,
            message: 'userId query must be a number',
          };

          throw objErr;
        } else {
          const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
          });

          if (user) {
            objAddress.user_id = +userId;
          } else {
            const objErr = {
              status: 404,
              message: 'user not found',
            };

            throw objErr;
          }
        }
      }

      if (shelterId) {
        if (Number.isNaN(+shelterId)) {
          const objErr = {
            status: 400,
            message: 'shelterId query must be a number',
          };

          throw objErr;
        } else {
          objAddress.shelter_id = +shelterId;
        }
      }

      const result = addressValidate(objAddress);

      if (!result.success) {
        const objErr = {
          status: 400,
          message: result.message,
        };

        throw objErr;
      }

      const insertedAddress = await prisma.address.create({
        data: objAddress,
      });

      return insertedAddress;
    } catch (err) {
      const objErr = {
        status: err.status,
        message: err.message,
      };

      throw objErr;
    }
  }
}

export default AddressModel;
