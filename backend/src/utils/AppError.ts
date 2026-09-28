export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(400, message, details);
  }

  static notFound(message: string) {
    return new AppError(404, message);
  }

  static conflict(message: string) {
    return new AppError(409, message);
  }

  static unauthorized(message: string) {
    return new AppError(401, message);
  }
}
