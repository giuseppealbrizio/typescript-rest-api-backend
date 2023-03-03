import dotenv from 'dotenv';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import xss from 'xss-clean';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import {initializeApp, applicationDefault} from 'firebase-admin/app';
import mongoose from 'mongoose';
import Logger from './lib/logger';
import morganMiddleware from './middlewares/morgan.middleware';
import {currentUserMiddleware} from './middlewares/currentUser.middleware';
import errorHandleMiddleware from './middlewares/errorHandler.middleware';
import {NotFoundError} from './errors/NotFound.error';
import apiV1Router from './api/v1/index.route';
import mongoDbConfiguration from './config/mongodb.config';
// import path from 'path';

dotenv.config();

const {mongoDBTestConnection, mongoDbProdConnection} = mongoDbConfiguration;

/**
 * Connect to MongoDB
 */
if (process.env.NODE_ENV === 'development') {
  mongoDBTestConnection().catch(error => {
    Logger.error(error.message);
  });
} else {
  mongoDbProdConnection().catch(error => {
    Logger.error(error.message);
  });
}

/**
 * Import agenda jobs
 */
import './jobs/agenda';

/**
 * Initialize Firebase Admin SDK
 */
initializeApp({
  credential: applicationDefault(),
});

/**
 * Initialize express app
 */
const app = express();

// trust proxy
app.set('trust proxy', true);

// logger middleware
app.use(morganMiddleware);

// set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false, // set this false to prevent bug in new browser
  })
);

// parse body request
app.use(express.json());

// parse urlencoded request
app.use(express.urlencoded({extended: true}));

// sanitize
app.use(xss());
app.use(mongoSanitize());

// use GZIP compression
app.use(compression());

// parse cookie
app.use(cookieParser());

// Cookie policy definition
const COOKIE_MAX_AGE: string | number =
  process.env.COOKIE_MAX_AGE || 1000 * 60 * 60 * 24;
const SECRET = process.env.JWT_KEY || 'your_jwt_secret';

/**
 * FIX:
 * We reusing the mongoose connection to avoid the error:
 * workaround for Jest that crashes when using mongoUrl option
 */
const mongoStore = MongoStore.create({
  client: mongoose.connection.getClient(),
  stringify: false,
  autoRemove: 'interval',
  autoRemoveInterval: 1,
});

app.use(
  session({
    cookie: {
      // secure: DEFAULT_ENV === 'production',
      maxAge: <number>COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
    },
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    /* Store session in mongodb */
    store: mongoStore,
    unset: 'destroy',
  })
);

/**
 * currentUser middleware. It will set the current user in the request
 */
app.use(currentUserMiddleware);

/**
 * Initialize Passport and pass the session to session storage of express
 * Strategies are called in the auth router
 * and in ./src/config/passport.config.ts
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * CORS configuration
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*', // allow CORS
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // allow session cookie from browser to pass through
  })
);

/**
 * Headers configuration
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL); // Update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

/**
 * This MIDDLEWARE is to serve the public client build and redirect everything
 * to the client index.html. Replace the original one with public. Move build
 * inside the server folder and activate also the catchall middleware.
 */
// app.use(
//   express.static(path.join(__dirname, '../public'), {
//     index: 'index.html',
//   })
// );

/**
 * Routes definitions
 */
app.use(`/api/v1/${process.env.SERVICE_NAME}`, apiV1Router);

/**
 * Catchall middleware. Activate to serve every route in
 * the public directory i.e. if we have a build of React
 */
// app.use((req, res) =>
//   res.sendFile(path.resolve(path.join(__dirname, '../public/index.html')))
// );

/**
 * Catchall middleware. Activate to serve every route in throw an error if the route is not found
 */
app.all('*', () => {
  throw new NotFoundError('Route not found');
});

/**
 * Global Error handler middleware
 */
app.use(errorHandleMiddleware);

export default app;
