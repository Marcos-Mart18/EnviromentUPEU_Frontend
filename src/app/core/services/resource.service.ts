import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Resource } from '../models/resource.model';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  private apiUrl = `${environment.apiUrl}/microservice-inventory/api/v1/resources`;

  constructor(private http: HttpClient) {}

  getResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(this.apiUrl);
  }

  getResourceById(id: number | string): Observable<Resource> {
    return this.http.get<Resource>(`${this.apiUrl}/${id}`);
  }

  // Overloads to accept either FormData or a Partial<Resource> + optional file
  createResource(form: FormData): Observable<Resource>;
  createResource(resource: Partial<Resource>, photo?: File): Observable<Resource>;
  createResource(resourceOrForm: Partial<Resource> | FormData, photo?: File): Observable<Resource> {
    if (resourceOrForm instanceof FormData) {
      return this.http.post<Resource>(this.apiUrl, resourceOrForm);
    }
    const payload = {
      code: resourceOrForm.code,
      stock: resourceOrForm.stock,
      observation: resourceOrForm.observation,
      idResourceType: resourceOrForm.idResourceType ?? resourceOrForm.resourceType?.idResourceType,
      idState: resourceOrForm.idState ?? resourceOrForm.state?.idState,
    };
    const formData = new FormData();
    formData.append('resource', JSON.stringify(payload));
    if (photo) {
      formData.append('photo', photo);
    }
    return this.http.post<Resource>(this.apiUrl, formData);
  }

  updateResource(
    id: number | string,
    form: FormData
  ): Observable<Resource>;
  updateResource(
    id: number | string,
    resource: Partial<Resource>,
    photo?: File
  ): Observable<Resource>;
  updateResource(
    id: number | string,
    resourceOrForm: Partial<Resource> | FormData,
    photo?: File
  ): Observable<Resource> {
    if (resourceOrForm instanceof FormData) {
      return this.http.put<Resource>(`${this.apiUrl}/${id}`, resourceOrForm);
    }
    const payload = {
      code: resourceOrForm.code,
      stock: resourceOrForm.stock,
      observation: resourceOrForm.observation,
      idResourceType: resourceOrForm.idResourceType ?? resourceOrForm.resourceType?.idResourceType,
      idState: resourceOrForm.idState ?? resourceOrForm.state?.idState,
    };
    const formData = new FormData();
    formData.append('resource', JSON.stringify(payload));
    if (photo) {
      formData.append('photo', photo);
    }
    return this.http.put<Resource>(`${this.apiUrl}/${id}`, formData);
  }

  deleteResource(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
