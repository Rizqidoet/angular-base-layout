import { Component, OnInit } from '@angular/core';
import { EmployeeDto } from '../../model/employee.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { ErrorMessage, Paging } from '../../../../shared/dto/global-model.model';
import { EmployeeService } from '../../service/employee.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { itemsRowPerPage, maxPages } from '../../../../shared/dto/types/constant';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {
  employees!: EmployeeDto;
  params: Params = {};
  errorMessage!: ErrorMessage;
  keyword: FormControl = new FormControl('');
  pagingData!: Paging;
  startRow: number = 1;
  currentPage!: number;
  itemsRowPerPage = itemsRowPerPage;
  selectRowsPerPage: FormControl = new FormControl(this.params['rowsPerPage'] ? this.params['rowsPerPage'] : maxPages);
  pages: number[] = [];

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  // __________________________________________ onLoad Function
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe({
      next: (params: Params) => {
        if (params['keyword']) this.keyword.patchValue(params['keyword']); 
        this.params = params;
        this.watchKeyword();
        this.getListEmployee();
      }
    });
  }

  getListEmployee() {
    this.params = this.payloadParams(this.params);
    const { page } = this.params;
    if (page) {
      this.currentPage = page;
    }
    this.filterQueryParam();

    this.employeeService.list(this.params).subscribe({
      next: ([employee, paging]) => {
        this.employees = employee;
        this.pagingData = paging;
        this.currentPage = paging.page;
        this.generatePages();
        if (this.pagingData.page > 1) this.startRow = (this.pagingData.page - 1) * this.pagingData.rowsPerPage + 1;
        else this.startRow = 1;
      },
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  watchKeyword() {
    this.keyword.valueChanges.pipe(debounceTime(750), distinctUntilChanged())
      .subscribe((keyword: string) => {
        if (keyword) {
          this.params['keyword'] = keyword;
          this.params['page'] = 1;
          this.navigate();
        } else {
          delete this.params['keyword'];
          this.params['page'] = 1;
          this.navigate();
        }
    });
  }


  // __________________________________________ onChange / onClick Function
  onChangeRowsData(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
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
      this.params = {...this.params, page: page};
      this.navigate();
    }
  }


  // __________________________________________ Helper Function
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
      
      alert(`Request Failed, ${this.errorMessage.message}`);
    } else {
      this.errorMessage = {
        ...this.errorMessage,
        statusCode: error.status,
        message: error.statusText,
      };
      alert(`Something Went Wrong, ${this.errorMessage.message}`);
    }
  }

  navigate() {
    this.filterQueryParam();
    this.router.navigate([], {
        queryParams: this.params,
        relativeTo: this.activatedRoute,
        replaceUrl: true,
    }).then(() => {});
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

  generatePages() {
    const totalPage = this.pagingData.totalPages;
    const currentPage = this.currentPage;
    const maxButtonShow = 5;
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = startPage + maxButtonShow - 1;

    if (endPage > totalPage) {
      endPage = totalPage;
      startPage = Math.max(endPage - maxButtonShow + 1, 1);
    }

    this.pages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }

    if (endPage < totalPage) {
      this.pages.push(-1);
      this.pages.push(totalPage);
    }
  }
}
