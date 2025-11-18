import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CourseType } from '../models/course-type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseTypeService {
  private apiUrl = `${environment.apiUrl}/courses/course-type/v1/api`;
  constructor(private http: HttpClient) {}

  getCourseTypes(): Observable<CourseType[]> {
    return this.http.get<CourseType[]>(this.apiUrl);
  }

  getCourseTypeById(id: number): Observable<CourseType> {
    return this.http.get<CourseType>(`${this.apiUrl}/${id}`);
  }

  createCourseType(body: { name: string }): Observable<CourseType> {
    return this.http.post<CourseType>(this.apiUrl, body);
  }

  updateCourseType(id: number, body: { name: string }): Observable<CourseType> {
    return this.http.put<CourseType>(`${this.apiUrl}/${id}`, body);
  }

  deleteCourseType(id?: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
