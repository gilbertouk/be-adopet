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

describe('GET on /shelters', () => {
  test('GET: 200 status', async () => {
    await request.get('/shelters').expect(200);
  });

  test('GET: 200 status with all shelters data form database', async () => {
    const { body } = await request.get('/shelters');
    expect(body.shelters.length).toBe(10);
    body.shelters.forEach((shelter) => {
      expect(shelter.id).toEqual(expect.any(Number));
      expect(shelter.createdAt).toEqual(expect.any(String));
      expect(shelter.updatedAt).toEqual(expect.any(String));
      expect(shelter.name).toEqual(expect.any(String));
      expect(shelter.email).toEqual(expect.any(String));
      expect(shelter.password).toEqual(expect.any(String));
      expect(shelter.phone).toEqual(expect.any(String));
      expect(shelter.about).toEqual(expect.any(String));
      expect(shelter.active).toEqual(expect.any(Boolean));
    });
  });
});

describe('GET on /shelter/:id', () => {
  test('GET: 200 status', async () => {
    await request.get('/shelter/2').expect(200);
  });

  test('GET: 200 status responds with the shelter data by id given on request', async () => {
    const { body } = await request.get('/shelter/2');
    expect(body.shelter).toEqual({
      id: 2,
      createdAt: '2023-10-12T14:47:10.748Z',
      updatedAt: '2023-10-12T14:47:10.748Z',
      name: 'Ladonna Rosenstiel',
      email: 'lrosenstiel1@redcross.org',
      password: 'R8bD8nd',
      phone: '591-298-3059',
      about:
        'eget vulputate ut ultrices vel augue vestibulum ante ipsum primis',
      active: true,
    });
  });

  test('GET: 400 status when given invalid id on request', async () => {
    const result = await request.get('/shelter/invalid');
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('shelterId query must be a number');
  });

  test('GET: 404 status when given shelter id on request that not exist on database', async () => {
    const result = await request.get('/shelter/100');
    expect(result.status).toBe(404);
    expect(result.body.message).toBe('shelter not found');
  });
});

describe('GET on /shelter/:id/address', () => {
  test('GET: 200 status', async () => {
    await request.get('/shelter/2/address').expect(200);
  });

  test('GET: 200 status responds with the shelter data by id given on request', async () => {
    const { body } = await request.get('/shelter/2/address');
    expect(body.shelter).toEqual({
      id: 2,
      createdAt: '2023-10-12T14:47:10.748Z',
      updatedAt: '2023-10-12T14:47:10.748Z',
      name: 'Ladonna Rosenstiel',
      email: 'lrosenstiel1@redcross.org',
      password: 'R8bD8nd',
      phone: '591-298-3059',
      about:
        'eget vulputate ut ultrices vel augue vestibulum ante ipsum primis',
      active: true,
      address: {
        id: 11,
        createdAt: '2023-10-12T14:47:10.752Z',
        updatedAt: '2023-10-12T14:47:10.752Z',
        number: '13',
        postcode: 'BA21 4EX',
        address: '13th Floor',
        city: 'Haquira',
        country: 'Peru',
        user_id: null,
        shelter_id: 2,
      },
    });
  });

  test('GET: 400 status when given invalid id on request', async () => {
    const result = await request.get('/shelter/invalid/address');
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('shelterId query must be a number');
  });

  test('GET: 404 status when given shelter id on request that not exist on database', async () => {
    const result = await request.get('/shelter/100/address');
    expect(result.status).toBe(404);
    expect(result.body.message).toBe('shelter not found');
  });

  test('GET: 200 status when given shelter id on request that does not have address on database', async () => {
    const { body } = await request.get('/shelter/10/address');
    expect(body.shelter).toEqual({
      id: 10,
      createdAt: '2023-10-12T14:47:10.748Z',
      updatedAt: '2023-10-12T14:47:10.748Z',
      name: 'Fabiano Topley',
      email: 'ftopley9@auda.org.au',
      password: 'jhM8biqLax',
      phone: '109-878-6124',
      about: 'maecenas tristique est et tempus semper est',
      active: true,
      address: null,
    });
  });
});

