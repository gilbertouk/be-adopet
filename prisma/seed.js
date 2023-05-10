/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import { PrismaClient } from '@prisma/client';
import userData from './data/users.js';
import shelterData from './data/shelters.js';
import addressData from './data/adresses.js';
import petData from './data/pets.js';
import adoptionData from './data/adoptions.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  await prisma.user.createMany({
    data: userData,
  });

  await prisma.shelter.createMany({
    data: shelterData,
  });

  await prisma.address.createMany({
    data: addressData,
  });

  await prisma.pet.createMany({
    data: petData,
  });

  await prisma.adoption.createMany({
    data: adoptionData,
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
