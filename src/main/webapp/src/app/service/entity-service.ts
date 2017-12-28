import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/empty';

import { Entity } from '../model/entity';
import { ServiceError } from '../model/service-error';
import { ServiceEvent } from '../model/service-event.enum';

export abstract class EntityService<T extends Entity> {

  protected readonly endpointUrl;
  protected readonly jsonHttpHeader: HttpHeaders;

  protected subject: BehaviorSubject<T[]> = new BehaviorSubject([]);
  protected eventSubject: BehaviorSubject<ServiceEvent> = new BehaviorSubject(null);
  protected errorSubject: BehaviorSubject<ServiceError> = new BehaviorSubject(null);

  constructor(endpointUrl: string) {
    this.endpointUrl = endpointUrl;
    this.jsonHttpHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  abstract save(entity: T): void;

  abstract delete(entity: T): void;

  protected loadData(httpClient: HttpClient): void {
    httpClient.get(`${this.endpointUrl}`, { observe: 'response' })
      .catch((error: HttpErrorResponse) => this.handleHttpErrorResponse(error))
      .subscribe((response: HttpResponse<T[]>) => {
        if (response.status == 200) {
          this.subject.next(response.body);
        }
      });
  }

  protected onEntityCreated(newEntity: T): void {
    // Gets all existent entities and then adds the new one on the end
    const entities: T[] = this.subject.getValue().concat(newEntity);

    // Publishes the updated array and then publish the correspondent ServiceEvent
    this.publishEntities(entities, ServiceEvent.ENTITY_CREATED);
  }

  protected onEntityUpdated(updatedEntity: T): void {
    const entities: T[] = this.subject.getValue();

    // Finds the old entity by using the 'id' property
    entities.some((entity: T, index: number) => {
      if (entity.id === updatedEntity.id) {
        // Replaces the old entity with the updated one
        entities[index] = updatedEntity;

        // Publishes the updated array and then publish the correspondent ServiceEvent
        this.publishEntities(entities, ServiceEvent.ENTITY_UPDATED);
        return true;
      }
    });
  }

  protected onEntityDeleted(entity: T): void {
    // Removes the deleted entity from the subject
    const entities: T[] = this.subject.getValue().filter((t: T) => t.id != entity.id);

    // Publishes the updated array and then publish the correspondent ServiceEvent
    this.publishEntities(entities, ServiceEvent.ENTITY_DELETED);
  }

  protected handleSaveResponse(httpResponse: Observable<HttpResponse<T>>): void {
    httpResponse
      .catch((error: HttpErrorResponse) => this.handleHttpErrorResponse(error))
      .subscribe((response: HttpResponse<T>) => {
        switch (response.status) {
          case 200:
            this.onEntityUpdated(response.body);
            break;
          case 201:
            this.onEntityCreated(response.body);
            break;
        }
      });
  }

  protected handleDeleteResponse(deletedEntity: T, httpResponse: Observable<HttpResponse<T>>): void {
    httpResponse.subscribe((response: HttpResponse<null>) => {
      switch (response.status) {
        case 200:
          this.onEntityDeleted(deletedEntity);
          break;
      }
    });
  }

  protected publishError(response: HttpResponseBase) {
    this.errorSubject.next(ServiceError.fromStatusCode(response.status));
  }

  get events(): Observable<ServiceEvent> {
    return this.eventSubject.asObservable();
  }

  get errors(): Observable<ServiceError> {
    return this.errorSubject.asObservable();
  }

  private handleHttpErrorResponse(error: HttpErrorResponse): Observable<T> {
    // Publishes the error for it to be manipulated at the component level
    this.publishError(error);

    // Returns an empty Observable to continue
    return Observable.empty();
  }

  private publishEntities(entities: T[], event: ServiceEvent): void {
    this.subject.next(entities);
    this.eventSubject.next(event);
  }

}
