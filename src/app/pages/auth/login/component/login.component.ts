import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ErrorMessage } from '../../../../shared/dto/global-model.model';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;
  showPassword: boolean = false;
  errorMessage!: ErrorMessage;

  constructor(
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  ngSubmit() {
    const userName = 'user123';
    const password = 'P@ssw0rd';
    const formValue = this.loginForm.value;
    console.log('formValue', formValue);
    this.resetAlert();
    if (formValue.username === userName && formValue.password === password) this.router.navigate(['/employees']);
    else this.handleError();
  }

  handleError() {
    this.errorMessage = {
      ...this.errorMessage,
      statusCode: 400,
      message: 'Username or password wrong'
    };
  }

  resetAlert(): void {
    this.errorMessage = {} as ErrorMessage;
  }
}
