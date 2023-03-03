import mongoose from 'mongoose';
import Logger from '../lib/logger';
import {CustomError} from '../errors/CustomError.error';

mongoose.set('strictQuery', true);

mongoose.connection.on('connected', () => {
  Logger.info('MongoDB connection established');
});

mongoose.connection.on('reconnected', () => {
  Logger.warn('MongoDB reconnected');
});

mongoose.connection.on('disconnected', () => {
  Logger.warn('MongoDB disconnected');
});

mongoose.connection.on('close', () => {
  Logger.warn('MongoDB connection closed');
});

mongoose.connection.on('error', (error: string) => {
  Logger.error(`🤦🏻 MongoDB ERROR: ${error}`);

  process.exit(1);
});

export default {
  mongoDbProdConnection: async () => {
    try {
      await mongoose.connect(<string>process.env.MONGO_URI);
      Logger.info(`Connected to db: ${mongoose.connection.name}`);
    } catch (error) {
      Logger.error(`Production - MongoDB connection error. ${error}`);
      if (error instanceof CustomError) {
        throw new CustomError(error.statusCode, error.message);
      }
    }
  },
  mongoDBTestConnection: async () => {
    try {
      await mongoose.connect(<string>process.env.MONGO_URI_TEST);
      Logger.info(`Connected to db: ${mongoose.connection.name}`);
    } catch (error) {
      Logger.error('Test - MongoDB connection error' + error);
      if (error instanceof CustomError) {
        throw new CustomError(500, error.message);
      }
    }
  },
};
