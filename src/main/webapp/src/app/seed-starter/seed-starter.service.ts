import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { SeedStarter } from '../model/seed-starter';
import { ServiceError } from '../model/service-error';

@Injectable()
export class SeedStarterService {

  private readonly endpointUrl: string = '/api/seed-starter';
  private seedStarterSubject: BehaviorSubject<SeedStarter[]> = new BehaviorSubject([]);
  private errorSubject: BehaviorSubject<ServiceError> = new BehaviorSubject(null);

  constructor(private httpClient: HttpClient) {
    this.loadInitialData();
  }

  get seedStarters(): Observable<SeedStarter[]> {
    return this.seedStarterSubject.asObservable();
  }

  get errors(): Observable<ServiceError> {
    return this.errorSubject.asObservable();
  }

  private loadInitialData(): void {
    this.httpClient.get<SeedStarter[]>(`${this.endpointUrl}`, { observe: 'response' })
      .subscribe((response: HttpResponse<SeedStarter[]>) => {
          if (response.status == 200) this.seedStarterSubject.next(response.body);
          else this.publishError(response);
        },
        (error: HttpErrorResponse) => this.publishError(error)
      );
  }

  private publishError(response: HttpResponseBase) {
    this.errorSubject.next(ServiceError.fromStatusCode(response.status));
  }

}
