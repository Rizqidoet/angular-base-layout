import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { EmployeeDto } from '../model/employee.model';
import { Paging, ResponsePagination } from '../../../shared/dto/global-model.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = '/api/employee';

  constructor(
    private http: HttpClient
  ) { }

  list(params?: Params): Observable<[EmployeeDto, Paging]> {
    return this.http.get<ResponsePagination<EmployeeDto>>(`${this.apiUrl}`, { params }).pipe(
      map(({ data, paging }: ResponsePagination<EmployeeDto>) => [ data, paging ])
    );
  }
}
