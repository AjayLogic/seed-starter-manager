import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Feature } from '../model/feature';

@Injectable()
export class FeatureService {

  private readonly endpointUrl: string = '/api/feature';

  constructor(private httpClient: HttpClient) { }

  getAllFeatures(): Observable<Feature[]> {
    return this.httpClient.get<Feature[]>(`${this.endpointUrl}`);
  }

}
