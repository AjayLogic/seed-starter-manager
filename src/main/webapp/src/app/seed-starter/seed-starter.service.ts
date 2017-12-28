import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import { SeedStarter } from '../model/seed-starter';
import { EntityService } from '../service/entity-service';

@Injectable()
export class SeedStarterService extends EntityService<SeedStarter> {

  constructor(private httpClient: HttpClient) {
    super('/api/seed-starter');
    super.loadData(httpClient);
  }

  save(seedStarter: SeedStarter): void {
    // Sends the new seed starter to the server, and then uses the superclass method to handle the response
    const response = this.httpClient.post<SeedStarter>(this.endpointUrl, seedStarter,
      { headers: this.jsonHttpHeader, observe: 'response' });

    super.handleSaveResponse(response);
  }

  delete(seedStarter: SeedStarter): void {
    // Sends the delete request to the server, and then uses the superclass method to handle the response
    const response = this.httpClient.delete<SeedStarter>(`${this.endpointUrl}/${seedStarter.id}`,
      { observe: 'response' });

    super.handleDeleteResponse(seedStarter, response);
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
        super.publishError(response);
        return Observable.of(null);
      });
  }

  get seedStarters(): Observable<SeedStarter[]> {
    return this.subject.asObservable();
  }

}