describe('POST on /shelter', () => {
  test('POST: 400 status when not given name on body request', async () => {
    const result = await request.post('/shelter').send({
      email: 'ftopley9@auda.org.au',
      password: 'jhM8bsada',
      phone: '109-878-6124',
      about: 'maecenas tristique est et tempus semper est',
    });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('name field is required');
  });

  test('POST: 400 status when given invalid name on body request', async () => {
    const result = await request.post('/shelter').send({
      name: 'test',
      email: 'ftopley9@auda.org.au',
      password: 'jhM8bsada',
      phone: '109-878-6124',
      about: 'maecenas tristique est et tempus semper est',
    });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('name must be 6 or more characters long');
  });

  test('POST: 400 status when not given email on body request', async () => {
    const result = await request.post('/shelter').send({
      name: 'Fabiano Topley',
      password: 'jhM8bsada',
      phone: '109-878-6124',
      about: 'maecenas tristique est et tempus semper est',
    });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('email field is required');
  });

  test('POST: 400 status when given invalid email on body request', async () => {
    const result = await request.post('/shelter').send({
      name: 'Fabiano Topley',
      email: 'ftopley9auda.org.au',
      password: 'jhM8bsada',
      phone: '109-878-6124',
      about: 'maecenas tristique est et tempus semper est',
    });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('invalid email address');
  });

  test('POST: 400 status when not given phone on body request', async () => {
    const result = await request.post('/shelter').send({
      name: 'Fabiano Topley',
      password: 'jhM8bsada',
      email: 'ftopley9@auda.org.au',
      about: 'maecenas tristique est et tempus semper est',
    });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('phone field is required');
  });

  test('POST: 400 status when given invalid phone on body request', async () => {
    const result = await request.post('/shelter').send({
      name: 'Fabiano Topley',
      email: 'ftopley9@auda.org.au',
      password: 'jhM8bsada',
      phone: '109-878',
      about: 'maecenas tristique est et tempus semper est',
    });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('phone must be 8 or more numbers long');
  });

  test('POST: 400 status when not given about on body request', async () => {
    const result = await request.post('/shelter').send({
      name: 'Fabiano Topley',
      password: 'jhM8bsada',
      email: 'ftopley9@auda.org.au',
      phone: '109-878-6124',
    });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('about field is required');
  });

  test('POST: 400 status when given invalid about on body request', async () => {
    const result = await request.post('/shelter').send({
      name: 'Fabiano Topley',
      email: 'ftopley9@auda.org.au',
      password: 'jhM8bsada',
      phone: '109-878-4234',
      about: 'test',
    });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe(
      'about must be 10 or more characters long',
    );
  });

  test('POST: 400 status when not given password on body request', async () => {
    const result = await request.post('/shelter').send({
      name: 'Fabiano Topley',
      email: 'ftopley9@auda.org.au',
      phone: '109-878-6124',
      about: 'maecenas tristique est et tempus semper est',
    });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('password field is required');
  });

  test('POST: 400 status when given invalid password on body request', async () => {
    const result = await request.post('/shelter').send({
      name: 'Fabiano Topley',
      email: 'ftopley9@auda.org.au',
      password: 'jhM8',
      phone: '109-878-6124',
      about: 'maecenas tristique est et tempus semper est',
    });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe(
      'password must be 8 or more characters long',
    );
  });

  test('POST: 201 status with shelter data inserted', async () => {
    const { body } = await request
      .post('/shelter')
      .send({
        name: 'Fabiano Topley',
        email: 'ftopley9@auda.org.au',
        password: 'jhM823424',
        phone: '109-878-6124',
        about: 'maecenas tristique est et tempus semper est',
      })
      .expect(201);

    expect(body.shelter).toEqual({
      name: 'Fabiano Topley',
      email: 'ftopley9@auda.org.au',
      password: 'jhM823424',
      phone: '109-878-6124',
      about: 'maecenas tristique est et tempus semper est',
      id: expect.any(Number),
      active: expect.any(Boolean),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  test('POST: 201 status with shelter data inserted ignored extras fields on body request', async () => {
    const { body } = await request
      .post('/shelter')
      .send({
        name: 'Fabiano Topley',
        email: 'ftopley9@auda.org.au',
        password: 'jhM823424',
        phone: '109-878-6124',
        about: 'maecenas tristique est et tempus semper est',
        test: 'test',
      })
      .expect(201);

    expect(body.shelter).toEqual({
      name: 'Fabiano Topley',
      email: 'ftopley9@auda.org.au',
      password: 'jhM823424',
      phone: '109-878-6124',
      about: 'maecenas tristique est et tempus semper est',
      id: expect.any(Number),
      active: expect.any(Boolean),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    expect(body.shelter).not.toHaveProperty('test');
  });
});

describe('PUT on /shelter/:id', () => {
  test('PUT: 400 status when given invalid id', async () => {
    const result = await request.put('/shelter/invalid').send({
      email: 'ftopley9@auda.org.au',
      password: 'jhM8bsada',
      phone: '109-878-6124',
      about: 'maecenas tristique est et tempus semper est',
    });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('shelterId query must be a number');
  });

  test('PUT: 400 status when given id does not exist on database', async () => {
    const result = await request.put('/shelter/100').send({
      email: 'ftopley9@auda.org.au',
      password: 'jhM8bsada',
      phone: '109-878-6124',
      about: 'maecenas tristique est et tempus semper est',
    });
    expect(result.status).toBe(404);
    expect(result.body.message).toBe('shelter not found');
  });

  test('PUT: 400 status when given invalid name on body request', async () => {
    const result = await request.put('/shelter/2').send({
      name: 'test',
      password: '135dad434f43',
    });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('name must be 6 or more characters long');
  });

  test('PUT: 400 status when given invalid email on body request', async () => {
    const result = await request.put('/shelter/2').send({
      name: 'Fabiano Topley',
      email: 'ftopley9auda.org.au',
      password: 'jhM8bsada',
    });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('invalid email address');
  });

  test('PUT: 400 status when given invalid phone on body request', async () => {
    const result = await request.put('/shelter/2').send({
      password: 'jhM8bsada',
      phone: '109-878',
    });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('phone must be 8 or more numbers long');
  });

  test('PUT: 400 status when given invalid about on body request', async () => {
    const result = await request.put('/shelter/2').send({
      password: 'jhM8bsada',
      about: 'test',
    });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe(
      'about must be 10 or more characters long',
    );
  });

  test('PUT: 400 status when given invalid password on body request', async () => {
    const result = await request.put('/shelter/2').send({
      password: 'jhM8',
    });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe(
      'password must be 8 or more characters long',
    );
  });

  test('PUT: 201 status with shelter data updated', async () => {
    const { body } = await request
      .put('/shelter/2')
      .send({
        name: 'Gilberto Antonio',
        email: 'gilberto@auda.org.au',
        password: '123456789',
        phone: '0000-111-222',
        about: 'test test test test',
      })
      .expect(200);

    expect(body.shelter).toEqual({
      name: 'Gilberto Antonio',
      email: 'gilberto@auda.org.au',
      password: '123456789',
      phone: '0000-111-222',
      about: 'test test test test',
      id: expect.any(Number),
      active: expect.any(Boolean),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  test('PUT: 201 status with shelter data updated ignored extras fields on body request', async () => {
    const { body } = await request
      .put('/shelter/2')
      .send({
        name: 'Gilberto Antonio',
        email: 'gilberto@auda.org.au',
        password: '123456789',
        phone: '0000-111-222',
        about: 'test test test test',
        test: 'test',
      })
      .expect(200);

    expect(body.shelter).toEqual({
      name: 'Gilberto Antonio',
      email: 'gilberto@auda.org.au',
      password: '123456789',
      phone: '0000-111-222',
      about: 'test test test test',
      id: expect.any(Number),
      active: expect.any(Boolean),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    expect(body.shelter).not.toHaveProperty('test');
  });
});

describe('DELETE on /shelter/:id', () => {
  test('DELETE: 400 status when try delete shelter that have pets on database', async () => {
    const response = await request.delete('/shelter/9').expect(400);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'it was not possible to delete the shelter because it has registered pets',
    );
  });

  test('DELETE: 204 status no content', async () => {
    const response = await request.delete('/shelter/10');
    expect(response.status).toBe(204);
  });

  test('DELETE: 404 status when given id does not exist on database', async () => {
    const response = await request.delete('/shelter/100');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('shelter not found');
  });

  test('DELETE: 400 status when given invalid id', async () => {
    const response = await request.delete('/shelter/invalid');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('shelterId query must be a number');
  });
});
