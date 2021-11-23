import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { Paper } from "../models/paper.model";

const baseUrl = 'http://localhost:8090/news';

@Injectable({
  providedIn: 'root'
})
export class PaperService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Paper[]> {
    return this.http.get<Paper[]>(baseUrl);
  }

  remove(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
