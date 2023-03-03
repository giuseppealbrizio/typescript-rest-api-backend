import {NextFunction, Response} from 'express';

import {apiRolesRights} from '../api/config/roles.config';
import {NotAuthorizedError} from '../errors';
import {ICustomExpressRequest} from './currentUser.middleware';

export const verifyApiRights =
  (...requiredRights: Array<string>) =>
  (req: ICustomExpressRequest, res: Response, next: NextFunction) => {
    if (requiredRights?.length) {
      const userRights = <Array<string>>(
        apiRolesRights.get(<string>req.currentUser?.role)
      );

      const hasRequiredRights = requiredRights.every((requiredRight: string) =>
        userRights?.includes(requiredRight)
      );

      if (
        !hasRequiredRights &&
        req.params.userId !== <string>req.currentUser?.id
      ) {
        throw new NotAuthorizedError(
          'You are not authorized to use this endpoint'
        );
      }
    }
    next();
  };
