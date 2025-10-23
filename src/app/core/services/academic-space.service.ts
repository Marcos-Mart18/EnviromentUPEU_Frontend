import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcademicSpace } from '../models/academic-space';

@Injectable({
  providedIn: 'root',
})
export class AcademicSpaceService {
  private apiUrl = `${environment.apiUrl}/api/environments/v1/api/academic-space`;
  constructor(private http: HttpClient) {}

  getAcademicSpaces(): Observable<AcademicSpace[]> {
    return this.http.get<AcademicSpace[]>(this.apiUrl);
  }

  getAcademicSpaceById(id: number): Observable<AcademicSpace> {
    return this.http.get<AcademicSpace>(`${this.apiUrl}/${id}`);
  }

  createAcademicSpace(body: {
    space_name: string;
    capacity: number;
    location: string;
    observation: string;
    id_floor: number;
    id_state: number;
    id_type_academic_space: number;
  }): Observable<AcademicSpace> {
    return this.http.post<AcademicSpace>(this.apiUrl, body);
  }

  updateAcademicSpace(
    id: number,
    body: {
      space_name: string;
      capacity: number;
      location: string;
      observation: string;
      id_floor: number;
      id_state: number;
      id_type_academic_space: number;
    }
  ): Observable<AcademicSpace> {
    return this.http.put<AcademicSpace>(`${this.apiUrl}/${id}`, body);
  }

  deleteAcademicSpace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
