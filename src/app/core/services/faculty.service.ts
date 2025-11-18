import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Faculty } from '../models/faculty';

@Injectable({
  providedIn: 'root',
})
export class FacultyService {
  private apiUrl = `${environment.apiUrl}/courses/faculty/v1/api`;
  constructor(private http: HttpClient) {}

  getFaculties(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(this.apiUrl);
  }

  getFacultyById(id: number): Observable<Faculty> {
    return this.http.get<Faculty>(`${this.apiUrl}/${id}`);
  }

  createFaculty(body: { name: string }): Observable<Faculty> {
    return this.http.post<Faculty>(this.apiUrl, body);
  }

  updateFaculty(id: number, body: { name: string }): Observable<Faculty> {
    return this.http.put<Faculty>(`${this.apiUrl}/${id}`, body);
  }

  deleteFaculty(id?: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
