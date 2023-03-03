import {NextFunction, Response} from 'express';
import {ICustomExpressRequest} from './currentUser.middleware';

/**
 * A function that takes a request, response, and next function as parameters.
 */
export default (catchAsyncHandler: Function) =>
  async (
    request: ICustomExpressRequest,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      catchAsyncHandler(request, response, next);
    } catch (error) {
      return next(error);
    }
  };
