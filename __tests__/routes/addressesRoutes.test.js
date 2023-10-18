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

describe('POST on /api/user/:user_id/address', () => {
  test('POST: 201 status and should return the address data posted', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const { body } = await request
      .post('/api/user/10/address')
      .send(addressMock)
      .expect(201);
    expect(body.address).toEqual({
      id: 19,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      ...addressMock,
      user_id: 10,
      shelter_id: null,
    });
  });

  test('POST: 400 status when given invalid userId', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .post('/api/user/invalid/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('userId query must be a number');
  });

  test('POST: 404 status when given userId that not exist on database', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .post('/api/user/100/address')
      .send(addressMock);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('user not found');
  });

  test('POST: 400 status when given body request without number field', async () => {
    const addressMock = {
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .post('/api/user/10/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('number field is required');
  });

  test('POST: 400 status when given body request with invalid number field', async () => {
    const addressMock = {
      number: 25,
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .post('/api/user/10/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('number field must be a string');
  });

  test('POST: 400 status when given body request without postcode field', async () => {
    const addressMock = {
      number: '25',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .post('/api/user/10/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('postcode field is required');
  });

  test('POST: 400 status when given body request with invalid postcode field', async () => {
    const addressMock = {
      number: '25',
      postcode: true,
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .post('/api/user/10/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('postcode field must be a string');
  });

  test('POST: 400 status when given body request without address field', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .post('/api/user/10/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('address field is required');
  });

  test('POST: 400 status when given body request with invalid address field', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: 10,
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .post('/api/user/10/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('address field must be a string');
  });

  test('POST: 400 status when given body request without city field', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '10 de dezembro',
      country: 'Brazil',
    };
    const response = await request
      .post('/api/user/10/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('city field is required');
  });

  test('POST: 400 status when given body request with invalid city field', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '10 de dezembro',
      city: false,
      country: 'Brazil',
    };
    const response = await request
      .post('/api/user/10/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('city field must be a string');
  });

  test('POST: 400 status when given body request with invalid country field', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '10 de dezembro',
      city: 'Goiania',
      country: 20145,
    };
    const response = await request
      .post('/api/user/10/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('country field must be a string');
  });

  test('POST: 201 status when given body request without country field', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
    };
    const { body } = await request
      .post('/api/user/10/address')
      .send(addressMock)
      .expect(201);
    expect(body.address).toEqual({
      id: 19,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      ...addressMock,
      country: null,
      user_id: 10,
      shelter_id: null,
    });
  });

  test('POST: 201 status when given body request with extras fields', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      test: 'test',
      boolean: true,
    };
    const { body } = await request
      .post('/api/user/10/address')
      .send(addressMock)
      .expect(201);
    expect(body.address).toEqual({
      id: 19,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: null,
      user_id: 10,
      shelter_id: null,
    });
    expect(body.address).not.toHaveProperty('test');
    expect(body.address).not.toHaveProperty('boolean');
  });
});

