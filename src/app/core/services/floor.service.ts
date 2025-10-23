import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Floor } from '../models/floor';

@Injectable({
  providedIn: 'root',
})
export class FloorService {
  private apiUrl = `${environment.apiUrl}/api/environments/v1/api/floor`;
  constructor(private http: HttpClient) {}

  getFloors(): Observable<Floor[]> {
    return this.http.get<Floor[]>(this.apiUrl);
  }

  getFloorById(id: number): Observable<Floor> {
    return this.http.get<Floor>(`${this.apiUrl}/${id}`);
  }

  createFloor(body: {
    floor_number: number;
    id_building: number;
    is_active: string;
  }): Observable<Floor> {
    return this.http.post<Floor>(this.apiUrl, body);
  }

  updateFloor(
    id: number,
    body: { floor_number: number; id_building: number; is_active: string }
  ): Observable<Floor> {
    return this.http.put<Floor>(`${this.apiUrl}/${id}`, body);
  }

  deleteFloor(id?: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
