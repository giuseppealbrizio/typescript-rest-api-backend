/**
 * This middleware differentiate from the authenticate one
 * because is called after the authentication to retrieve
 * the jwt token stored in the cookie. This is useful to be
 * exported in a shared library
 */
import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

export interface ICurrentUserPayload {
  id: string;
  email: string;
  active: boolean;
  role: string;
  employeeId: string;
  clientId: string;
  vendorId: string;
  deleted: boolean;
  featureFlags: {
    allowSendEmail: string;
    allowSendSms: string;
    betaFeatures: string;
    darkMode: string;
  };
}

/**
 * An interface representing the custom Express request object.
 */
export interface ICustomExpressRequest extends Request {
  currentUser?: ICurrentUserPayload;
}

// const secretOrPrivateKey = <string>process.env.JWT_KEY;

export const currentUserMiddleware = (
  req: ICustomExpressRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies?.jwt && !req.headers?.authorization) {
    return next();
  }
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      const jwtFromBearer = req.headers?.authorization?.split(' ');

      const jwtToken = jwtFromBearer[1];

      req.currentUser = jwt.verify(
        jwtToken,
        // secretOrPrivateKey,
        <string>process.env.JWT_KEY
      ) as ICurrentUserPayload;
    } else if (req.cookies.jwt) {
      req.currentUser = jwt.verify(
        req.cookies.jwt,
        // secretOrPrivateKey,
        <string>process.env.JWT_KEY
      ) as ICurrentUserPayload;
    }
  } catch (error) {
    return next(error);
  }
  return next();
};
