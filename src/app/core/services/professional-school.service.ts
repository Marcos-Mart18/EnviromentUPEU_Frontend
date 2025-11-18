import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ProfessionalSchool } from '../models/professional-school';
import { Faculty } from '../models/faculty';

@Injectable({
  providedIn: 'root',
})
export class ProfessionalSchoolService {
  private apiUrl = `${environment.apiUrl}/courses/professional-school/v1/api`;
  constructor(private http: HttpClient) {}

  getProfessionalSchools(): Observable<ProfessionalSchool[]> {
    return this.http.get<ProfessionalSchool[]>(this.apiUrl);
  }

  getProfessionalSchoolById(id: number): Observable<ProfessionalSchool> {
    return this.http.get<ProfessionalSchool>(`${this.apiUrl}/${id}`);
  }

  createProfessionalSchool(body: {
    name: string;
    idFaculty: number;
  }): Observable<ProfessionalSchool> {
    return this.http.post<ProfessionalSchool>(this.apiUrl, body);
  }

  updateProfessionalSchool(
    id: number,
    body: { name: string; idFaculty: number }
  ): Observable<ProfessionalSchool> {
    return this.http.put<ProfessionalSchool>(`${this.apiUrl}/${id}`, body);
  }

  deleteProfessionalSchool(id?: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
