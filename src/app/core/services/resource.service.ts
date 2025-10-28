import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Resource } from '../models/resource.model';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  private apiUrl = `${environment.apiUrl}/microservice-inventory/api/v1/resource`;

  constructor(private http: HttpClient) {}

  getResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(this.apiUrl);
  }

  getResourceById(id: number | string): Observable<Resource> {
    return this.http.get<Resource>(`${this.apiUrl}/${id}`);
  }

  createResource(body: {
    code: string;
    stock?: number;
    resourcePhotoUrl?: string;
    observation?: string;
    idResourceType?: number;
    idState?: number;
  }): Observable<Resource> {
    return this.http.post<Resource>(this.apiUrl, body);
  }

  updateResource(
    id: number | string,
    body: {
      code: string;
      stock?: number;
      resourcePhotoUrl?: string;
      observation?: string;
      idResourceType?: number;
      idState?: number;
    }
  ): Observable<Resource> {
    return this.http.put<Resource>(`${this.apiUrl}/${id}`, body);
  }

  deleteResource(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
