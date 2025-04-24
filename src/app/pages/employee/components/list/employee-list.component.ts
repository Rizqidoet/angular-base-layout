import { Component, OnInit } from '@angular/core';
import { DetailEmployeeDto, EmployeeDto } from '../../model/employee.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Params, Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ErrorMessage, Paging } from '../../../../shared/dto/global-model.model';
import { EmployeeService } from '../../service/employee.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { itemsRowPerPage, maxPages } from '../../../../shared/dto/types/constant';
import { NgSelectModule } from '@ng-select/ng-select';
declare var bootstrap: any;

@Component({
  selector: 'app-employee-list',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule, 
    RouterModule,
    NgSelectModule,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {
  
  employees: DetailEmployeeDto[] = [];
  filteredEmployees: DetailEmployeeDto[] = [];
  params: Params = {};
  errorMessage!: ErrorMessage;
  keyword: FormControl = new FormControl('');
  selectRowsPerPage: FormControl = new FormControl(10);
  pagingData!: Paging;
  startRow: number = 1;
  currentPage: number = 1;
  pages: number[] = [];
  itemsRowPerPage = itemsRowPerPage;
  sortField: keyof DetailEmployeeDto = 'firstName';
  sortOrder: 'asc' | 'desc' = 'asc';
  selectedEmployee!: DetailEmployeeDto | null;
  

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.watchKeyword();
    this.activatedRoute.queryParams.subscribe({
      next: (params: Params) => {
        this.params = this.payloadParams(params);
        if (this.params['keyword']) this.keyword.patchValue(this.params['keyword']);
        if (this.params['rowsPerPage']) this.selectRowsPerPage.patchValue(+this.params['rowsPerPage']);
        if (this.params['page']) this.currentPage = +this.params['page'];
        this.loadData();
      }
    });
  }

  // __________________________________________ onLoad Function
  watchKeyword(): void {
    this.keyword.valueChanges.pipe(debounceTime(750), distinctUntilChanged())
    .subscribe((keyword: string) => {
      console.log('keyword', keyword);
      
      if (keyword) {
        this.params['keyword'] = keyword;
        this.params['page'] = 1;
      } else {
        delete this.params['keyword'];
        this.params['page'] = 1;
      }
      this.navigate();
    });
  }

  loadData(): void {
    this.employees = this.employeeService.getAll();
    this.watchFilterList();
  }

  watchFilterList(): void {
    this.filterQueryParam()
    this.filteredEmployees = this.employees.filter(emp =>
      Object.values(emp).some(val =>
        typeof val === 'string' && val.toLowerCase().includes(this.params['keyword'] || '')
      )
    );

    this.applySort();
    this.generatePages();
  }

  applySort(): void {
    this.filteredEmployees.sort((a, b) => {
      const valA = (a[this.sortField] || '').toString().toLowerCase();
      const valB = (b[this.sortField] || '').toString().toLowerCase();
      return this.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  generatePages(): void {
    const totalPages = Math.ceil(this.filteredEmployees.length / (+this.params['rowsPerPage'] || maxPages));
    const current = this.currentPage;
    const delta = 2;
    const range: number[] = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) range.unshift(-1);
    if (current + delta < totalPages - 1) range.push(-1);

    this.pages = [1, ...range, totalPages].filter((v, i, a) => v >= 1 && v <= totalPages && a.indexOf(v) === i);
    this.pagingData = {
      page: current,
      rowsPerPage: +this.params['rowsPerPage'] || maxPages,
      totalRows: this.filteredEmployees.length,
      totalPages: totalPages
    };

    this.startRow = (current - 1) * (+this.params['rowsPerPage'] || maxPages) + 1;
  }


  // __________________________________________ onChange / onClick Function
  deleteEmployee(username: string): void {
    if (confirm(`Are you sure to delete ${username}?`)) {
      this.employeeService.delete(username);
      this.loadData();
    }
  }

  openDeleteModal(emp: DetailEmployeeDto): void {
    this.selectedEmployee = emp;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }
  
  onDeleteEmployee(username: string) {
    this.employeeService.delete(username);
    this.loadData();
    bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
  }

  onChangeRowsData(value: number) {
    if (value) {
      this.params['rowsPerPage'] = value;
    } else {
      this.params['rowsPerPage'] = maxPages;
      this.selectRowsPerPage.setValue(maxPages);
    }
    
    this.params['page'] = 1;
    this.navigate();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.pagingData.totalPages) {
      this.params['page'] = page;
      this.navigate();
    }
  }

  
  // __________________________________________ helper onClick Function
  get paginatedEmployees(): DetailEmployeeDto[] {
    const startPage = (this.currentPage - 1) * (+this.params['rowsPerPage'] || maxPages);
    return this.filteredEmployees.slice(startPage, startPage + (+this.params['rowsPerPage'] || maxPages));
  }

  filterQueryParam() {
    const arrayParams = [
      'keyword',
      'page',
      'sort',
      'order',
      'rowsPerPage',
    ];
    for (let i = 0; i < arrayParams.length; i++) {
      const element = arrayParams[i];

      if (this.params[element] === '') {
        delete this.params[element];
      }
    }
  }

  navigate(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.params,
      replaceUrl: true,
    });
  }

  payloadParams(current: Params): Params {
    return {
      keyword: `${current['keyword'] ? current['keyword'] : ''}`,
      page: `${current['page'] ? current['page'] : 1}`,
      rowsPerPage: `${current['rowsPerPage'] ? current['rowsPerPage'] : maxPages}`,
      order: `${current['order'] ? current['order'] : ''}`,
      sort: `${current['sort'] ? current['sort'] : ''}`,
    };
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 400) {
      this.errorMessage = {
        ...this.errorMessage,
        statusCode: error.status,
        message: error?.error?.status?.description || error?.error?.message,
      };
      
    } else {
      this.errorMessage = {
        ...this.errorMessage,
        statusCode: error.status,
        message: error.statusText,
      };
    }
  }

  resetAlert(): void {
    this.errorMessage = {} as ErrorMessage;
  }
}
