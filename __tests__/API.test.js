import { describe, test, expect } from '@jest/globals';
import supertest from 'supertest';
import app from '../api/index.js';

const requestWithSupertest = supertest(app);

describe('check API health', () => {
  test('API should responds with 200 status', async () => {
    const res = await requestWithSupertest.get('/api');
    expect(res.status).toBe(200);
  });
});
