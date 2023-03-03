/**
 * This middleware is responsible for returning a json every time
 * an error comes in. We use in the index.ts as global middleware
 */
import dotenv from 'dotenv';
import {NextFunction, Request, Response} from 'express';
import {CustomError} from '../errors';
import Logger from '../lib/logger';

dotenv.config();

const errorHandleMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isProduction = process.env.NODE_ENV === 'production';
  let errorMessage = {};

  if (res.headersSent) {
    return next(err);
  }

  if (!isProduction) {
    Logger.debug(err.stack);
    errorMessage = err;
  }

  if (err) {
    return res.status(err.statusCode || 500).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
      error: {
        message: err.message,
        ...(!isProduction && {trace: errorMessage}),
      },
    });
  }
};

export default errorHandleMiddleware;
