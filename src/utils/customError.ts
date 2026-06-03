export class CustomError extends Error {
  statusCode: number;
  extraData?: object;
  constructor(statusCode: number, message: string, extraData?: object) {
    super(message);
    this.extraData = extraData;
    this.statusCode = statusCode;
  }
}
