import mongoose from 'mongoose';
// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';
import app from '../index';

/**
 * Test to see if the server is running
 */
describe(`GET /api/v1/${process.env.SERVICE_NAME}`, () => {
  test('should return 200 OK', async () => {
    const res = await request(app).get(`/api/v1/${process.env.SERVICE_NAME}`);
    expect(res.statusCode).toEqual(200);
  });
  afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close();
    done();
  });
});
