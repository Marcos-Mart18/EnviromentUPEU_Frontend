import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateUserProfileDTO,
  UpdateUserProfileDTO,
  UserProfileDTO,
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/ms-user/api/v1/user-profiles`;

  getUsers(): Observable<UserProfileDTO[]> {
    return this.http.get<any>(this.API_URL).pipe(
      map((resp) => {
        let items: any[] = [];
        if (Array.isArray(resp)) {
          items = resp;
        } else if (Array.isArray(resp?.data)) {
          items = resp.data;
        } else if (Array.isArray(resp?.content)) {
          items = resp.content;
        } else if (Array.isArray(resp?.items)) {
          items = resp.items;
        } else if (Array.isArray(resp?.data?.content)) {
          items = resp.data.content;
        } else if (Array.isArray(resp?.data?.items)) {
          items = resp.data.items;
        }
        return (items || []).map((raw) => this.mapUserProfile(raw));
      })
    );
  }

  getUser(id: number | string): Observable<UserProfileDTO> {
    return this.http
      .get<any>(`${this.API_URL}/${id}`)
      .pipe(map((resp) => this.mapUserProfile(resp?.data ?? resp)));
  }

  createUser(data: CreateUserProfileDTO): Observable<UserProfileDTO> {
    return this.http
      .post<any>(this.API_URL, data)
      .pipe(map((raw) => this.mapUserProfile(raw?.data ?? raw)));
  }

  updateUser(
    id: number | string,
    data: UpdateUserProfileDTO
  ): Observable<UserProfileDTO> {
    return this.http
      .put<any>(`${this.API_URL}/${id}`, data)
      .pipe(map((raw) => this.mapUserProfile(raw?.data ?? raw)));
  }

  deleteUser(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  updateProfilePicture(
    id: number | string,
    file: File
  ): Observable<UserProfileDTO> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .put<any>(`${this.API_URL}/${id}/profile-picture`, formData)
      .pipe(map((raw) => this.mapUserProfile(raw?.data ?? raw)));
  }

  activateUserProfile(id: number | string): Observable<UserProfileDTO> {
    return this.http
      .patch<any>(`${this.API_URL}/${id}/activate`, {})
      .pipe(map((raw) => this.mapUserProfile(raw?.data ?? raw)));
  }

  deactivateUserProfile(id: number | string): Observable<UserProfileDTO> {
    return this.http
      .patch<any>(`${this.API_URL}/${id}/deactivate`, {})
      .pipe(map((raw) => this.mapUserProfile(raw?.data ?? raw)));
  }

  private mapUserProfile(raw: any): UserProfileDTO {
    const id =
      raw?.id ??
      raw?.userProfileId ??
      raw?.idUserProfile ??
      raw?.id_user_profile ??
      raw?.profileId ??
      raw?.idProfile ??
      raw?.userId ??
      raw?.uuid;
    return {
      id: typeof id === 'string' ? Number(id) : id,
      names: raw?.names ?? raw?.nombres ?? raw?.firstName ?? '',
      lastName: raw?.lastName ?? raw?.apellidos ?? raw?.last_name ?? '',
      email: raw?.email ?? '',
      phoneNumber: raw?.phoneNumber ?? raw?.phone ?? '',
      address: raw?.address ?? '',
      dob: raw?.dob ?? raw?.birthDate ?? raw?.birth_date ?? '',
      isActive: raw?.isActive ?? raw?.active ?? raw?.estado ?? false,
      profilePicture:
        raw?.profilePicture ??
        raw?.profilePictureUrl ??
        raw?.profile_picture_url ??
        raw?.photoUrl,
    } as UserProfileDTO;
  }
}
