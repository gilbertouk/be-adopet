import supertest from 'supertest';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import app from '../../api/index.js';

const prisma = new PrismaClient();
const request = supertest(app);

beforeEach(() => {
  // execSync('npx prisma db push --force-reset');
  // execSync('npx prisma db seed');
  execSync('replibyte -c conf.yaml dump restore remote -v latest');
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET on /pets', () => {
  test('GET: 200 status', async () => {
    await request.get('/pets').expect(200);
  });

  test.only('GET: 200 status with pets data from database', async () => {
    const { body } = await request.get('/pets');

    expect(body.pets.length).toBe(15);
  });
});
