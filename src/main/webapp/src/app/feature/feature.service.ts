import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Feature } from '../model/feature';

@Injectable()
export class FeatureService {

  private readonly endpointUrl: string = '/api/feature';
  private featuresSubject: BehaviorSubject<Feature[]> = new BehaviorSubject([]);

  constructor(private httpClient: HttpClient) {
    this.loadInitialData();
  }

  public get features(): Observable<Feature[]> {
    return this.featuresSubject.asObservable();
  }

  public addFeature(name: string): void {
    let header = new HttpHeaders({ ['Content-Type']: 'application/json' });
    let payload = { name: name };

    this.httpClient.post(`${this.endpointUrl}`, payload, { headers: header, observe: 'response' })
      .subscribe((response: HttpResponse<Feature>) => {
        let savedFeature = response.body;
        this.featuresSubject.next(this.featuresSubject.getValue().concat(savedFeature));
      });
  }

  private loadInitialData(): void {
    this.httpClient.get<Feature[]>(`${this.endpointUrl}`)
      .subscribe((features: Feature[]) => this.featuresSubject.next(features));
  }

}
