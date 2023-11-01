import supertest from 'supertest';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from '@jest/globals';
import app from '../../api/index.js';
import seed from '../../db/seeds/seed.js';
import db from '../../db/connection.js';

const request = supertest(app);
let accessToken = '';

beforeAll(async () => {
  const userLogin = {
    email: 'lmarzella0@spotify.com',
    password: '12345678',
  };
  const { body } = await request.post('/api/login').send(userLogin);
  accessToken = body.accessToken;
});

beforeEach(async () => {
  await seed();
});

afterAll(async () => {
  await db.end();
  accessToken = '';
});

describe('GET on /api/users', () => {
  test('GET: 200 status', async () => {
    await request
      .get('/api/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  test('GET: 200 status with users data from database', async () => {
    const { body } = await request
      .get('/api/users')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(body.users.length).toBe(10);
    body.users.forEach((user) => {
      expect(user).toEqual({
        id: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        about: expect.any(String),
        url_photo: expect.any(String),
        phone: expect.any(String),
        password: expect.any(String),
        role: expect.any(String),
        active: expect.any(Boolean),
      });
    });
  });
});

describe('GET on /api/user/:id', () => {
  test('GET: 200 status', async () => {
    await request
      .get('/api/user/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  test('GET: 200 status with users data from database', async () => {
    const { body } = await request
      .get('/api/user/1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(body.user).toEqual({
      id: 1,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      name: expect.any(String),
      email: expect.any(String),
      about: expect.any(String),
      url_photo: expect.any(String),
      phone: expect.any(String),
      password: expect.any(String),
      role: expect.any(String),
      active: expect.any(Boolean),
    });
  });

  test('GET: 404 status when given user id that not exist on database', async () => {
    const response = await request
      .get('/api/user/100')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('user not found');
  });

  test('GET: 400 status when given invalid user id', async () => {
    const response = await request
      .get('/api/user/invalid')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('userId query must be a number');
  });
});

describe('GET on /api/user/:id/address', () => {
  test('GET: 200 status', async () => {
    await request
      .get('/api/user/1/address')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  test('GET: 200 status responds with the user data by id given on request', async () => {
    const { body } = await request
      .get('/api/user/1/address')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(body.user).toEqual({
      id: 1,
      createdAt: '2023-10-12T14:47:10.741Z',
      updatedAt: '2023-10-12T14:47:10.741Z',
      name: 'Lynnett Marzella',
      email: 'lmarzella0@spotify.com',
      about:
        'in magna bibendum imperdiet nullam orci pede venenatis non sodales sed tincidunt eu',
      url_photo: 'https://robohash.org/magniutanimi.png?size=50x50&set=set1',
      phone: '767-758-1411',
      password: expect.any(String),
      role: 'TUTOR',
      active: true,
      address: {
        id: 1,
        createdAt: '2023-10-12T14:47:10.752Z',
        updatedAt: '2023-10-12T14:47:10.752Z',
        number: '29',
        postcode: 'BN20 8JS',
        address: '18th Floor',
        city: 'Rogóźno',
        country: 'Poland',
        user_id: 1,
        shelter_id: null,
      },
    });
  });

  test('GET: 400 status when given invalid id on request', async () => {
    const result = await request
      .get('/api/user/invalid/address')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('userId query must be a number');
  });

  test('GET: 404 status when given user id on request that not exist on database', async () => {
    const result = await request
      .get('/api/user/100/address')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.status).toBe(404);
    expect(result.body.message).toBe('user not found');
  });

  test('GET: 200 status when given user id on request that does not have address on database', async () => {
    const { body } = await request
      .get('/api/user/10/address')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(body.user).toEqual({
      id: 10,
      createdAt: '2023-10-12T14:47:10.741Z',
      updatedAt: '2023-10-12T14:47:10.741Z',
      name: 'Ali Gaunson',
      email: 'agaunson9@bluehost.com',
      about:
        'volutpat in congue etiam justo etiam pretium iaculis justo in hac habitasse platea dictumst etiam faucibus cursus urna',
      url_photo:
        'https://robohash.org/repellendusminimaea.png?size=50x50&set=set1',
      phone: '918-251-9844',
      password: expect.any(String),
      role: 'TUTOR',
      active: true,
      address: null,
    });
  });
});

describe('POST on /api/user', () => {
  test('POST: 400 status when not given name on body request', async () => {
    const result = await request
      .post('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'ftopley9@test.org.au',
        password: 'jhM8bsada',
        phone: '109-878-6124',
        about: 'maecenas tristique est et tempus semper est',
        role: 'TUTOR',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('name field is required');
  });

  test('POST: 400 status when given invalid name on body request', async () => {
    const result = await request
      .post('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'test',
        email: 'ftopley9@test.org.au',
        password: 'jhM8bsada',
        phone: '109-878-6124',
        about: 'maecenas tristique est et tempus semper est',
        role: 'TUTOR',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('name must be 6 or more characters long');
  });

  test('POST: 400 status when not given email on body request', async () => {
    const result = await request
      .post('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Fabiano Topley',
        password: 'jhM8bsada',
        phone: '109-878-6124',
        about: 'maecenas tristique est et tempus semper est',
        role: 'TUTOR',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('email field is required');
  });

  test('POST: 400 status when given invalid email on body request', async () => {
    const result = await request
      .post('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Fabiano Topley',
        email: 'ftopley9auda.org.au',
        password: 'jhM8bsada',
        phone: '109-878-6124',
        about: 'maecenas tristique est et tempus semper est',
        role: 'TUTOR',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('invalid email address');
  });

  test('POST: 400 status when not given phone on body request', async () => {
    const result = await request
      .post('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Fabiano Topley',
        password: 'jhM8bsada',
        email: 'ftopley9@test.org.au',
        about: 'maecenas tristique est et tempus semper est',
        role: 'TUTOR',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('phone field is required');
  });

  test('POST: 400 status when given invalid phone on body request', async () => {
    const result = await request
      .post('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Fabiano Topley',
        email: 'ftopley9@test.org.au',
        password: 'jhM8bsada',
        phone: '109-878',
        about: 'maecenas tristique est et tempus semper est',
        role: 'TUTOR',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('phone must be 8 or more numbers long');
  });

  test('POST: 400 status when not given about on body request', async () => {
    const result = await request
      .post('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Fabiano Topley',
        password: 'jhM8bsada',
        email: 'ftopley9@test.org.au',
        phone: '109-878-6124',
        role: 'TUTOR',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('about field is required');
  });

  test('POST: 400 status when given invalid about on body request', async () => {
    const result = await request
      .post('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Fabiano Topley',
        email: 'ftopley9@test.org.au',
        password: 'jhM8bsada',
        phone: '109-878-4234',
        about: 'test',
        role: 'TUTOR',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe(
      'about must be 10 or more characters long',
    );
  });

  test('POST: 400 status when not given password on body request', async () => {
    const result = await request
      .post('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Fabiano Topley',
        email: 'ftopley9@test.org.au',
        phone: '109-878-6124',
        about: 'maecenas tristique est et tempus semper est',
        role: 'TUTOR',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('password field is required');
  });

  test('POST: 400 status when given invalid password on body request', async () => {
    const result = await request
      .post('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Fabiano Topley',
        email: 'ftopley9@test.org.au',
        password: 'jhM8',
        phone: '109-878-6124',
        about: 'maecenas tristique est et tempus semper est',
        role: 'TUTOR',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe(
      'password must be 8 or more characters long',
    );
  });

  test('POST: 400 status when not given role on body request', async () => {
    const result = await request
      .post('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Fabiano Topley',
        email: 'ftopley9@test.org.au',
        phone: '109-878-6124',
        about: 'maecenas tristique est et tempus semper est',
        role: 'TUTOR',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('password field is required');
  });

  test('POST: 400 status when given invalid role on body request', async () => {
    const result = await request
      .post('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Fabiano Topley',
        email: 'ftopley9@test.org.au',
        password: 'jhM8',
        phone: '109-878-6124',
        about: 'maecenas tristique est et tempus semper est',
        role: 'TEST',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe(
      'password must be 8 or more characters long',
    );
  });

  test('POST: 201 status with user data inserted', async () => {
    const { body } = await request
      .post('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Fabiano Topley',
        email: 'ftopley9@test.org.au',
        password: 'jhM823424',
        phone: '109-878-6124',
        about: 'maecenas tristique est et tempus semper est',
        role: 'TUTOR',
      })
      .expect(201);

    expect(body.user).toEqual({
      name: 'Fabiano Topley',
      email: 'ftopley9@test.org.au',
      password: expect.any(String),
      phone: '109-878-6124',
      about: 'maecenas tristique est et tempus semper est',
      role: 'TUTOR',
      id: expect.any(Number),
      active: expect.any(Boolean),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      url_photo: null,
    });
  });

  test('POST: 201 status with user data inserted ignored extras fields on body request', async () => {
    const { body } = await request
      .post('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Fabiano Topley',
        email: 'ftopley9@test.org.au',
        password: 'jhM823424',
        phone: '109-878-6124',
        about: 'maecenas tristique est et tempus semper est',
        test: 'test',
        role: 'TUTOR',
      })
      .expect(201);

    expect(body.user).toEqual({
      name: 'Fabiano Topley',
      email: 'ftopley9@test.org.au',
      password: expect.any(String),
      phone: '109-878-6124',
      about: 'maecenas tristique est et tempus semper est',
      role: 'TUTOR',
      id: expect.any(Number),
      active: expect.any(Boolean),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      url_photo: null,
    });

    expect(body.user).not.toHaveProperty('test');
  });
});

describe('PUT on /api/user/:id', () => {
  test('PUT: 400 status when given invalid id', async () => {
    const result = await request
      .put('/api/user/invalid')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'ftopley9@test.org.au',
        password: 'jhM8bsad4a',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('userId query must be a number');
  });

  test('PUT: 400 status when given id does not exist on database', async () => {
    const result = await request
      .put('/api/user/100')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'ftopley9@test.org.au',
        password: 'jhM8bsada',
        phone: '109-878-6124',
        about: 'maecenas tristique est et tempus semper est',
      });
    expect(result.status).toBe(404);
    expect(result.body.message).toBe('user not found');
  });

  test('PUT: 400 status when given invalid name on body request', async () => {
    const result = await request
      .put('/api/user/2')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'test',
        password: '135dad434f43',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('name must be 6 or more characters long');
  });

  test('PUT: 400 status when given invalid role on body request', async () => {
    const result = await request
      .put('/api/user/2')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        role: 'test',
        password: '135dad434f43',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe(
      "Invalid enum value. Expected 'TUTOR' | 'ADMIN', received 'test'",
    );
  });

  test('PUT: 400 status when given invalid email on body request', async () => {
    const result = await request
      .put('/api/user/2')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Fabiano Topley',
        email: 'ftopley9auda.org.au',
        password: 'jhM8bsada',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('invalid email address');
  });

  test('PUT: 400 status when given invalid phone on body request', async () => {
    const result = await request
      .put('/api/user/2')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: 'jhM8bsada',
        phone: '109-878',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('phone must be 8 or more numbers long');
  });

  test('PUT: 400 status when given invalid about on body request', async () => {
    const result = await request
      .put('/api/user/2')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: 'jhM8bsada',
        about: 'test',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe(
      'about must be 10 or more characters long',
    );
  });

  test('PUT: 400 status when given invalid password on body request', async () => {
    const result = await request
      .put('/api/user/2')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: 'jhM8',
      });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe(
      'password must be 8 or more characters long',
    );
  });

  test('PUT: 201 status with user data updated', async () => {
    const { body } = await request
      .put('/api/user/2')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Gilberto Antonio',
        email: 'gilberto@auda.org.au',
        password: '123456789',
        phone: '0000-111-222',
        about: 'test test test test',
      })
      .expect(200);

    expect(body.user).toEqual({
      name: 'Gilberto Antonio',
      email: 'gilberto@auda.org.au',
      password: expect.any(String),
      phone: '0000-111-222',
      about: 'test test test test',
      id: expect.any(Number),
      active: expect.any(Boolean),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      role: 'TUTOR',
      url_photo: expect.any(String),
    });
  });

  test('PUT: 201 status with user data updated ignored extras fields on body request', async () => {
    const { body } = await request
      .put('/api/user/2')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Gilberto Antonio',
        email: 'gilberto@auda.org.au',
        password: '123456789',
        phone: '0000-111-222',
        about: 'test test test test',
        test: 'test',
      })
      .expect(200);

    expect(body.user).toEqual({
      name: 'Gilberto Antonio',
      email: 'gilberto@auda.org.au',
      password: expect.any(String),
      phone: '0000-111-222',
      about: 'test test test test',
      id: expect.any(Number),
      active: expect.any(Boolean),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      role: 'TUTOR',
      url_photo: expect.any(String),
    });

    expect(body.user).not.toHaveProperty('test');
  });
});

describe('DELETE on /api/user/:id', () => {
  test('DELETE: 400 status when try delete user that have pets adoptions on database', async () => {
    const response = await request
      .delete('/api/user/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'it was not possible to delete the user because it has registered pets adoption',
    );
  });

  test('DELETE: 204 status no content', async () => {
    const response = await request
      .delete('/api/user/10')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(204);
  });

  test('DELETE: 404 status when given id does not exist on database', async () => {
    const response = await request
      .delete('/api/user/100')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('user not found');
  });

  test('DELETE: 400 status when given invalid id', async () => {
    const response = await request
      .delete('/api/user/invalid')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('userId query must be a number');
  });
});
