import { ErrorType } from './error-type.enum';

export class ServiceError {

  constructor(readonly type: ErrorType,
              readonly message?: string) { }

  public static fromStatusCode(status: number): ServiceError | null {
    switch (status) {
      case 204:  // No Content
        return new ServiceError(ErrorType.EMPTY, 'The requested resource is empty');
      case 504:  // Gateway Timeout
        return new ServiceError(ErrorType.GATEWAY_TIMEOUT, 'The server is probably is down or cannot be reached');
      default:
        console.log('Cannot match any error type for the status code: ', status);
        return null;
    }
  }

}
