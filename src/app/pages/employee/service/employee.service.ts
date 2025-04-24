import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { DetailEmployeeDto, EmployeeDto } from '../model/employee.model';
import { Paging, ResponsePagination } from '../../../shared/dto/global-model.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = '/api/employee';
  private readonly localStorageKey = 'employee_data';
  private readonly dummyJsonPath = 'assets/db_custom_paged.json';

  constructor(private http: HttpClient) {
    const existing = localStorage.getItem(this.localStorageKey);
    if (!existing) {
      this.http.get<EmployeeDto>(this.dummyJsonPath).subscribe(data => {
        localStorage.setItem(this.localStorageKey, JSON.stringify(data));
      });
    }
  }

  getAll(): DetailEmployeeDto[] {
    return this.load();
  }

  load(): DetailEmployeeDto[] {
    const raw = JSON.parse(localStorage.getItem(this.localStorageKey) || '{}');
    return raw.employee || [];
  }

  private save(data: DetailEmployeeDto[]): void {
    const dto: EmployeeDto = { employee: data };
    localStorage.setItem(this.localStorageKey, JSON.stringify(dto));
  }

  // getByUsername(username: string): DetailEmployeeDto | undefined {
  //   return this.load().find(emp => emp.username === username);
  // }

  getByUsername(username: string): DetailEmployeeDto | undefined {
    const all = this.getAll();
    return all.find(e => e.username === username);
  }

  add(employee: DetailEmployeeDto): void {
    const data = this.load();
    data.push(employee);
    this.save(data);
  }

  create(data: DetailEmployeeDto): void {
    const all = this.getAll();
    all.push(data);
    this.save(all);
  }
  
  update(username: string, data: DetailEmployeeDto): void {
    let all = this.getAll();
    const index = all.findIndex(e => e.username === username);
    if (index !== -1) {
      all[index] = { ...data };
      this.save(all);
    }
  }

  delete(username: string): void {
    const data = this.load().filter(e => e.username !== username);
    this.save(data);
  }
  
  list(params?: Params): Observable<[EmployeeDto, Paging]> {
    return this.http.get<ResponsePagination<EmployeeDto>>(`${this.apiUrl}`, { params }).pipe(
      map(({ data, paging }: ResponsePagination<EmployeeDto>) => [ data, paging ])
    );
  }
}
