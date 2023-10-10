import app from '../api/index.js';
import supertest from 'supertest';

const requestWithSupertest = supertest(app);

describe('check API health', () => {
  test('API should responds with 200 status', async () => {
    const res = await requestWithSupertest.get('/api');
    expect(res.status).toEqual(200);
    expect(res.body.msg).toEqual('Welcome to Adopet API');
  });
});
