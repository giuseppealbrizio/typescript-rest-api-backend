import express, {Response} from 'express';
import _ from 'lodash';
import {ICustomExpressRequest} from '../../middlewares/currentUser.middleware';

import appRouter from './app/app.route';
import authRouter from './auth/auth.route';

import swaggerRouter from './swagger/swagger.route';
import typedocRouter from './typedoc/typedoc.route';

import {
  apiV1RateLimiter,
  devlopmentApiLimiter,
} from '../../middlewares/apiRateLimit.middleware';

const apiV1Router = express.Router();

apiV1Router.get('/', (req: ICustomExpressRequest, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Healthy check completed successfully',
  });
});

const defaultRoutes = [
  {
    path: '/app',
    route: appRouter,
  },
  {
    path: '/auth',
    route: authRouter,
  },
];

const devRoutes = [
  {
    path: '/documentation',
    route: swaggerRouter,
  },
  {
    path: '/typedoc', // this route will serve typedoc generated documentation
    route: typedocRouter,
  },
];

_.forEach(defaultRoutes, route => {
  apiV1Router.use(apiV1RateLimiter);
  apiV1Router.use(route.path, route.route);
});

if (process.env.NODE_ENV === 'development') {
  _.forEach(devRoutes, route => {
    apiV1Router.use(devlopmentApiLimiter);
    apiV1Router.use(route.path, route.route);
  });
}

export default apiV1Router;
