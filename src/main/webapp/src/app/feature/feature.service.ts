import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Feature } from '../model/feature';

@Injectable()
export class FeatureService {

  private readonly endpointUrl: string = '/api/feature';

  constructor(private httpClient: HttpClient) { }

  getAllFeatures(): Observable<Feature[]> {
    return this.httpClient.get<Feature[]>(`${this.endpointUrl}`);
  }

  addFeature(name: string): Observable<HttpResponse<any>> {
    let header = new HttpHeaders({ ['Content-Type']: 'application/json' });
    let payload = { name: name };

    return this.httpClient
      .post(`${this.endpointUrl}`, payload, { headers: header, observe: 'response' });
  }

}
