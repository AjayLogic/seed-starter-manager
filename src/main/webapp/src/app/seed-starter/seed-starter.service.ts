import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { SeedStarter } from '../model/seed-starter';
import { ServiceError } from '../model/service-error';
import { ServiceEvent } from '../model/service-event.enum';

@Injectable()
export class SeedStarterService {

  private readonly endpointUrl: string = '/api/seed-starter';
  private httpHeader: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  private seedStarterSubject: BehaviorSubject<SeedStarter[]> = new BehaviorSubject([]);
  private errorSubject: BehaviorSubject<ServiceError> = new BehaviorSubject(null);
  private eventSubject: BehaviorSubject<ServiceEvent> = new BehaviorSubject(null);

  constructor(private httpClient: HttpClient) {
    this.loadInitialData();
  }

  createOrUpdateSeedStarter(seedStarter: SeedStarter): void {
    this.httpClient.post(this.endpointUrl, seedStarter, { headers: this.httpHeader, observe: 'response' })
      .subscribe((response: HttpResponse<SeedStarter>) => {
          switch (response.status) {
            case 201:  // SeedStarter has been created successfully
              this.onSeedStarterCreated(response.body);
              this.eventSubject.next(ServiceEvent.ENTITY_CREATED);
              break;
            default:
              this.publishError(response);
          }
        },
        (error: HttpErrorResponse) => this.publishError(error)
      );
  }

  get seedStarters(): Observable<SeedStarter[]> {
    return this.seedStarterSubject.asObservable();
  }

  get events(): Observable<ServiceEvent> {
    return this.eventSubject.asObservable();
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

  private onSeedStarterCreated(newSeedStarter: SeedStarter): void {
    const seedStarters: SeedStarter[] = this.seedStarterSubject.getValue().concat(newSeedStarter);
    this.seedStarterSubject.next(seedStarters);
  }

}
