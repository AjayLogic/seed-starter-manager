import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MaterialType } from '../model/material-type';
import { EntityService } from '../service/entity-service';

@Injectable()
export class MaterialTypeService extends EntityService<MaterialType> {

  constructor(private httpClient: HttpClient) {
    super('/api/material');
    super.loadData(httpClient);
  }

  save(material: MaterialType): void {
    // Sends the new material to the server, and then uses the superclass method to handle the response
    const response = this.httpClient.post<MaterialType>(`${this.endpointUrl}`, material,
      { headers: this.jsonHttpHeader, observe: 'response' });

    super.handleSaveResponse(response);
  }

  delete(material: MaterialType): void {
    // Sends the delete request to the server, and then uses the superclass method to handle the response
    const response = this.httpClient.delete<MaterialType>(`${this.endpointUrl}/${material.id}`,
      { headers: this.jsonHttpHeader, observe: 'response' });

    super.handleDeleteResponse(material, response);
  }

  get materials(): Observable<MaterialType[]> {
    return this.subject.asObservable();
  }

}
