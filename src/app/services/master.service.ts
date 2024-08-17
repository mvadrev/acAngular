import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor(private http: HttpClient) {}

  LoadPage() {
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
}
