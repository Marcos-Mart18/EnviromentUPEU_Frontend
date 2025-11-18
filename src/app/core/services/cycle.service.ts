import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cycle } from '../models/cycle';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CycleService {
  private apiUrl = `${environment.apiUrl}/courses/cycle/v1/api`;
  constructor(private http: HttpClient) {}

  getCycles(): Observable<Cycle[]> {
    return this.http.get<Cycle[]>(this.apiUrl);
  }

  getCycleById(id: number): Observable<Cycle> {
    return this.http.get<Cycle>(`${this.apiUrl}/${id}`);
  }

  createCycle(body: {
    name: string;
    idProfessionalSchool: number;
  }): Observable<Cycle> {
    return this.http.post<Cycle>(this.apiUrl, body);
  }

  updateCycle(
    id: number,
    body: { name: string; idProfessionalSchool: number }
  ): Observable<Cycle> {
    return this.http.put<Cycle>(`${this.apiUrl}/${id}`, body);
  }

  deleteCycle(id?: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
