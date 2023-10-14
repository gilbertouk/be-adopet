/* eslint-disable object-curly-newline */
import supertest from 'supertest';
import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import app from '../../api/index.js';
import seed from '../../db/seeds/seed.js';
import db from '../../db/connection.js';

const request = supertest(app);

beforeEach(async () => {
  await seed();
});

afterAll(async () => {
  await db.end();
});

describe('GET on /pets', () => {
  test('GET: 200 status', async () => {
    await request.get('/pets').expect(200);
  });

  test('GET: 200 status with pets data from database', async () => {
    const { body } = await request.get('/pets');

    expect(body.pets.length).toBe(15);
    body.pets.forEach((pet) => {
      expect(pet).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          url_photo: expect.any(String),
          age: expect.any(String),
          description: expect.any(String),
          available: expect.any(Boolean),
          name: expect.any(String),
          shelter_id: expect.any(Number),
        }),
      );
    });
  });
});

describe('GET on /pets/available', () => {
  test('GET: 200 status', async () => {
    await request.get('/pets/available').expect(200);
  });

  test('GET: 200 status with available pets data from database', async () => {
    const { body } = await request.get('/pets/available');

    expect(body.petsAvailable.length).toBe(11);
    body.petsAvailable.forEach((pet) => {
      expect(pet).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          url_photo: expect.any(String),
          age: expect.any(String),
          description: expect.any(String),
          available: expect.any(Boolean),
          name: expect.any(String),
          shelter_id: expect.any(Number),
        }),
      );
    });
  });
});

describe('GET on /pet/:id', () => {
  test('GET: 200 status', async () => {
    await request.get('/pet/1').expect(200);
  });

  test('GET: 200 status with pet data from database by petId', async () => {
    const { body } = await request.get('/pet/1');
    expect(body.pet).toEqual({
      id: 1,
      createdAt: '2023-10-12T14:47:10.759Z',
      updatedAt: '2023-10-12T14:47:10.759Z',
      url_photo: 'https://example.com/photos/1',
      age: '2019-05-10T00:00:00.000Z',
      description: 'Cute and cuddly, this puppy will steal your heart.',
      available: true,
      name: 'Buddy',
      shelter_id: 1,
    });
  });

  test('GET: 404 status when given petId that not exist on database', async () => {
    const { body } = await request.get('/pet/100').expect(404);
    expect(body.message).toBe('pet not found');
  });

  test('GET: 400 status when given invalid petId', async () => {
    const { body } = await request.get('/pet/invalid').expect(400);
    expect(body.message).toBe('petId query must be a number');
  });
});

describe('POST on /pet', () => {
  test('POST: 201 status response with the pet data inserted', async () => {
    const { body } = await request
      .post('/pet')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'Tong',
        shelter_id: 1,
      })
      .expect(201);
    expect(body.pet).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      url_photo: 'http://example.com/photos/3',
      age: '2018-01-10T00:00:00.000Z',
      description: 'Loyal and friendly, this dog loves to be by your side.',
      available: true,
      name: 'Tong',
      shelter_id: 1,
    });
  });

  test('POST: 201 status response with the pet data inserted ignored extras fields on body request', async () => {
    const { body } = await request
      .post('/pet')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'Tong',
        shelter_id: 1,
        test: 'tests',
      })
      .expect(201);
    expect(body.pet).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      url_photo: 'http://example.com/photos/3',
      age: '2018-01-10T00:00:00.000Z',
      description: 'Loyal and friendly, this dog loves to be by your side.',
      available: true,
      name: 'Tong',
      shelter_id: 1,
    });
    expect(body.pet).not.toContain('test');
  });

  test('POST: 400 status when given invalid url_photo on body request', async () => {
    const { body } = await request
      .post('/pet')
      .send({
        url_photo: 'example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'Tong',
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe('invalid url');
  });

  test('POST: 400 status when not given url_photo on body request', async () => {
    const { body } = await request
      .post('/pet')
      .send({
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'Tong',
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe('url_photo field is required');
  });

  test('POST: 400 status when given invalid age on body request', async () => {
    const { body } = await request
      .post('/pet')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-100',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'Tong',
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe(
      "age field is required and must be the pet's date of birth",
    );
  });

  test('POST: 400 status when not given age on body request', async () => {
    const { body } = await request
      .post('/pet')
      .send({
        url_photo: 'http://example.com/photos/3',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'Tong',
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe(
      "age field is required and must be the pet's date of birth",
    );
  });

  test('POST: 400 status when given invalid description on body request', async () => {
    const { body } = await request
      .post('/pet')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 10,
        available: true,
        name: 'Tong',
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe('description must be a string');
  });

  test('POST: 400 status when not given description on body request', async () => {
    const { body } = await request
      .post('/pet')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        available: true,
        name: 'Tong',
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe('description field is required');
  });

  test('POST: 400 status when given description less than 12 characters on body request', async () => {
    const { body } = await request
      .post('/pet')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: '12345678911',
        available: true,
        name: 'Tong',
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe('description must be 12 or more characters long');
  });

  test('POST: 400 status when given invalid available on body request', async () => {
    const { body } = await request
      .post('/pet')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: 10,
        name: 'Tong',
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe('available must be a boolean');
  });

  test('POST: 400 status when not given available on body request', async () => {
    const { body } = await request
      .post('/pet')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        name: 'Tong',
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe('available field is required');
  });

  test('POST: 400 status when given invalid name on body request', async () => {
    const { body } = await request
      .post('/pet')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: true,
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe('name must be a string');
  });

  test('POST: 400 status when not given name on body request', async () => {
    const { body } = await request
      .post('/pet')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe('name field is required');
  });

  test('POST: 400 status when given name less than 2 characters on body request', async () => {
    const { body } = await request
      .post('/pet')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'T',
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe('name must be 2 or more characters long');
  });

  test('POST: 400 status when given invalid shelter_id on body request', async () => {
    const { body } = await request
      .post('/pet')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'Tong',
        shelter_id: 'ted',
      })
      .expect(400);
    expect(body.message).toBe('shelter_id must be a number');
  });

  test('POST: 400 status when not given shelter_id on body request', async () => {
    const { body } = await request
      .post('/pet')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'Tong',
      })
      .expect(400);
    expect(body.message).toBe('shelter_id field is required');
  });

  test('POST: 400 status when given shelter_id on body request that not exist on database', async () => {
    const { body } = await request
      .post('/pet')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'Tong',
        shelter_id: 100,
      })
      .expect(404);
    expect(body.message).toBe('shelter_id not found');
  });
});