describe('POST on /api/shelter/:user_id/address', () => {
  test('POST: 201 status and should return the address data posted', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const { body } = await request
      .post('/api/shelter/10/address')
      .send(addressMock)
      .expect(201);
    expect(body.address).toEqual({
      id: 19,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      ...addressMock,
      user_id: null,
      shelter_id: 10,
    });
  });

  test('POST: 400 status when given invalid shelterId', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .post('/api/shelter/invalid/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('shelterId query must be a number');
  });

  test('POST: 404 status when given shelterId that not exist on database', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .post('/api/shelter/100/address')
      .send(addressMock);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('shelter not found');
  });

  test('POST: 400 status when given body request without number field', async () => {
    const addressMock = {
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .post('/api/shelter/10/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('number field is required');
  });

  test('POST: 400 status when given body request with invalid number field', async () => {
    const addressMock = {
      number: 25,
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .post('/api/shelter/10/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('number field must be a string');
  });

  test('POST: 400 status when given body request without postcode field', async () => {
    const addressMock = {
      number: '25',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .post('/api/shelter/10/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('postcode field is required');
  });

  test('POST: 400 status when given body request with invalid postcode field', async () => {
    const addressMock = {
      number: '25',
      postcode: true,
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .post('/api/shelter/10/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('postcode field must be a string');
  });

  test('POST: 400 status when given body request without address field', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .post('/api/shelter/10/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('address field is required');
  });

  test('POST: 400 status when given body request with invalid address field', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: 10,
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .post('/api/shelter/10/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('address field must be a string');
  });

  test('POST: 400 status when given body request without city field', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '10 de dezembro',
      country: 'Brazil',
    };
    const response = await request
      .post('/api/shelter/10/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('city field is required');
  });

  test('POST: 400 status when given body request with invalid city field', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '10 de dezembro',
      city: false,
      country: 'Brazil',
    };
    const response = await request
      .post('/api/shelter/10/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('city field must be a string');
  });

  test('POST: 400 status when given body request with invalid country field', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '10 de dezembro',
      city: 'Goiania',
      country: 20145,
    };
    const response = await request
      .post('/api/shelter/10/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('country field must be a string');
  });

  test('POST: 201 status when given body request without country field', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
    };
    const { body } = await request
      .post('/api/shelter/10/address')
      .send(addressMock)
      .expect(201);
    expect(body.address).toEqual({
      id: 19,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      ...addressMock,
      country: null,
      user_id: null,
      shelter_id: 10,
    });
  });

  test('POST: 201 status when given body request with extras fields', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      test: 'test',
      boolean: true,
    };
    const { body } = await request
      .post('/api/shelter/10/address')
      .send(addressMock)
      .expect(201);
    expect(body.address).toEqual({
      id: 19,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: null,
      user_id: null,
      shelter_id: 10,
    });
    expect(body.address).not.toHaveProperty('test');
    expect(body.address).not.toHaveProperty('boolean');
  });
});

describe('PUT on /api/user/:user_id/address', () => {
  test('PUT: 200 status and should return the address data updated', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const { body } = await request
      .put('/api/user/1/address')
      .send(addressMock)
      .expect(200);
    expect(body.address).toEqual({
      id: 1,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      ...addressMock,
      user_id: 1,
      shelter_id: null,
    });
  });

  test('PUT: 400 status when given invalid userId', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .put('/api/user/invalid/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('userId query must be a number');
  });

  test('PUT: 404 status when given userId that not exist on database', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .put('/api/user/100/address')
      .send(addressMock);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('user not found');
  });

  test('PUT: 400 status when given body request with invalid number field', async () => {
    const addressMock = {
      number: 25,
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request.put('/api/user/1/address').send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('number field must be a string');
  });

  test('PUT: 400 status when given body request with invalid postcode field', async () => {
    const addressMock = {
      number: '25',
      postcode: true,
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request.put('/api/user/1/address').send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('postcode field must be a string');
  });

  test('PUT: 400 status when given body request with invalid address field', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: 10,
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request.put('/api/user/1/address').send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('address field must be a string');
  });

  test('PUT: 400 status when given body request with invalid city field', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      city: false,
      country: 'Brazil',
    };
    const response = await request.put('/api/user/1/address').send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('city field must be a string');
  });

  test('PUT: 400 status when given body request with invalid country field', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '10 de dezembro',
      city: 'Goiania',
      country: 20145,
    };
    const response = await request.put('/api/user/1/address').send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('country field must be a string');
  });

  test('PUT: 200 status when given body request with extras fields', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      test: 'test',
      boolean: true,
    };
    const { body } = await request
      .put('/api/user/1/address')
      .send(addressMock)
      .expect(200);
    expect(body.address).toEqual({
      id: 1,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Poland',
      user_id: 1,
      shelter_id: null,
    });
    expect(body.address).not.toHaveProperty('test');
    expect(body.address).not.toHaveProperty('boolean');
  });

  test('PUT: 400 status when try to update user address does not have address yet on database', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
    };
    const { body } = await request
      .put('/api/user/10/address')
      .send(addressMock)
      .expect(400);
    expect(body.message).toBe('user does not have an address');
  });
});

