/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import userData from './data/users.js';
import shelterData from './data/shelters.js';
import addressData from './data/addresses.js';
import petData from './data/pets.js';
import adoptionData from './data/adoptions.js';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({ data: userData });
  await prisma.shelter.createMany({ data: shelterData });
  await prisma.address.createMany({ data: addressData });
  await prisma.pet.createMany({ data: petData });
  await prisma.adoption.createMany({ data: adoptionData });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
