import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
  HttpResponseBase
} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Feature } from '../model/feature';
import { ServiceError } from '../model/service-error';

@Injectable()
export class FeatureService {

  private readonly endpointUrl: string = '/api/feature';
  private featuresSubject: BehaviorSubject<Feature[]> = new BehaviorSubject([]);
  private errorSubject: BehaviorSubject<ServiceError> = new BehaviorSubject(null);

  constructor(private httpClient: HttpClient) {
    this.loadInitialData();
  }

  public get features(): Observable<Feature[]> {
    return this.featuresSubject.asObservable();
  }

  public get errors(): Observable<ServiceError> {
    return this.errorSubject.asObservable();
  }

  public createOrUpdateFeature(feature: Feature): void {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.httpClient.post(`${this.endpointUrl}`, feature, { headers: header, observe: 'response' })
      .subscribe((response: HttpResponse<Feature>) => {
          if (response.status == 201) {  // Created
            let savedFeature = response.body;
            this.featuresSubject.next(this.featuresSubject.getValue().concat(savedFeature));
          } else {
            this.publishError(response);
          }
        },
        (error: HttpErrorResponse) => this.publishError(error)
      );
  }

  private loadInitialData(): void {
    this.httpClient.get<Feature[]>(`${this.endpointUrl}`, { observe: 'response' })
      .subscribe((response: HttpResponse<Feature[]>) => {
          if (response.status == 200) this.featuresSubject.next(response.body);
          else this.publishError(response);
        },
        (error: HttpErrorResponse) => this.publishError(error)
      );
  }

  private publishError(response: HttpResponseBase) {
    this.errorSubject.next(ServiceError.fromStatusCode(response.status));
  }

}
