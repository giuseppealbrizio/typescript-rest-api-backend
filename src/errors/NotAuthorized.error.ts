import {CustomError} from './CustomError.error';

export class NotAuthorizedError extends CustomError {
  constructor(message: string) {
    super(401, message);
  }
}
