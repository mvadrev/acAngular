import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { interval, take, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor(private http: HttpClient) {}

  LoadPage(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/get_all_courses');
  }

  postCourse(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(`http://127.0.0.1:8000/create_course`, data, {
      headers,
    });
  }

  updateCourse(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(`http://127.0.0.1:8000/update-course`, data, {
      headers,
    });
  }

  // Paaginated version
  getPaginatedAllCourses(page: number, limit: number): Observable<any[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    const apiUrl = 'http://localhost:8000/get_all_courses_new/';
    return this.http.post<any[]>(apiUrl, {}, { params });
  }

  deleteCourse(courseId: string): Promise<any> {
    console.log('Service - Making delete request to API');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Assuming your backend expects the courseId in the body
    const body = { id: courseId }; // or use whatever structure your backend expects

    return lastValueFrom(
      this.http.post(`http://127.0.0.1:8000/delete-course`, body, {
        headers,
      })
    )
      .then((response) => {
        console.log('Delete successful:', response);
        return response;
      })
      .catch((error) => {
        console.error('Error occurred while deleting course:', error);
        throw error;
      });
  }
}
