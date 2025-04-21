import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersDto } from '../model/users.model';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = 'https://dummyjson.com';

  constructor(
    private http: HttpClient
  ) { }

  list(params: Params): Observable<{ users: UsersDto[] }> {
    return this.http.get<{ users: UsersDto[]}>(`${this.baseUrl}/users`, { params });
  }
}
