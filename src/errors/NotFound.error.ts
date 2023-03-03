import {CustomError} from './CustomError.error';

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(404, message);
  }
}
