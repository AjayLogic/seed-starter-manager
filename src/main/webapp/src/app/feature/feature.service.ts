import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Feature } from '../model/feature';
import { ServiceError } from '../model/service-error';

@Injectable()
export class FeatureService {

  private readonly endpointUrl: string = '/api/feature';
  private httpHeader: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  private featuresSubject: BehaviorSubject<Feature[]> = new BehaviorSubject([]);
  private errorSubject: BehaviorSubject<ServiceError> = new BehaviorSubject(null);

  constructor(private httpClient: HttpClient) {
    this.loadInitialData();
  }

  get features(): Observable<Feature[]> {
    return this.featuresSubject.asObservable();
  }

  get errors(): Observable<ServiceError> {
    return this.errorSubject.asObservable();
  }

  createOrUpdateFeature(feature: Feature): void {
    this.httpClient.post(`${this.endpointUrl}`, feature, { headers: this.httpHeader, observe: 'response' })
      .subscribe((response: HttpResponse<Feature>) => {
          switch (response.status) {
            case 200:  // Ok (Feature has been updated successfully)
              this.onFeatureUpdated(feature);
              break;
            case 201:  // Created (Feature has been created successfully)
              this.onFeatureCreated(response.body);
              break;
            default:
              this.publishError(response);
          }
        },
        (error: HttpErrorResponse) => this.publishError(error)
      );
  }

  deleteFeature(feature: Feature): void {
    this.httpClient.delete(`${this.endpointUrl}/${feature.id}`, { headers: this.httpHeader, observe: 'response' })
      .subscribe((response: HttpResponse<null>) => {
          switch (response.status) {
            case 200:
              this.onFeatureDeleted(feature);
              break;
            default:
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

  private onFeatureUpdated(updatedFeature: Feature) {
    this.featuresSubject.getValue().find((existentFeature: Feature) => {
      // Updates the name of the corresponding Feature in the current list, and publish it
      if (existentFeature.id == updatedFeature.id) {
        existentFeature.name = updatedFeature.name;
        this.featuresSubject.next(this.featuresSubject.getValue());
        return true;
      }
    });
  }

  private onFeatureCreated(newFeature: Feature) {
    let features: Feature[] = this.featuresSubject.getValue();
    this.featuresSubject.next(features.concat(newFeature));
  }

  private onFeatureDeleted(feature: Feature): void {
    // Removes the deleted Feature from the array
    let features: Feature[] = this.featuresSubject.getValue()
      .filter((feat: Feature) => feat.id != feature.id);

    this.featuresSubject.next(features);
  }

  private publishError(response: HttpResponseBase) {
    this.errorSubject.next(ServiceError.fromStatusCode(response.status));
  }

}
