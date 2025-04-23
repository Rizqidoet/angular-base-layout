import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../service/employee.service';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DetailEmployeeDto } from '../../model/employee.model';
import { CommonModule } from '@angular/common';
import { customCurrencyMask, groupNames, statusNames } from '../../../../shared/dto/types/constant';
import { NgxCurrencyDirective } from "ngx-currency";
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-employee-form',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    NgxCurrencyDirective,
    NgSelectModule
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent implements OnInit {
  employeeForm!: FormGroup;
  id!: string;
  employee!: DetailEmployeeDto;
  params: Params = {};
  customCurrencyMaskConfig = {
    ...customCurrencyMask,
    allowNegative: false,
  };
  today: string = new Date().toISOString().split('T')[0];
  filteredGroups = groupNames;
  filteredStatus = statusNames;

  constructor( 
    private readonly employeeService: EmployeeService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) { }

  // __________________________________________ onLoad Function
  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.employeeForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      birthDate: new FormControl(null, [Validators.required, this.maxDateValidator(this.today)]),
      basicSalary: new FormControl(0),
      status: new FormControl(null, [Validators.required]),
      group: new FormControl(null, [Validators.required]),
      description: new FormControl(null),
    });
  }


  // __________________________________________ onChange / onClick Function
  ngSubmit() {
    if (!this.employeeForm.valid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const formValue = this.employeeForm.value;
    console.log('formValue2', formValue);
  }


  // __________________________________________ helper Function
  maxDateValidator(max: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return control.value > max ? { max: true } : null;
    };
  }
}
