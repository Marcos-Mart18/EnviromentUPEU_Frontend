import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../models/group';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl = `${environment.apiUrl}/courses/group/v1/api`;
  constructor(private http: HttpClient) {}

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl);
  }

  getGroupById(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`);
  }

  createGroup(body: {
    groupNumber: number;
    capacity: number;
    idCycle: number;
  }): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, body);
  }

  updateGroup(
    id: number,
    body: { groupNumber: number; capacity: number; idCycle: number }
  ): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/${id}`, body);
  }

  deleteGroup(id?: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
