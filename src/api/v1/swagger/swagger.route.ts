import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const swaggerRouter = express.Router();

const options = {
  explorer: true,
};

swaggerRouter.use('/', swaggerUi.serve);
swaggerRouter.get('/', swaggerUi.setup(swaggerDocument, options));

export default swaggerRouter;
