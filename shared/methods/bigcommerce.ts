export interface MethodOptions {
  access_token: string;
}
export class ForbiddenError extends Error {
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class SessionExpiredError extends Error {
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, SessionExpiredError.prototype);
  }
}

export class UserError extends Error {
  public responseJson: any;
  constructor(public message: string, public body: any) {
    super(message);
    this.responseJson = body;
    Object.setPrototypeOf(this, UserError.prototype);
  }
  getResponseJson() {
    return this.responseJson;
  }
}
