import { Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users.component';
import { MenusComponent } from './pages/menus/menus.component';
import { PagesComponent } from './pages/pages.component';
import { EmployeeListComponent } from './pages/employee/components/list/employee-list.component';

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
    ]
  },
];
