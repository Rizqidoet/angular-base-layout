import { Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users.component';
import { MenusComponent } from './pages/menus/menus.component';
import { PagesComponent } from './pages/pages.component';
import { EmployeeListComponent } from './pages/employee/components/list/employee-list.component';
import { EmployeeFormComponent } from './pages/employee/components/form/employee-form.component';
import { EmployeeDetailComponent } from './pages/employee/components/detail/employee-detail.component';
import { LoginComponent } from './pages/auth/login/component/login.component';

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'menus',
        component: MenusComponent
      },
      {
        path: 'employees',
        component: EmployeeListComponent
      },
      {
        path: 'employees/form',
        component: EmployeeFormComponent
      },
      {
        path: 'employees/form/:username',
        component: EmployeeFormComponent
      },
      {
        path: 'employees/detail/:username',
        component: EmployeeDetailComponent
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
  }
];
