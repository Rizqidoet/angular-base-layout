import { Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users.component';
import { MenusComponent } from './pages/menus/menus.component';
import { PagesComponent } from './pages/pages.component';

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
    ]
  },
];
