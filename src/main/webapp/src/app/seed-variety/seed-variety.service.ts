import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ServiceError } from '../model/service-error';
import { ServiceEvent } from '../model/service-event.enum';
import { SeedVariety } from '../model/seed-variety';

@Injectable()
export class SeedVarietyService {

  private readonly endpointUrl: string = '/api/variety';
  private httpHeader: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  private varietySubject: BehaviorSubject<SeedVariety[]> = new BehaviorSubject([]);
  private eventSubject: BehaviorSubject<ServiceEvent> = new BehaviorSubject(null);
  private errorSubject: BehaviorSubject<ServiceError> = new BehaviorSubject(null);

  constructor(private httpClient: HttpClient) {
    this.loadInitialData();
  }

  createOrUpdateVariety(variety: SeedVariety): void {
    let payload: FormData = new FormData();
    payload.append('seed-variety', new Blob([JSON.stringify(variety)], { type: 'application/json' }));
    if (variety.imageName) {
      payload.append('seed-variety-image', variety.imageName);
    }

    this.httpClient.post(`${this.endpointUrl}`, payload, { observe: 'response' })
      .subscribe((response: HttpResponse<SeedVariety>) => {
          switch (response.status) {
            case 201:  // Created (SeedVariety has been created successfully)
              this.onSeedVarietyCreated(response.body);
              break;
            default:
              this.publishError(response);
          }
        },
        (error: HttpErrorResponse) => this.publishError(error)
      );
  }

  deleteSeedVariety(variety: SeedVariety): void {
    this.httpClient.delete(`${this.endpointUrl}/${variety.id}`, { headers: this.httpHeader, observe: 'response' })
      .subscribe((response: HttpResponse<null>) => {
          switch (response.status) {
            case 200:
              this.onSeedVarietyDeleted(variety);
              break;
            default:
              this.publishError(response);
          }
        },
        (error: HttpErrorResponse) => this.publishError(error)
      );
  }

  get varieties(): Observable<SeedVariety[]> {
    return this.varietySubject.asObservable();
  }

  get events(): Observable<ServiceEvent> {
    return this.eventSubject.asObservable();
  }

  get errors(): Observable<ServiceError> {
    return this.errorSubject.asObservable();
  }

  private onSeedVarietyCreated(newSeedVariety: SeedVariety): void {
    let varieties: SeedVariety[] = this.varietySubject.getValue().concat(newSeedVariety);
    this.varietySubject.next(varieties);
    this.eventSubject.next(ServiceEvent.ENTITY_CREATED);
  }

  private onSeedVarietyDeleted(deletedSeedVariety: SeedVariety): void {
    // Removes the deleted SeedVariety from the array
    let varieties: SeedVariety[] = this.varietySubject.getValue()
      .filter((variety: SeedVariety) => variety.id != deletedSeedVariety.id);

    this.varietySubject.next(varieties);
    this.eventSubject.next(ServiceEvent.ENTITY_DELETED);
  }

  private loadInitialData(): void {
    this.httpClient.get(`${this.endpointUrl}`, { observe: 'response' })
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
