import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Building } from '../models/building';
import { Floor } from '../models/floor';

@Injectable({
  providedIn: 'root',
})
export class BuildingService {
  private apiUrl = `${environment.apiUrl}/environments/v1/api/building`;
  constructor(private http: HttpClient) {}

  getBuildings(): Observable<Building[]> {
    return this.http.get<Building[]>(this.apiUrl);
  }
  getBuildingById(id: number): Observable<Building> {
    return this.http.get<Building>(`${this.apiUrl}/${id}`);
  }

  getFloorByBuilding(id: number): Observable<Floor[]> {
    return this.http.get<Floor[]>(`${this.apiUrl}/${id}/floors`);
  }

  createBuilding(body: {
    name: string;
    is_active: string;
  }): Observable<Building> {
    return this.http.post<Building>(this.apiUrl, body);
  }
  updateBuilding(
    id: number,
    body: { name: string; is_active: string }
  ): Observable<Building> {
    return this.http.put<Building>(`${this.apiUrl}/${id}`, body);
  }
  deleteBuilding(id?: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
