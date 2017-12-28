import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Feature } from '../model/feature';
import { EntityService } from '../service/entity-service';

@Injectable()
export class FeatureService extends EntityService<Feature> {

  constructor(private httpClient: HttpClient) {
    super('/api/feature');
    super.loadData(httpClient);
  }

  save(feature: Feature): void {
    // Sends the new feature to the server, and then uses the superclass method to handle the response
    const response = this.httpClient.post<Feature>(`${this.endpointUrl}`, feature,
      { headers: this.jsonHttpHeader, observe: 'response' });

    super.handleSaveResponse(response);
  }

  delete(feature: Feature): void {
    // Sends the delete request to the server, and then uses the superclass method to handle the response
    const response = this.httpClient.delete<Feature>(`${this.endpointUrl}/${feature.id}`,
      { headers: this.jsonHttpHeader, observe: 'response' });

    super.handleDeleteResponse(feature, response);
  }

  get features(): Observable<Feature[]> {
    return this.subject.asObservable();
  }

}
