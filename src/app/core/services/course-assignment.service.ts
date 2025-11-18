import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseAssignment } from '../models/course-assignment';

@Injectable({
  providedIn: 'root',
})
export class CourseAssignmentService {
  private apiUrl = `${environment.apiUrl}/courses/course-assignment/v1/api`;
  constructor(private http: HttpClient) {}

  getCouseAssignment(): Observable<CourseAssignment[]> {
    return this.http.get<CourseAssignment[]>(this.apiUrl);
  }

  getCourseTypeById(id: number): Observable<CourseAssignment> {
    return this.http.get<CourseAssignment>(`${this.apiUrl}/${id}`);
  }

  createCourseType(body: { idTeacher: number }): Observable<CourseAssignment> {
    return this.http.post<CourseAssignment>(this.apiUrl, body);
  }

  updateCourseType(
    id: number,
    body: { idTeacher: number }
  ): Observable<CourseAssignment> {
    return this.http.put<CourseAssignment>(`${this.apiUrl}/${id}`, body);
  }

  deleteCourseType(id?: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
