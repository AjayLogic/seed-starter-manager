import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ServiceError } from '../model/service-error';
import { SeedVariety } from '../model/seed-variety';

@Injectable()
export class SeedVarietyService {

  private readonly endpointUrl: string = '/api/variety';
  private varietySubject: BehaviorSubject<SeedVariety[]> = new BehaviorSubject([]);
  private errorSubject: BehaviorSubject<ServiceError> = new BehaviorSubject(null);

  constructor(private httpClient: HttpClient) {
    this.loadInitialData();
  }

  get varieties(): Observable<SeedVariety[]> {
    return this.varietySubject.asObservable();
  }

  get errors(): Observable<ServiceError> {
    return this.errorSubject.asObservable();
  }

  private loadInitialData(): void {
    this.httpClient.get<SeedVariety[]>(`${this.endpointUrl}`, { observe: 'response' })
      .subscribe((response: HttpResponse<SeedVariety[]>) => {
          if (response.status == 200) this.varietySubject.next(response.body);
          else this.publishError(response);
        },
        (error: HttpErrorResponse) => this.publishError(error)
      );
  }

  private publishError(response: HttpResponseBase) {
    this.errorSubject.next(ServiceError.fromStatusCode(response.status));
  }

}
