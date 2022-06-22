import HttpStatus from "http-status-codes";
import BaseError from "./base-error";

export default class HttpError extends BaseError {
  constructor(
    message: string,
    code: number = HttpStatus.INTERNAL_SERVER_ERROR,
    name = "HttpError"
  ) {
    super(message, code, name);
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
