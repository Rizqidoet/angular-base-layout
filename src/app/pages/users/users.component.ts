import { Component, OnInit } from '@angular/core';
import { UsersService } from './service/users.service';
import { UsersDto } from './model/users.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMessage } from '../../shared/dto/global-model.model';

@Component({
  selector: 'app-users',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: Array<UsersDto> = [];
  params: Params = {};
  errorMessage!: ErrorMessage;

  constructor(
    private userService: UsersService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe({
      next: (params: Params) => {
        this.params = params;
        this.getListUser();
      }
    })
  }

  getListUser() {
    this.params = this.payloadParams(this.params);
    this.filterQueryParam();
    this.userService.list(this.params).subscribe({
      next: (users) => {
        console.log('users', users);
        this.users = users.users;
      },
      error: () => {},
    })
  }



  // __________________________________________ Helper Function
  payloadParams(current: Params): Params {
    return {
      term: `${current['term'] ? current['term'] : ''}`,
      page: `${current['page'] ? current['page'] : 1}`,
      rowsPerPage: `${current['rowsPerPage'] ? current['rowsPerPage'] : 10}`,
      order: `${current['order'] ? current['order'] : ''}`,
      sort: `${current['sort'] ? current['sort'] : ''}`,
      limit: `${current['limit'] ? current['limit'] : 10}`,
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
      'term',
      'page',
      'sort',
      'order',
      'rowsPerPage',
      'limit'
    ];
    for (let i = 0; i < arrayParams.length; i++) {
      const element = arrayParams[i];

      if (this.params[element] === '') {
        delete this.params[element];
      }
    }
  }
}
