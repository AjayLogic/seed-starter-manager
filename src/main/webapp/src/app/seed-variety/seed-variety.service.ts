import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SeedVariety } from '../model/seed-variety';
import { EntityService } from '../service/entity-service';

@Injectable()
export class SeedVarietyService extends EntityService<SeedVariety> {

  constructor(private httpClient: HttpClient) {
    super('/api/variety');
    super.loadData(httpClient);
  }

  save(variety: SeedVariety): void {
    let payload: FormData = new FormData();

    // Adds the new variety to the payload
    payload.append('seed-variety', new Blob([JSON.stringify(variety)], { type: 'application/json' }));

    // Adds the image to the payload if it was selected
    if (variety.imageName) {
      payload.append('seed-variety-image', variety.imageName);
    }

    // Sends the payload to the server, and then uses the superclass method to handle the response
    const response = this.httpClient.post<SeedVariety>(`${this.endpointUrl}`, payload, { observe: 'response' });
    super.handleSaveResponse(response);
  }

  delete(variety: SeedVariety): void {
    // Sends the delete request to the server, and then uses the superclass method to handle the response
    const response = this.httpClient.delete<SeedVariety>(`${this.endpointUrl}/${variety.id}`,
      { headers: this.jsonHttpHeader, observe: 'response' });

    super.handleDeleteResponse(variety, response);
  }

  get varieties(): Observable<SeedVariety[]> {
    return this.subject.asObservable();
  }

}
