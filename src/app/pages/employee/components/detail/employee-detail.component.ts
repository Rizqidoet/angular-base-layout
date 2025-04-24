import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule, Params } from '@angular/router';
import { EmployeeService } from '../../service/employee.service';
import { DetailEmployeeDto } from '../../model/employee.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { statusNames } from '../../../../shared/dto/types/constant';
import { optionsStatusEnum } from '../../../../shared/dto/types/enum';

@Component({
  selector: 'app-employee-detail',
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent implements OnInit{
  employee!: DetailEmployeeDto;
  optionsStatus = optionsStatusEnum;
  backQueryParams: Params = {};
  
  constructor( 
    private readonly employeeService: EmployeeService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) { }

  // __________________________________________ onLoad Function
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const username = params['username'];
      if (username) this.employee = this.employeeService.getByUsername(username)!;
    });
    this.backQueryParams = this.activatedRoute.snapshot.queryParams;
  }
}