describe('PUT on /api/shelter/:shelter_id/address', () => {
  test('PUT: 200 status and should return the address data updated', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const { body } = await request
      .put('/api/shelter/1/address')
      .send(addressMock)
      .expect(200);
    expect(body.address).toEqual({
      id: 10,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      ...addressMock,
      user_id: null,
      shelter_id: 1,
    });
  });

  test('PUT: 400 status when given invalid shelterId', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .put('/api/shelter/invalid/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('shelterId query must be a number');
  });

  test('PUT: 404 status when given shelterId that not exist on database', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .put('/api/shelter/100/address')
      .send(addressMock);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('shelter not found');
  });

  test('PUT: 400 status when given body request with invalid number field', async () => {
    const addressMock = {
      number: 25,
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .put('/api/shelter/1/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('number field must be a string');
  });

  test('PUT: 400 status when given body request with invalid postcode field', async () => {
    const addressMock = {
      number: '25',
      postcode: true,
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .put('/api/shelter/1/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('postcode field must be a string');
  });

  test('PUT: 400 status when given body request with invalid address field', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: 10,
      city: 'Goiania',
      country: 'Brazil',
    };
    const response = await request
      .put('/api/shelter/1/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('address field must be a string');
  });

  test('PUT: 400 status when given body request with invalid city field', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      city: false,
      country: 'Brazil',
    };
    const response = await request
      .put('/api/shelter/1/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('city field must be a string');
  });

  test('PUT: 400 status when given body request with invalid country field', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '10 de dezembro',
      city: 'Goiania',
      country: 20145,
    };
    const response = await request
      .put('/api/shelter/1/address')
      .send(addressMock);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('country field must be a string');
  });

  test('PUT: 200 status when given body request with extras fields', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      test: 'test',
      boolean: true,
    };
    const { body } = await request
      .put('/api/shelter/1/address')
      .send(addressMock)
      .expect(200);
    expect(body.address).toEqual({
      id: 10,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
      city: 'Goiania',
      country: 'Ukraine',
      user_id: null,
      shelter_id: 1,
    });
    expect(body.address).not.toHaveProperty('test');
    expect(body.address).not.toHaveProperty('boolean');
  });

  test('PUT: 400 status when try to update shelter address does not have address yet on database', async () => {
    const addressMock = {
      number: '25',
      postcode: '74583725',
      address: '25 de dezembro',
    };
    const { body } = await request
      .put('/api/shelter/10/address')
      .send(addressMock)
      .expect(400);
    expect(body.message).toBe('shelter does not have an address');
  });
});

describe('DELETE on /api/user/:user_id/address', () => {
  test('DELETE: 204 status no content', async () => {
    await request.delete('/api/user/1/address').expect(204);
  });

  test('DELETE: 400 status when given invalid id', async () => {
    const response = await request.delete('/api/user/invalid/address');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('userId query must be a number');
  });

  test('DELETE: 404 status when given user id that does not exist on database', async () => {
    const response = await request.delete('/api/user/100/address');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('user not found');
  });

  test('DELETE: 400 status when given user id that does not have address on database', async () => {
    const response = await request.delete('/api/user/10/address');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('user does not have an address');
  });
});

describe('DELETE on /api/shelter/:shelter_id/address', () => {
  test('DELETE: 204 status no content', async () => {
    await request.delete('/api/shelter/1/address').expect(204);
  });

  test('DELETE: 400 status when given invalid id', async () => {
    const response = await request.delete('/api/shelter/invalid/address');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('shelterId query must be a number');
  });

  test('DELETE: 404 status when given shelter id that does not exist on database', async () => {
    const response = await request.delete('/api/shelter/100/address');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('shelter not found');
  });

  test('DELETE: 400 status when given shelter id that does not have address on database', async () => {
    const response = await request.delete('/api/shelter/10/address');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('shelter does not have an address');
  });
});
