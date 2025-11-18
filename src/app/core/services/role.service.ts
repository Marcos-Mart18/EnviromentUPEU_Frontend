import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RoleDTO, CreateRoleDTO, UpdateRoleDTO } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/microservice-auth/api/auth/roles`;

  listRoles(): Observable<RoleDTO[]> {
    return this.http.get<any>(this.API_URL).pipe(
      map((resp) => {
        let items: any[] = [];
        if (Array.isArray(resp)) items = resp;
        else if (Array.isArray(resp?.data)) items = resp.data;
        else if (Array.isArray(resp?.content)) items = resp.content;
        else if (Array.isArray(resp?.items)) items = resp.items;
        else if (Array.isArray(resp?.data?.content)) items = resp.data.content;
        else if (Array.isArray(resp?.data?.items)) items = resp.data.items;
        return (items || []) as RoleDTO[];
      })
    );
  }

  getRole(id: number | string): Observable<RoleDTO> {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map((resp) => (resp?.data ?? resp) as RoleDTO)
    );
  }

  createRole(dto: CreateRoleDTO): Observable<RoleDTO> {
    return this.http.post<any>(this.API_URL, dto).pipe(
      map((resp) => (resp?.data ?? resp) as RoleDTO)
    );
  }

  updateRole(id: number | string, dto: UpdateRoleDTO): Observable<RoleDTO> {
    return this.http.put<any>(`${this.API_URL}/${id}`, dto).pipe(
      map((resp) => (resp?.data ?? resp) as RoleDTO)
    );
  }

  deleteRole(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
