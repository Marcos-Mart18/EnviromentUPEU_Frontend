import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResourceType } from '../models/resource-type.model';

@Injectable({
  providedIn: 'root',
})
export class ResourceTypeService {
  private apiUrl = `${environment.apiUrl}/microservice-inventory/api/v1/resource-types`;

  constructor(private http: HttpClient) {}

  getResourceTypes(): Observable<ResourceType[]> {
    return this.http.get<ResourceType[]>(this.apiUrl);
  }

  getResourceTypeById(id: number | string): Observable<ResourceType> {
    return this.http.get<ResourceType>(`${this.apiUrl}/${id}`);
  }

  createResourceType(body: {
    name: string;
    isActive: boolean;
    idCategoryResource?: number;
  }): Observable<ResourceType> {
    return this.http.post<ResourceType>(this.apiUrl, body);
  }

  updateResourceType(
    id: number | string,
    body: {
      name: string;
      isActive: boolean;
      idCategoryResource?: number;
    }
  ): Observable<ResourceType> {
    return this.http.put<ResourceType>(`${this.apiUrl}/${id}`, body);
  }

  deleteResourceType(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
