import {Response} from 'express';
import rateLimit from 'express-rate-limit';
import {ICustomExpressRequest} from './currentUser.middleware';

/**
 * Rate limiter for api v1
 * @see https://www.npmjs.com/package/express-rate-limit
 * @description 1000 requests per 1 minute for production
 */
const apiV1RateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200, // Limit each IP to 200 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: async (req: ICustomExpressRequest, res: Response) => {
    return res.status(429).json({
      status: 'error',
      message: 'You have exceeded the 100 requests in 1 minute limit!',
    });
  },
});

/**
 * Rate limiter for development route as typedoc and swagger
 * @description 1000 requests per 1 hour for development
 */
const devlopmentApiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 59 minute
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per 1 hour)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: async (req: ICustomExpressRequest, res: Response) => {
    return res.status(429).json({
      status: 'error',
      message: 'Too many requests, please try again in 10 minutes.',
    });
  },
});

/**
 * Rate limiter for recover password
 */
const recoverPasswordApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 5 minute
  max: 1, // Limit each IP to 1020 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: async (req: ICustomExpressRequest, res: Response) => {
    return res.status(429).json({
      status: 'error',
      message:
        'Too many requests to recover password, please try again in 1 minute.',
    });
  },
});

/**
 * Rate limiter for reset password
 */
const resetPasswordApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: async (req: ICustomExpressRequest, res: Response) => {
    return res.status(429).json({
      status: 'error',
      message:
        'Too many requests to reset password, please try again in 1 minute.',
    });
  },
});

export {
  apiV1RateLimiter,
  devlopmentApiLimiter,
  recoverPasswordApiLimiter,
  resetPasswordApiLimiter,
};
