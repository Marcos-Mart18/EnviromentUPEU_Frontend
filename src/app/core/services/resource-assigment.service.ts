import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ResourceAssignmentRequest,
  ResourceAssignmentResponse,
  ResourceAssignmentDetailsResponse,
} from '../models/resource-assignment.model';

@Injectable({ providedIn: 'root' })
export class ResourceAssigmentService {
  private apiUrl = `${environment.apiUrl}/microservice-inventory/api/v1/resource-assignments`;

  constructor(private http: HttpClient) {}

  // Basic list
  getAll(): Observable<ResourceAssignmentResponse[]> {
    return this.http.get<ResourceAssignmentResponse[]>(this.apiUrl);
  }

  // Get by ID
  getById(id: number | string): Observable<ResourceAssignmentResponse> {
    return this.http.get<ResourceAssignmentResponse>(`${this.apiUrl}/${id}`);
  }

  // Create
  create(body: ResourceAssignmentRequest): Observable<ResourceAssignmentResponse> {
    return this.http.post<ResourceAssignmentResponse>(this.apiUrl, body);
  }

  // Update
  update(id: number | string, body: ResourceAssignmentRequest): Observable<ResourceAssignmentResponse> {
    return this.http.put<ResourceAssignmentResponse>(`${this.apiUrl}/${id}`, body);
  }

  // Delete
  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Filter by resource
  getByResource(resourceId: number | string): Observable<ResourceAssignmentResponse[]> {
    return this.http.get<ResourceAssignmentResponse[]>(`${this.apiUrl}/resource/${resourceId}`);
  }

  // Filter by academic space
  getByAcademicSpace(academicSpaceId: number | string): Observable<ResourceAssignmentResponse[]> {
    return this.http.get<ResourceAssignmentResponse[]>(`${this.apiUrl}/academic-space/${academicSpaceId}`);
  }

  // Special details list
  getDetails(): Observable<ResourceAssignmentDetailsResponse[]> {
    return this.http.get<ResourceAssignmentDetailsResponse[]>(`${this.apiUrl}/details`);
  }
}
