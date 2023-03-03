import {ICustomExpressRequest} from './currentUser.middleware';
import {Response, NextFunction} from 'express';
import {NotAuthorizedError} from '../errors';

export const requireAdminRoleMiddleware = (
  req: ICustomExpressRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.currentUser?.role !== 'admin') {
    throw new NotAuthorizedError('You are not an admin!');
  }
  next();
};
