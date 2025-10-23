import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { TypeAcademicSpace } from '../models/type-academic-space';

@Injectable({
  providedIn: 'root',
})
export class TypeAcademicSpaceService {
  private apiUrl = `${environment.apiUrl}/api/environments/v1/api/type-academic-space`;
  constructor(private http: HttpClient) {}

  getTypeAcademicSpaces(): Observable<TypeAcademicSpace[]> {
    return this.http.get<TypeAcademicSpace[]>(this.apiUrl);
  }

  getTypeAcademicSpaceById(id: number): Observable<TypeAcademicSpace> {
    return this.http.get<TypeAcademicSpace>(`${this.apiUrl}/${id}`);
  }

  createTypeAcademicSpace(body: {
    name: string;
    is_active: string;
  }): Observable<TypeAcademicSpace> {
    return this.http.post<TypeAcademicSpace>(this.apiUrl, body);
  }

  updateTypeAcademicSpace(
    id: number,
    body: { name: string; is_active: string }
  ): Observable<TypeAcademicSpace> {
    return this.http.put<TypeAcademicSpace>(`${this.apiUrl}/${id}`, body);
  }

  deleteTypeAcademicSpace(id?: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
