import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Plan } from '../models/plan';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private apiUrl = `${environment.apiUrl}/courses/plan/v1/api`;
  constructor(private http: HttpClient) {}

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.apiUrl);
  }

  getPlanById(id: number): Observable<Plan> {
    return this.http.get<Plan>(`${this.apiUrl}/${id}`);
  }

  createPlan(body: { name: string }): Observable<Plan> {
    return this.http.post<Plan>(this.apiUrl, body);
  }

  updatePlan(id: number, body: { name: string }): Observable<Plan> {
    return this.http.put<Plan>(`${this.apiUrl}/${id}`, body);
  }

  deletePlan(id?: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
