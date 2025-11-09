import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateUserDTO, UpdateUserDTO, UserDTO } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/api/users`;

  getUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.API_URL);
  }

  getUser(id: number | string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.API_URL}/${id}`);
  }

  createUser(data: CreateUserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.API_URL, data);
  }

  updateUser(id: number | string, data: UpdateUserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.API_URL}/${id}`, data);
  }

  deleteUser(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
