import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

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
            case 200: // SeedStarter has been updated successfully
              this.onSeedStarterUpdated(response.body);
              break;
            case 201:  // SeedStarter has been created successfully
              this.onSeedStarterCreated(response.body);
              break;
            default:
              this.publishError(response);
          }
        },
        (error: HttpErrorResponse) => this.publishError(error)
      );
  }

  deleteSeedStarter(seedStarter: SeedStarter): void {
    this.httpClient.delete(`${this.endpointUrl}/${seedStarter.id}`, { observe: 'response' })
      .subscribe((response: HttpResponse<null>) => {
        switch (response.status) {
          case 200:
            this.onSeedStarterDeleted(seedStarter);
            break;
          default:
            this.publishError(response);
        }
      });
  }

  findSeedStarterById(id: number): Observable<SeedStarter> {
    return this.httpClient.get(`${this.endpointUrl}/${id}`, { observe: 'response' })
      .map((response: HttpResponse<SeedStarter>) => {
        // Checks if the seed starter was found
        if (response.status === 200) {
          return response.body;
        }
      })
      .catch((response: HttpResponse<SeedStarter>) => {
        this.publishError(response);
        return Observable.of(null);
      });
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

  private onSeedStarterUpdated(updatedSeedStarter: SeedStarter): void {
    let seedStarters = this.seedStarterSubject.getValue();

    // Finds the index of the updated seed starter on the array
    const existentSeedStarterIndex = seedStarters.findIndex((existentSeedStarter: SeedStarter) => {
      return existentSeedStarter.id === updatedSeedStarter.id;
    });

    // Replaces the existing seed starter with the updated one, and publish the updated array
    seedStarters[existentSeedStarterIndex] = updatedSeedStarter;
    this.seedStarterSubject.next(seedStarters);
    this.eventSubject.next(ServiceEvent.ENTITY_UPDATED);
  }

  private onSeedStarterCreated(newSeedStarter: SeedStarter): void {
    const seedStarters: SeedStarter[] = this.seedStarterSubject.getValue().concat(newSeedStarter);

    this.seedStarterSubject.next(seedStarters);
    this.eventSubject.next(ServiceEvent.ENTITY_CREATED);
  }

  private onSeedStarterDeleted(deletedSeedStarter: SeedStarter): void {
    // Removes the deleted seed starter from the seedStarterSubject
    const seedStarters = this.seedStarterSubject.getValue()
      .filter((seedStarter: SeedStarter) => seedStarter.id != deletedSeedStarter.id);

    this.seedStarterSubject.next(seedStarters);
    this.eventSubject.next(ServiceEvent.ENTITY_DELETED);
  }

}
