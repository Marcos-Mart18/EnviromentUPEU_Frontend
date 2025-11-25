import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { State } from '../models/state';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private apiUrl = `${environment.apiUrl}/environments/v1/api/state`;
  constructor(private http: HttpClient) {}

  getStates(): Observable<State[]> {
    return this.http.get<State[]>(this.apiUrl);
  }
  getStateById(id: number): Observable<State> {
    return this.http.get<State>(`${this.apiUrl}/${id}`);
  }
  createState(body: { name: string; is_active: string }): Observable<State> {
    return this.http.post<State>(this.apiUrl, body);
  }
  updateState(
    id: number,
    body: { name: string; is_active: string }
  ): Observable<State> {
    return this.http.put<State>(`${this.apiUrl}/${id}`, body);
  }
  deleteState(id?: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
