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

describe('GET on /adoption', () => {
  test('GET: 200 status', async () => {
    await request.get('/adoption').expect(200);
  });

  test('GET: 200 status with all adoptions from database', async () => {
    const { body } = await request.get('/adoption');
    expect(body.adoptions.length).toBe(5);
    body.adoptions.forEach((adoption) => {
      expect(adoption.id).toEqual(expect.any(Number));
      expect(adoption.createdAt).toEqual(expect.any(String));
      expect(adoption.updatedAt).toEqual(expect.any(String));
      expect(adoption.date).toEqual(expect.any(String));
      expect(adoption.user_id).toEqual(expect.any(Number));
      expect(adoption.pet_id).toEqual(expect.any(Number));
    });
  });

  test('GET: 200 status with one adoption from database by adoptionId', async () => {
    const { body } = await request.get('/adoption?adoptionId=1');
    expect(body.adoptions[0]).toEqual({
      id: 1,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      date: '2023-05-09T00:00:00.000Z',
      user_id: 1,
      pet_id: 2,
    });
  });

  test('GET: 200 status with one adoption from database by petId', async () => {
    const { body } = await request.get('/adoption?petId=4');
    expect(body.adoptions[0]).toEqual({
      id: 2,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      date: '2023-05-10T00:00:00.000Z',
      user_id: 2,
      pet_id: 4,
    });
  });

  test('GET: 200 status with one adoption from database by userId', async () => {
    const { body } = await request.get('/adoption?userId=3');
    expect(body.adoptions[0]).toEqual({
      id: 3,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      date: '2023-05-11T00:00:00.000Z',
      user_id: 3,
      pet_id: 7,
    });
  });

  test('GET: 400 status when given invalid petId query', async () => {
    const { body } = await request.get('/adoption?petId=invalid').expect(400);
    expect(body.message).toBe('petId query must be a number');
  });

  test('GET: 400 status when given invalid userId query', async () => {
    const { body } = await request.get('/adoption?userId=invalid').expect(400);
    expect(body.message).toBe('userId query must be a number');
  });

  test('GET: 400 status when given invalid adoptionId query', async () => {
    const { body } = await request
      .get('/adoption?adoptionId=invalid')
      .expect(400);
    expect(body.message).toBe('adoptionId query must be a number');
  });

  test('GET: 404 status when given any query (adoptionId, userId and petId) does not exist', async () => {
    const { body } = await request.get('/adoption?adoptionId=23').expect(404);
    expect(body.message).toBe('adoptions not found');
  });
});

describe('POST on /adoption', () => {
  test('GET: 201 status with adoption data inserted', async () => {
    const { body } = await request
      .post('/adoption')
      .send({
        date: '2023-05-13',
        pet_id: 13,
        user_id: 1,
      })
      .expect(201);

    expect(body.adoption).toEqual({
      id: 6,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      date: '2023-05-13T00:00:00.000Z',
      user_id: 1,
      pet_id: 13,
    });
  });

  test('GET: 400 status when given invalid date on body request', async () => {
    const { body } = await request
      .post('/adoption')
      .send({
        date: '2023-05-133',
        pet_id: 13,
        user_id: 1,
      })
      .expect(400);

    expect(body.message).toBe('date field must be the adoption date');
  });

  test('GET: 400 status when not given date on body request', async () => {
    const { body } = await request
      .post('/adoption')
      .send({
        pet_id: 13,
        user_id: 1,
      })
      .expect(400);

    expect(body.message).toBe('date field is required');
  });

  test('GET: 400 status when given invalid pet_id on body request', async () => {
    const { body } = await request
      .post('/adoption')
      .send({
        date: '2023-05-13',
        pet_id: 'invalid',
        user_id: 1,
      })
      .expect(400);

    expect(body.message).toBe('pet_id field must be a number');
  });

  test('GET: 400 status when not given pet_id on body request', async () => {
    const { body } = await request
      .post('/adoption')
      .send({
        date: '2023-05-13',
        user_id: 1,
      })
      .expect(400);

    expect(body.message).toBe('pet_id field is required');
  });

  test('GET: 400 status when given invalid user_id on body request', async () => {
    const { body } = await request
      .post('/adoption')
      .send({
        date: '2023-05-13',
        pet_id: 13,
        user_id: 'invalid',
      })
      .expect(400);

    expect(body.message).toBe('user_id field must be a number');
  });

  test('GET: 400 status when not given user_id on body request', async () => {
    const { body } = await request
      .post('/adoption')
      .send({
        date: '2023-05-13',
        pet_id: 13,
      })
      .expect(400);

    expect(body.message).toBe('user_id field is required');
  });

  test('GET: 404 status when given pet_id on body request that does not exist on database', async () => {
    const { body } = await request
      .post('/adoption')
      .send({
        date: '2023-05-13',
        pet_id: 133,
        user_id: 1,
      })
      .expect(404);

    expect(body.message).toBe('pet not found');
  });

  test('GET: 400 status when given pet_id on body request that is not available for adoption', async () => {
    const { body } = await request
      .post('/adoption')
      .send({
        date: '2023-05-13',
        pet_id: 2,
        user_id: 1,
      })
      .expect(400);

    expect(body.message).toBe('pet is not available for adoption');
  });

  test('GET: 404 status when given user_id on body request that does not exist on database', async () => {
    const { body } = await request
      .post('/adoption')
      .send({
        date: '2023-05-13',
        pet_id: 13,
        user_id: 133,
      })
      .expect(404);

    expect(body.message).toBe('user not found');
  });

  test('GET: 400 status when given pet_id on body request that already exist on adoption table', async () => {
    const { body } = await request
      .post('/adoption')
      .send({
        date: '2023-05-13',
        pet_id: 14,
        user_id: 1,
      })
      .expect(400);

    expect(body.message).toBe('pet id 14 is not available for adoption');
  });
});

describe('DELETE on /adoption/:id', () => {
  test('GET: 204 status with no content responds', async () => {
    await request.delete('/adoption/5').expect(204);
  });

  test('GET: 400 status when given invalid id on body request', async () => {
    const { body } = await request.delete('/adoption/invalid').expect(400);

    expect(body.message).toBe('id must be a number');
  });

  test('GET: 404 status when given id does not exist on database', async () => {
    const { body } = await request.delete('/adoption/11').expect(404);

    expect(body.message).toBe('adoption not found');
  });
});
