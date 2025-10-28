import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoryResource } from '../models/category-resource.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryResourceService {
  private apiUrl = `${environment.apiUrl}/microservice-inventory/api/v1/category-resources`;

  constructor(private http: HttpClient) {}

  getCategoryResources(): Observable<CategoryResource[]> {
    return this.http.get<CategoryResource[]>(this.apiUrl);
  }

  getCategoryResourceById(id: number | string): Observable<CategoryResource> {
    return this.http.get<CategoryResource>(`${this.apiUrl}/${id}`);
  }

  createCategoryResource(body: {
    name: string;
    isActive: boolean;
  }): Observable<CategoryResource> {
    return this.http.post<CategoryResource>(this.apiUrl, body);
  }

  updateCategoryResource(
    id: number | string,
    body: { name: string; isActive: boolean }
  ): Observable<CategoryResource> {
    return this.http.put<CategoryResource>(`${this.apiUrl}/${id}`, body);
  }

  deleteCategoryResource(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
