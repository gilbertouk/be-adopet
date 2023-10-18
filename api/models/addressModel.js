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
          const shelter = await prisma.shelter.findUnique({
            where: { id: Number(shelterId) },
          });

          if (shelter) {
            objAddress.shelter_id = +shelterId;
          } else {
            const objErr = {
              status: 404,
              message: 'shelter not found',
            };

            throw objErr;
          }
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

  static async updateUserAddressById(userId, body) {
    try {
      if (Number.isNaN(Number(userId))) {
        const objErr = {
          status: 400,
          message: 'userId query must be a number',
        };
        throw objErr;
      }

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: {
          address: true,
        },
      });

      if (!user) {
        const objErr = {
          status: 404,
          message: 'user not found',
        };
        throw objErr;
      }

      if (!user.address) {
        const objErr = {
          status: 400,
          message: 'user does not have an address',
        };
        throw objErr;
      }

      const result = addressValidate({ ...user.address, ...body });

      if (!result.success) {
        const objErr = {
          status: 400,
          message: result.message,
        };
        throw objErr;
      }

      const addressObjToUpdate = {
        number: body.number || user.address.number,
        postcode: body.postcode || user.address.postcode,
        address: body.address || user.address.address,
        city: body.city || user.address.city,
        country: body.country || user.address.country,
      };

      const addressUpdated = await prisma.address.update({
        where: { user_id: +userId },
        data: addressObjToUpdate,
      });

      return addressUpdated;
    } catch (err) {
      const objErr = {
        status: err.status,
        message: err.message,
      };

      throw objErr;
    }
  }

  static async updateShelterAddressById(shelterId, body) {
    try {
      if (Number.isNaN(Number(shelterId))) {
        const objErr = {
          status: 400,
          message: 'shelterId query must be a number',
        };
        throw objErr;
      }

      const shelter = await prisma.shelter.findUnique({
        where: { id: Number(shelterId) },
        include: {
          address: true,
        },
      });

      if (!shelter) {
        const objErr = {
          status: 404,
          message: 'shelter not found',
        };
        throw objErr;
      }

      if (!shelter.address) {
        const objErr = {
          status: 400,
          message: 'shelter does not have an address',
        };
        throw objErr;
      }

      const result = addressValidate({ ...shelter.address, ...body });

      if (!result.success) {
        const objErr = {
          status: 400,
          message: result.message,
        };
        throw objErr;
      }

      const addressObjToUpdate = {
        number: body.number || shelter.address.number,
        postcode: body.postcode || shelter.address.postcode,
        address: body.address || shelter.address.address,
        city: body.city || shelter.address.city,
        country: body.country || shelter.address.country,
      };

      const addressUpdated = await prisma.address.update({
        where: { shelter_id: +shelterId },
        data: addressObjToUpdate,
      });

      return addressUpdated;
    } catch (err) {
      const objErr = {
        status: err.status,
        message: err.message,
      };

      throw objErr;
    }
  }

  static async deleteUserAddressById(userId) {
    try {
      if (Number.isNaN(Number(userId))) {
        const objErr = {
          status: 400,
          message: 'userId query must be a number',
        };
        throw objErr;
      }

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: {
          address: true,
        },
      });

      if (!user) {
        const objErr = {
          status: 404,
          message: 'user not found',
        };
        throw objErr;
      }

      if (!user.address) {
        const objErr = {
          status: 400,
          message: 'user does not have an address',
        };
        throw objErr;
      }

      const deleted = await prisma.address.delete({
        where: { user_id: +userId },
      });
      return deleted;
    } catch (err) {
      const objErr = {
        status: err.status,
        message: err.message,
      };

      throw objErr;
    }
  }

  static async deleteShelterAddressById(shelterId) {
    try {
      if (Number.isNaN(Number(shelterId))) {
        const objErr = {
          status: 400,
          message: 'shelterId query must be a number',
        };
        throw objErr;
      }

      const shelter = await prisma.shelter.findUnique({
        where: { id: Number(shelterId) },
        include: {
          address: true,
        },
      });

      if (!shelter) {
        const objErr = {
          status: 404,
          message: 'shelter not found',
        };
        throw objErr;
      }

      if (!shelter.address) {
        const objErr = {
          status: 400,
          message: 'shelter does not have an address',
        };
        throw objErr;
      }

      const deleted = await prisma.address.delete({
        where: { shelter_id: +shelterId },
      });
      return deleted;
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
