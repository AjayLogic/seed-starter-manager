import { Injectable } from '@angular/core';
import { toast } from 'angular2-materialize';

@Injectable()
export class ToastService {

  showMessage(message: string) {
    toast(message, 3000, 'toast-message');
  }

  showErrorMessage(message: string) {
    toast(message, 3000, 'toast-error');
  }

}
