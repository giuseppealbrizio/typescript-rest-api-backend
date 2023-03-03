export class CustomError extends Error {
  public statusCode: number;
  public message: string;

  constructor(statusCode: number, message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
  }
}
