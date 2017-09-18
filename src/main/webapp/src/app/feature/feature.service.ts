import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Feature } from '../model/feature';
import { ServiceError } from '../model/service-error';
import { ErrorType } from '../model/error-type.enum';

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

  public addFeature(name: string): void {
    let header = new HttpHeaders({ ['Content-Type']: 'application/json' });
    let payload = { name: name };

    this.httpClient.post(`${this.endpointUrl}`, payload, { headers: header, observe: 'response' })
      .subscribe((response: HttpResponse<Feature>) => {
        let savedFeature = response.body;
        this.featuresSubject.next(this.featuresSubject.getValue().concat(savedFeature));
      });
  }

  private loadInitialData(): void {
    this.httpClient.get<Feature[]>(`${this.endpointUrl}`, { observe: 'response' })
      .subscribe((response: HttpResponse<Feature[]>) => {
          switch (response.status) {
            case 200:  // Ok
              this.featuresSubject.next(response.body);
              break;
            case 204:  // No content
              this.errorSubject.next(new ServiceError(ErrorType.EMPTY, 'No features can be found'));
              break;
            default:
              console.log('Cannot match any error type for the response: ', response);
          }
        },
        (error: HttpErrorResponse) => {
          switch (error.status) {
            case 504:  // Gateway Timeout
              this.errorSubject.next(new ServiceError(ErrorType.GATEWAY_TIMEOUT, 'The server is probably is down or cannot be reached'));
              break;
            default:
              console.log('Cannot match any error type for the error: ', error);
          }
        }
      );
  }

}
