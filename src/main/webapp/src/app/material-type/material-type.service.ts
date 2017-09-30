import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ServiceError } from '../model/service-error';
import { MaterialType } from '../model/material-type';

@Injectable()
export class MaterialTypeService {

  private readonly endpointUrl: string = '/api/material';
  private materialsSubject: BehaviorSubject<MaterialType[]> = new BehaviorSubject([]);
  private errorSubject: BehaviorSubject<ServiceError> = new BehaviorSubject(null);

  constructor(private httpClient: HttpClient) {
    this.loadInitialData();
  }

  get materials(): Observable<MaterialType[]> {
    return this.materialsSubject.asObservable();
  }

  get errors(): Observable<ServiceError> {
    return this.errorSubject.asObservable();
  }

  private loadInitialData(): void {
    this.httpClient.get<MaterialType[]>(`${this.endpointUrl}`, { observe: 'response' })
      .subscribe((response: HttpResponse<MaterialType[]>) => {
          if (response.status == 200) this.materialsSubject.next(response.body);
          else this.publishError(response);
        },
        (error: HttpErrorResponse) => this.publishError(error)
      );
  }

  private publishError(response: HttpResponseBase) {
    this.errorSubject.next(ServiceError.fromStatusCode(response.status));
  }

}