describe('PUT on /pet/:id', () => {
  test('PUT: 200 status response with the pet data updated', async () => {
    const { body } = await request
      .put('/pet/2')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'Tong',
        shelter_id: 1,
      })
      .expect(200);
    expect(body.pet).toEqual({
      id: 2,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      url_photo: 'http://example.com/photos/3',
      age: '2018-01-10T00:00:00.000Z',
      description: 'Loyal and friendly, this dog loves to be by your side.',
      available: true,
      name: 'Tong',
      shelter_id: 1,
    });
  });

  test('PUT: 400 status when given invalid petId', async () => {
    const { body } = await request
      .put('/pet/invalid')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'Tong',
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe('pet_id query must be a number');
  });

  test('PUT: 404 status when given petId that not exist on database', async () => {
    const { body } = await request
      .put('/pet/100')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'Tong',
        shelter_id: 1,
      })
      .expect(404);
    expect(body.message).toBe('pet not found');
  });

  test('PUT: 400 status when given invalid url_photo on body request', async () => {
    const { body } = await request
      .put('/pet/2')
      .send({
        url_photo: 'example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'Tong',
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe('invalid url');
  });

  test('PUT: 400 status when given invalid age on body request', async () => {
    const { body } = await request
      .put('/pet/2')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-100',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'Tong',
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe(
      "age field is required and must be the pet's date of birth",
    );
  });

  test('PUT: 400 status when given invalid description on body request', async () => {
    const { body } = await request
      .put('/pet/2')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 10,
        available: true,
        name: 'Tong',
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe('description must be a string');
  });

  test('PUT: 400 status when given description less than 12 characters on body request', async () => {
    const { body } = await request
      .put('/pet/2')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: '12345678911',
        available: true,
        name: 'Tong',
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe('description must be 12 or more characters long');
  });

  test('PUT: 400 status when given invalid available on body request', async () => {
    const { body } = await request
      .put('/pet/2')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: 10,
        name: 'Tong',
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe('available must be a boolean');
  });

  test('PUT: 400 status when given invalid name on body request', async () => {
    const { body } = await request
      .put('/pet/2')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: true,
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe('name must be a string');
  });

  test('PUT: 400 status when given name less than 2 characters on body request', async () => {
    const { body } = await request
      .put('/pet/2')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'T',
        shelter_id: 1,
      })
      .expect(400);
    expect(body.message).toBe('name must be 2 or more characters long');
  });

  test('PUT: 400 status when given invalid shelter_id on body request', async () => {
    const { body } = await request
      .put('/pet/2')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'Tong',
        shelter_id: 'ted',
      })
      .expect(400);
    expect(body.message).toBe('shelter_id must be a number');
  });

  test('PUT: 400 status when given shelter_id on body request that not exist on database', async () => {
    const { body } = await request
      .put('/pet/2')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'Tong',
        shelter_id: 100,
      })
      .expect(400);
    expect(body.message).toBe('shelter_id not found');
  });

  test('PUT: 200 status when given others fields on body request that do not need', async () => {
    const { body } = await request
      .put('/pet/2')
      .send({
        url_photo: 'http://example.com/photos/3',
        age: '2018-01-10',
        description: 'Loyal and friendly, this dog loves to be by your side.',
        available: true,
        name: 'Tong',
        shelter_id: 1,
        test: 'test',
        tests: 'test',
      })
      .expect(200);
    expect(body.pet).toEqual({
      id: 2,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      url_photo: 'http://example.com/photos/3',
      age: '2018-01-10T00:00:00.000Z',
      description: 'Loyal and friendly, this dog loves to be by your side.',
      available: true,
      name: 'Tong',
      shelter_id: 1,
    });
    expect(body.pet).not.toContain('test');
    expect(body.pet).not.toContain('tests');
  });
});

describe('DELETE on /pet/:id', () => {
  test('DELETE: 404 status when given petId that not exist on database', async () => {
    const { body } = await request.delete('/pet/200').expect(404);
    expect(body.message).toBe('pet not found');
  });

  test('DELETE: 400 status when given invalid petId', async () => {
    const { body } = await request.delete('/pet/invalid').expect(400);
    expect(body.message).toBe('pet_id query must be a number');
  });

  test('DELETE: 400 status when given pet that have adoption', async () => {
    const { body } = await request.delete('/pet/2').expect(400);
    expect(body.message).toBe(
      'it is necessary to delete the adoption first before deleting the pet',
    );
  });

  test('DELETE: 204 status when given pet that have adoption', async () => {
    await request.delete('/pet/3').expect(204);
  });
});
