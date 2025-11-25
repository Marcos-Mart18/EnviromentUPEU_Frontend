import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Course } from '../models/course';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses/course/v1/api`;
  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  createCourse(body: {
    name: string;
    code: string;
    description: string;
    duration: number;
    practicalHours: number;
    theoreticalHours: number;
    totalHours: number;
    idCourseType: number;
    idGroup: number;
    idPlan: number;
  }): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, body);
  }

  updateCourse(
    id: number,
    body: {
      name: string;
      code: string;
      description: string;
      duration: number;
      practicalHours: number;
      theoreticalHours: number;
      totalHours: number;
      idCourseType: number;
      idGroup: number;
      idPlan: number;
    }
  ): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, body);
  }

  deleteCourse(id?: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
