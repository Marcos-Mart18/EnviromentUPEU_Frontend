import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseAssignmentCourse } from '../models/course-assignment-course';

@Injectable({
  providedIn: 'root',
})
export class CourseAssignmentCourseService {
  private apiUrl = `${environment.apiUrl}/courses/course-assignment-course/v1/api`;
  constructor(private http: HttpClient) {}

  getCouseAssignmentCourse(): Observable<CourseAssignmentCourse[]> {
    return this.http.get<CourseAssignmentCourse[]>(this.apiUrl);
  }

  getCourseTypeById(id: number): Observable<CourseAssignmentCourse> {
    return this.http.get<CourseAssignmentCourse>(`${this.apiUrl}/${id}`);
  }

  createCourseType(body: {
    idCourse: number;
    idCourseAssignment: number;
  }): Observable<CourseAssignmentCourse> {
    return this.http.post<CourseAssignmentCourse>(this.apiUrl, body);
  }

  updateCourseType(
    id: number,
    body: { idCourse: number; idCourseAssignment: number }
  ): Observable<CourseAssignmentCourse> {
    return this.http.put<CourseAssignmentCourse>(`${this.apiUrl}/${id}`, body);
  }

  deleteCourseType(id?: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
