import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { State } from '../models/state';

@Injectable({
  providedIn: 'root',
})
export class ResourceStateService {
  // URL actualizada para el nuevo endpoint de la API
  private apiUrl = `${environment.apiUrl}/microservice-inventory/api/v1/states`;

  constructor(private http: HttpClient) {}

  // Método para obtener todos los estados
  getStates(): Observable<State[]> {
    return this.http.get<State[]>(this.apiUrl);
  }

  // Método para obtener un estado por su ID
  getStateById(id: number | string): Observable<State> {
    return this.http.get<State>(`${this.apiUrl}/${id}`);
  }

  // Método para crear un nuevo estado
  createState(body: { name: string; isActive: boolean }): Observable<State> {
    return this.http.post<State>(this.apiUrl, body);
  }

  // Método para actualizar un estado existente
  updateState(
    id: number | string,
    body: { name: string; isActive: boolean }
  ): Observable<State> {
    return this.http.put<State>(`${this.apiUrl}/${id}`, body);
  }

  // Método para eliminar un estado
  deleteState(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
