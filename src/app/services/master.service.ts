import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor(private http: HttpClient) {}

  LoadPage() {
    return this.http.get('http://127.0.0.1:8000/get_all_courses');
  }
}
