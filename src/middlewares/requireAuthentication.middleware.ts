import {Response, NextFunction} from 'express';
import {NotAuthorizedError} from '../errors';
import {ICustomExpressRequest} from './currentUser.middleware';

export const requireAuthenticationMiddleware = (
  req: ICustomExpressRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError('You are not authorized! Please login!');
  }
  next();
};
