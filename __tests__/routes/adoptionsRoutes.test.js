import supertest from 'supertest';
import { describe, test } from '@jest/globals';
import app from '../../api/index.js';

const request = supertest(app);

describe('GET on /adoption', () => {
  test('should responds 200 status', async () => {
    await request.get('/adoption').expect(200);
  });
});
