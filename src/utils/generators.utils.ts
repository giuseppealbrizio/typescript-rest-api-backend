import crypto from 'crypto';
import {ICustomExpressRequest} from '../middlewares/currentUser.middleware';
import {Response} from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload<T> {
  [key: string]: T;
}
/**
 * Generate a json web token
 * @param payload
 * @returns
 */
const generateJsonWebToken = <T>(payload: JwtPayload<T>): string => {
  const jwtKey = process.env.JWT_KEY;

  if (!jwtKey) {
    throw new Error('Missing JWT');
  }

  return jwt.sign({payload}, jwtKey, {
    expiresIn: '10d',
    // algorithm: 'RS256',
  });
};

/**
 * Generate a cookie with a token
 * @param cookieName
 * @param token
 * @param req
 * @param res
 */
const generateCookie = (
  cookieName: string,
  token: string,
  req: ICustomExpressRequest,
  res: Response
) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  res.cookie(cookieName, token, cookieOptions);
};

/**
 * Generate a random OTP
 * @returns
 */
const generateOTP = (): string => {
  const chars = '0123456789';
  let otp = '';

  while (otp.length < 6) {
    const randomBytes = crypto.randomBytes(4);
    const randomIndex = randomBytes.readUInt32BE(0) % chars.length;
    otp += chars.charAt(randomIndex);
  }

  return otp;
};

export {generateOTP, generateCookie, generateJsonWebToken};
