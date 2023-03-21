// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';
import jwt from 'jsonwebtoken';
import express from 'express';
import {ICustomExpressRequest} from '../../middlewares/currentUser.middleware';
import {
  generateOTP,
  generateCookie,
  generateJsonWebToken,
  JwtPayload,
} from '../../../src/utils/generators.utils';

// Mock process.env.JWT_KEY with a string value
process.env.JWT_KEY = 'mock_jwt_key';

describe('Generators Utilities Tests Suite', () => {
  describe('generateOTP', () => {
    it('should generate a 6 digit OTP', () => {
      const otp = generateOTP();
      expect(otp).toHaveLength(6);
    });
  });

  describe('generateJsonWebToken', () => {
    it('should generate a JWT token', () => {
      const payload = {id: 1, username: 'user1'};
      const token = generateJsonWebToken(payload);
      const decoded = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload<
        typeof payload
      >;
      expect(decoded.payload).toEqual(payload);
    });
  });

  describe('generateCookie', () => {
    it('should set a cookie with the given name and token', async () => {
      const app = express();
      const cookieName = 'my-cookie';
      const token = 'my-token';

      app.get('/set-cookie', (req, res) => {
        generateCookie(cookieName, token, req as ICustomExpressRequest, res);
        res.status(200).send('Cookie set');
      });

      const response = await request(app).get('/set-cookie');

      expect(response.status).toBe(200);
      expect(response.header['set-cookie']).toBeDefined();
      expect(response.header['set-cookie'][0]).toContain(cookieName);
      expect(response.header['set-cookie'][0]).toContain(token);
    });
  });
});
