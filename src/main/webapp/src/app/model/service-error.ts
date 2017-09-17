import { ErrorType } from './error-type.enum';

export class ServiceError {

  constructor(readonly type: ErrorType,
              readonly message?: string) { }

}
