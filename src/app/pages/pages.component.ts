import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainMenuDto } from '../shared/dto/global-model.model';

@Component({
  selector: 'app-pages',
  imports: [CommonModule, RouterModule],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent {
  menus: Array<MainMenuDto> = [
    {
      label: 'User',
      path: 'users',
    },
    {
      label: 'Menu',
      path: 'menus',
    },
    {
      label: 'Employee',
      path: 'employees',
    },
  ];
}
