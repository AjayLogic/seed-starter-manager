import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ServiceError } from '../model/service-error';
import { SeedVariety } from '../model/seed-variety';

@Injectable()
export class SeedVarietyService {

  private readonly endpointUrl: string = '/api/variety';
  private httpHeader: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
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

  createOrUpdateMaterial(variety: SeedVariety): void {
    let payload: FormData = new FormData();
    payload.append('seed-variety', new Blob([JSON.stringify(variety)], { type: 'application/json' }));
    if (variety.imageName) {
      payload.append('seed-variety-image', variety.imageName);
    }

    this.httpClient.post(`${this.endpointUrl}`, payload, { observe: 'response' })
      .subscribe((response: HttpResponse<SeedVariety>) => {
        switch (response.status) {
          case 201:
            this.onSeedVarietyCreated(response.body);
            break;
        }
      });
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

  private onSeedVarietyCreated(newSeedVariety: SeedVariety): void {
    let varieties: SeedVariety[] = this.varietySubject.getValue();
    this.varietySubject.next(varieties.concat(newSeedVariety));
  }

  private onSeedVarietyDeleted(deletedSeedVariety: SeedVariety): void {
    // Removes the deleted SeedVariety from the array
    let variety: SeedVariety[] = this.varietySubject.getValue()
      .filter((variety: SeedVariety) => variety.id != deletedSeedVariety.id);

    this.varietySubject.next(variety);
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
